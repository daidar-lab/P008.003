import { Share2, Plus } from 'lucide-react'
import { useState } from 'react'

export default function TopBar() {
  const [active, setActive] = useState('This month')
  const tabs = ['This month', 'Last month', 'Custom']
  return (
    <div className="topbar">
      <h1 className="page-title">Overview</h1>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            className={`tab ${active === t ? 'active' : ''}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Share">
          <Share2 size={16} />
        </button>
        <button className="btn">
          <Plus size={15} strokeWidth={2.2} />
          <span>New Report</span>
        </button>
        <button className="btn btn-primary">
          <span>Upgrade to Plus</span>
        </button>
      </div>
    </div>
  )
}
