import { FREE_SHIPPING_THRESHOLD } from '@/data/store.js'
import './AnnouncementBar.scss'

const messages = [
  `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}`,
  'Complimentary returns within 30 days',
  'New season · New arrivals dropping weekly'
]

export default function AnnouncementBar() {
  return (
    <div
      className="announcement"
      role="region"
      aria-label="Store announcements"
    >
      <div className="announcement__track">
        {[...messages, ...messages].map((m, i) => (
          <span
            key={`${i}-${m}`}
            className="announcement__item"
            // The second copy only exists to make the loop seamless.
            aria-hidden={i >= messages.length ? 'true' : undefined}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
