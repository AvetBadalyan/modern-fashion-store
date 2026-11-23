import Icon from '@/components/common/Icon.jsx'
import { chartForCategory } from '@/data/sizeCharts.js'
import { useFocusTrap } from '@/hooks/useFocusTrap.js'
import { useModalDismiss } from '@/hooks/useModalDismiss.js'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import './SizeGuideModal.scss'

export default function SizeGuideModal({ open, onClose, category }) {
  const panelRef = useRef(null)
  useFocusTrap(panelRef, open)
  useModalDismiss(open, onClose)

  const isShoes = category === 'shoes'
  const table = chartForCategory(category)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sizeguide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="sizeguide__panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sizeguide__head">
              <div>
                <p className="overline">Fit &amp; sizing</p>
                <h2>{table.title} size guide</h2>
              </div>
              <button
                className="sizeguide__close"
                onClick={onClose}
                aria-label="Close size guide"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="sizeguide__table-wrap">
              <table className="sizeguide__table">
                <thead>
                  <tr>
                    {table.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          data-label={table.head[i]}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="sizeguide__note">
              {isShoes
                ? 'Measure your foot from heel to longest toe. If you fall between sizes, we recommend sizing up.'
                : 'Measurements are body measurements, not garment dimensions. If you fall between sizes, size up for a relaxed fit.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
