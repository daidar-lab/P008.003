import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import Overview2 from './pages/Overview2.jsx'
import TiposEntradaSaida from './pages/TiposEntradaSaida.jsx'
import Produtos from './pages/Produtos.jsx'
import EntradasFiscais from './pages/EntradasFiscais.jsx'
import Filiais from './pages/Filiais.jsx'

const ROUTES = {
  'tipos-entrada-saida': TiposEntradaSaida,
  'produtos': Produtos,
  'filiais': Filiais,
  'entradas-fiscais': EntradasFiscais,
  'overview': Overview,
  'overview-2': Overview2
}

export default function App() {
  const [route, setRoute] = useState('overview')
  const Page = ROUTES[route] || Overview

  return (
    <div className="app">
      <Sidebar route={route} onNavigate={setRoute} />
      <main className="main">
        <Page />
      </main>
    </div>
  )
}
