// Tax Calculation Engine (FY 2025-26)

const calculateSlabTax = (income, slabs) => {
  let tax = 0;
  for (let i = 0; i < slabs.length; i++) {
    const { limit, rate, prevLimit } = slabs[i];
    if (income > prevLimit) {
      const taxableAmountInSlab = Math.min(income, limit) - prevLimit;
      tax += taxableAmountInSlab * rate;
    } else {
      break;
    }
  }
  return tax;
};

const calculateMarginalRelief = (income, threshold, taxCalculated) => {
  // Marginal relief: Tax payable cannot exceed the amount by which income exceeds the threshold.
  if (income > threshold) {
    const excessIncome = income - threshold;
    if (taxCalculated > excessIncome) {
      return taxCalculated - excessIncome; // The amount of relief to subtract from tax
    }
  }
  return 0;
};

export const calculateNewRegime = (annualGross, pt) => {
  const stdDeduction = 75000;
  const appliedDeductions = Math.min(annualGross, stdDeduction + pt);
  
  // Taxable Income Calculation
  let taxableIncome = annualGross - appliedDeductions;
  if (taxableIncome < 0) taxableIncome = 0;

  // New Regime Slabs FY 25-26
  const slabs = [
    { prevLimit: 0, limit: 400000, rate: 0.00 },
    { prevLimit: 400000, limit: 800000, rate: 0.05 },
    { prevLimit: 800000, limit: 1200000, rate: 0.10 },
    { prevLimit: 1200000, limit: 1600000, rate: 0.15 },
    { prevLimit: 1600000, limit: 2000000, rate: 0.20 },
    { prevLimit: 2000000, limit: 2400000, rate: 0.25 },
    { prevLimit: 2400000, limit: Infinity, rate: 0.30 },
  ];

  let tax = calculateSlabTax(taxableIncome, slabs);

  // Section 87A Rebate
  if (taxableIncome <= 1200000) {
    tax = 0;
  } else {
    // Marginal Relief
    const relief = calculateMarginalRelief(taxableIncome, 1200000, tax);
    tax -= relief;
  }

  // Surcharge Calculation
  let surcharge = 0;
  if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;

  // Health & Education Cess
  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;

  return {
    annualGross,
    totalDeductions: appliedDeductions,
    taxableIncome,
    baseTax: tax,
    surcharge,
    cess,
    totalTax: Math.floor(totalTax)
  };
};

export const calculateOldRegime = (annualGross, ageGroup, pt, investments = {}, housing = {}) => {
  const stdDeduction = 50000;
  
  let housingDeduction = 0;
  let investmentDeduction = 0;

  // 1. Section 24(b) - Home Loan Interest
  if (housing.hasHomeLoan && housing.homeLoanInterest) {
    const interest = Number(housing.homeLoanInterest);
    housingDeduction += Math.min(interest, 200000); // Max 2L limit
  }

  // 2. HRA Exemption Calculation
  if (housing.paysRent && housing.monthlyRent) {
    const annualRent = Number(housing.monthlyRent) * 12;
    const basicSalary = annualGross * 0.50; // Engine assumes Basic is 50% of Gross
    const actualHRA = annualGross * 0.20; // Engine assumes HRA is 20% of Gross

    const rentMinus10PercentBasic = annualRent - (0.10 * basicSalary);
    const basicPercentageLimit = housing.isMetro ? (0.50 * basicSalary) : (0.40 * basicSalary);

    // HRA Exemption is the minimum of the three
    if (rentMinus10PercentBasic > 0) {
      const hraExemption = Math.min(actualHRA, rentMinus10PercentBasic, basicPercentageLimit);
      housingDeduction += hraExemption;
    }
  }

  // 3. Investment Deductions
  // Section 80C: PF + User Input 80C. Capped at 1.5L.
  const pfAnnual = Number(investments.pf) || 0;
  const user80c = Number(investments.invest80c) || 0;
  const total80c = pfAnnual + user80c;
  investmentDeduction += Math.min(total80c, 150000);

  // Section 80D: Health Insurance. Capped based on age.
  const healthPremium = Number(investments.healthInsurance) || 0;
  const healthCap = (ageGroup === '60-79' || ageGroup === '80+') ? 50000 : 25000;
  investmentDeduction += Math.min(healthPremium, healthCap);

  // Section 80CCD(1B): NPS. Capped at 50k.
  const npsInvested = Number(investments.nps) || 0;
  investmentDeduction += Math.min(npsInvested, 50000);

  const totalDeductions = housingDeduction + investmentDeduction;
  const appliedDeductions = Math.min(annualGross, stdDeduction + pt + totalDeductions);

  // Taxable Income Calculation
  let taxableIncome = annualGross - appliedDeductions;
  if (taxableIncome < 0) taxableIncome = 0;

  // Old Regime Slabs (Age Dependent)
  let slabs;
  if (ageGroup === '80+') {
    slabs = [
      { prevLimit: 0, limit: 500000, rate: 0.00 },
      { prevLimit: 500000, limit: 1000000, rate: 0.20 },
      { prevLimit: 1000000, limit: Infinity, rate: 0.30 },
    ];
  } else if (ageGroup === '60-79') {
    slabs = [
      { prevLimit: 0, limit: 300000, rate: 0.00 },
      { prevLimit: 300000, limit: 500000, rate: 0.05 },
      { prevLimit: 500000, limit: 1000000, rate: 0.20 },
      { prevLimit: 1000000, limit: Infinity, rate: 0.30 },
    ];
  } else {
    // Default <60
    slabs = [
      { prevLimit: 0, limit: 250000, rate: 0.00 },
      { prevLimit: 250000, limit: 500000, rate: 0.05 },
      { prevLimit: 500000, limit: 1000000, rate: 0.20 },
      { prevLimit: 1000000, limit: Infinity, rate: 0.30 },
    ];
  }

  let tax = calculateSlabTax(taxableIncome, slabs);

  // Section 87A Rebate
  if (taxableIncome <= 500000) {
    tax = 0;
  } else {
    // Marginal Relief
    const relief = calculateMarginalRelief(taxableIncome, 500000, tax);
    tax -= relief;
  }

  // Surcharge Calculation
  let surcharge = 0;
  if (taxableIncome > 50000000) surcharge = tax * 0.37;
  else if (taxableIncome > 20000000) surcharge = tax * 0.25;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;
  else if (taxableIncome > 5000000) surcharge = tax * 0.10;

  // Health & Education Cess
  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;

  return {
    annualGross,
    totalDeductions: appliedDeductions,
    taxableIncome,
    baseTax: tax,
    surcharge,
    cess,
    totalTax: Math.floor(totalTax)
  };
};
