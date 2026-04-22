import { useState } from 'react'
import {
  Home, Package, Bell, Search, FileBarChart, Plus, MoreVertical,
  FolderOpen, ChevronDown, ChevronRight, ArrowRightLeft, ShoppingBag, Receipt
} from 'lucide-react'

const primary = [
  { icon: Home, label: 'Home', route: 'overview' },
  { icon: Package, label: 'Inventory' },
  { icon: Bell, label: 'Notification', kbd: '⌘N' },
  { icon: Search, label: 'Search', kbd: '⌘S' },
  { icon: FileBarChart, label: 'Report Builder' }
]

const cadastros = [
  { icon: ArrowRightLeft, label: 'Tipo de Entrada e Saída', route: 'tipos-entrada-saida' },
  { icon: ShoppingBag,    label: 'Produtos',                route: 'produtos' },
  { icon: Receipt,        label: 'Entradas Fiscais',        route: 'entradas-fiscais' }
]

const dashboard = [
  { label: 'Customer', color: '#f59e0b' },
  { label: 'Performance', color: '#f5c518' },
  { label: 'Tracking', color: '#7a4a1f' },
  { label: 'Finance', color: '#e5484d' },
  { label: 'Marketing', color: '#e5484d' }
]

export default function Sidebar({ route, onNavigate }) {
  const cadastrosActive = cadastros.some(c => c.route === route)
  const [openCadastros, setOpenCadastros] = useState(cadastrosActive)

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-mark">V</span>
        <span>Vento®</span>
      </div>

      <nav className="nav">
        {primary.map((item) => {
          const active = item.route && item.route === route
          return (
            <button
              key={item.label}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => item.route && onNavigate(item.route)}
            >
              <item.icon size={16} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.kbd && <span className="kbd">{item.kbd}</span>}
            </button>
          )
        })}

        <button
          className={`nav-item ${cadastrosActive ? 'active' : ''}`}
          onClick={() => setOpenCadastros((v) => !v)}
        >
          <FolderOpen size={16} strokeWidth={1.8} />
          <span>Cadastros</span>
          <span className="kbd" style={{ display: 'inline-flex' }}>
            {openCadastros ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </button>

        {openCadastros && (
          <div className="nav-subgroup">
            {cadastros.map((item) => (
              <button
                key={item.label}
                className={`nav-item sub ${item.route === route ? 'active' : ''}`}
                onClick={() => onNavigate(item.route)}
              >
                <item.icon size={14} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
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
