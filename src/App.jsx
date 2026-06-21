import { TaxProvider } from './context/TaxContext'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <TaxProvider>
      <Dashboard />
    </TaxProvider>
  )
}
