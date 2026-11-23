import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// On every route change: scroll to the top and move keyboard/screen-reader
// focus to the main content, so they start at the new page instead of the
// link they just activated.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const isFirstLoad = useRef(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}
