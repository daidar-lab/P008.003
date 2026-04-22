import { useState } from 'react'
import {
  Home, MoreVertical,
  FolderOpen, ChevronDown, ChevronRight,
  ArrowRightLeft, ShoppingBag, Receipt, Building2
} from 'lucide-react'

const primary = [
  { icon: Home,    label: 'Home',             route: 'overview' },
  { icon: Home,    label: 'Home 2',           route: 'overview-2' },
  { icon: Receipt, label: 'Entradas Fiscais', route: 'entradas-fiscais' }
]

const cadastros = [
  { icon: ArrowRightLeft, label: 'Tipo de Entrada e Saída', route: 'tipos-entrada-saida' },
  { icon: ShoppingBag,    label: 'Produtos',                route: 'produtos' },
  { icon: Building2,      label: 'Filiais',                 route: 'filiais' }
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
