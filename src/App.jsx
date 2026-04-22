import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import TiposEntradaSaida from './pages/TiposEntradaSaida.jsx'
import Produtos from './pages/Produtos.jsx'
import EntradasFiscais from './pages/EntradasFiscais.jsx'

const ROUTES = {
  'tipos-entrada-saida': TiposEntradaSaida,
  'produtos': Produtos,
  'entradas-fiscais': EntradasFiscais,
  'overview': Overview
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
