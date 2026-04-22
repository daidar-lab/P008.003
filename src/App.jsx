import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import TiposEntradaSaida from './pages/TiposEntradaSaida.jsx'

export default function App() {
  const [route, setRoute] = useState('overview')

  return (
    <div className="app">
      <Sidebar route={route} onNavigate={setRoute} />

      <main className="main">
        {route === 'tipos-entrada-saida'
          ? <TiposEntradaSaida />
          : <Overview />}
      </main>
    </div>
  )
}
