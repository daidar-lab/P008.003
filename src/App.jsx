import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import StatCard from './components/StatCard.jsx'
import VentoAI from './components/VentoAI.jsx'
import TotalBalance from './components/TotalBalance.jsx'
import Performance from './components/Performance.jsx'
import SpentAmount from './components/SpentAmount.jsx'
import Spending from './components/Spending.jsx'
import Revenue from './components/Revenue.jsx'

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="grid row-1">
          <StatCard
            title="Total views"
            dotColor="#e5484d"
            value="253,056"
            delta="12% since last month"
            trend="down"
          />
          <StatCard
            title="Customers"
            dotColor="#d946ef"
            value="12,375"
            delta="7% since last month"
            trend="down"
          />
          <StatCard
            title="Orders"
            dotColor="#19b26b"
            value="23,845"
            delta="18% since last month"
            trend="down"
          />
          <VentoAI />
        </section>

        <section className="grid row-2">
          <TotalBalance />
          <Performance />
        </section>

        <section className="grid row-3">
          <SpentAmount />
          <Spending />
          <Revenue />
        </section>
      </main>
    </div>
  )
}
