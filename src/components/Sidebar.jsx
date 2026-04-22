import {
  Home, Package, Bell, Search, FileBarChart, Plus, MoreVertical
} from 'lucide-react'

const nav = [
  { icon: Home, label: 'Home', active: true },
  { icon: Package, label: 'Inventory' },
  { icon: Bell, label: 'Notification', kbd: '⌘N' },
  { icon: Search, label: 'Search', kbd: '⌘S' },
  { icon: FileBarChart, label: 'Report Builder' }
]

const dashboard = [
  { label: 'Customer', color: '#f59e0b' },
  { label: 'Performance', color: '#f5c518' },
  { label: 'Tracking', color: '#7a4a1f' },
  { label: 'Finance', color: '#e5484d' },
  { label: 'Marketing', color: '#e5484d' }
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-mark">V</span>
        <span>Vento®</span>
      </div>

      <nav className="nav">
        {nav.map((item) => (
          <button key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
            <item.icon size={16} strokeWidth={1.8} />
            <span>{item.label}</span>
            {item.kbd && <span className="kbd">{item.kbd}</span>}
          </button>
        ))}
      </nav>

      <div className="nav-section">My dashboard</div>
      <nav className="nav">
        {dashboard.map((item) => (
          <button key={item.label} className="nav-item">
            <span className="dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </button>
        ))}
        <button className="add-new">
          <Plus size={16} strokeWidth={2.2} />
          <span>Add new</span>
        </button>
      </nav>

      <div className="profile">
        <div className="profile-avatar">F</div>
        <div className="profile-info">
          <span className="name">Felix</span>
          <span className="mail">felix@vento.demo</span>
        </div>
        <button className="profile-more" aria-label="More">
          <MoreVertical size={16} />
        </button>
      </div>
    </aside>
  )
}
