import { useState } from 'react'
import {
  LayoutDashboard, MoreVertical,
  FolderOpen, ChevronDown, ChevronRight,
  ArrowRightLeft, ShoppingBag, Receipt, Building2, Layers, DollarSign
} from 'lucide-react'
import styles from './Sidebar.module.css'

const primary = [
  { icon: LayoutDashboard, label: 'Dashboard',        route: 'dashboard' },
  { icon: Receipt,         label: 'Entradas Fiscais', route: 'entradas-fiscais' },
  { icon: DollarSign,      label: 'Portal do Custo',  route: 'portal-do-custo' }
]

const cadastros = [
  { icon: ArrowRightLeft, label: 'Tipo de Entrada e Saída', route: 'tipos-entrada-saida' },
  { icon: ShoppingBag,    label: 'Produtos',                route: 'produtos' },
  { icon: Layers,         label: 'Grupo de Produtos',       route: 'grupos-produtos' },
  { icon: Building2,      label: 'Filiais',                 route: 'filiais' }
]

export default function Sidebar({ route, onNavigate }) {
  const cadastrosActive = cadastros.some(c => c.route === route)
  const [openCadastros, setOpenCadastros] = useState(cadastrosActive)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">
          <svg viewBox="0 0 64 64" width="18" height="18" fill="none">
            <path
              d="M17 33.5 L28 44 L47 21"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.logoWord}>
          <span className={styles.logoWord1}>Audit</span>
          <span className={styles.logoWord2}>Supply</span>
        </span>
      </div>

      <nav className={styles.nav}>
        {primary.map((item) => {
          const active = item.route && item.route === route
          return (
            <button
              key={item.label}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
              onClick={() => item.route && onNavigate(item.route)}
            >
              <item.icon size={16} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.kbd && <span className={styles.kbd}>{item.kbd}</span>}
            </button>
          )
        })}

        <button
          className={`${styles.navItem} ${cadastrosActive ? styles.active : ''}`}
          onClick={() => setOpenCadastros((v) => !v)}
        >
          <FolderOpen size={16} strokeWidth={1.8} />
          <span>Cadastros</span>
          <span className={styles.kbd} style={{ display: 'inline-flex' }}>
            {openCadastros ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </button>

        {openCadastros && (
          <div className={styles.navSubgroup}>
            {cadastros.map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem} ${styles.sub} ${item.route === route ? styles.active : ''}`}
                onClick={() => onNavigate(item.route)}
              >
                <item.icon size={14} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className={styles.profile}>
        <div className={styles.profileAvatar}>F</div>
        <div className={styles.profileInfo}>
          <span className={styles.name}>Felix</span>
          <span className={styles.mail}>felix@auditsupply.demo</span>
        </div>
        <button className={styles.profileMore} aria-label="More">
          <MoreVertical size={16} />
        </button>
      </div>
    </aside>
  )
}
