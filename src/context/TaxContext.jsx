import { createContext, useContext, useState } from 'react';

const TaxContext = createContext();

export function TaxProvider({ children }) {
  const [data, setData] = useState({
    ageGroup: '', // '<60', '60-79', '80+'
    inhand: '',
    pf: '',
    tds: '',
    pt: '',
    otherIncome: '',
    paysRent: false,
    monthlyRent: '',
    isMetro: false,
    hasHomeLoan: false,
    homeLoanInterest: '',
    invest80c: '',
    healthInsurance: '',
    nps: '',
  });

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <TaxContext.Provider value={{ data, updateData }}>
      {children}
    </TaxContext.Provider>
  );
}

export const useTaxData = () => useContext(TaxContext);
