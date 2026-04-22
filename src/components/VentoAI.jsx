import { Sparkles, Mic, Pin } from 'lucide-react'

const items = [
  {
    key: 'rev',
    icon: '💙',
    title: 'Revenue',
    text: 'Check how much revenue has been generated this month and how it compares to your monthly goal.'
  },
  {
    key: 'prof',
    icon: '💚',
    title: 'Profit',
    text: 'See your current profit margin, and evaluate if operations are staying efficient and cost-effective.'
  },
  {
    key: 'spend',
    icon: '🧡',
    title: 'Spending',
    text: 'Review where the majority of your expenses are going and spot any categories with high or unexpected costs.'
  }
]

export default function VentoAI() {
  return (
    <div className="card ai-card">
      <div className="ai-header">
        <span className="ai-badge">
          <Sparkles size={12} /> Audit AI
        </span>
        <span className="ai-pin">
          <Pin size={11} /> Pin
        </span>
      </div>

      <div className="ai-title">
        <span role="img" aria-label="wave">👋</span> Ask me anything
      </div>

      <div className="ai-list">
        {items.map((it) => (
          <div key={it.key} className={`ai-item ${it.key}`}>
            <div className="t">
              <span>{it.icon}</span>
              <span>{it.title}</span>
            </div>
            <div>{it.text}</div>
          </div>
        ))}
      </div>

      <div className="ai-input">
        <Sparkles size={14} className="spark" />
        <span>Just ask me anything!</span>
        <Mic size={14} className="mic" />
      </div>
    </div>
  )
}
