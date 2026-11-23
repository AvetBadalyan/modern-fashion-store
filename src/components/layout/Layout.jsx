import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import RouteFallback from '@/components/common/RouteFallback.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CartDrawer from '@/components/cart/CartDrawer.jsx'
import QuickViewModal from '@/components/product/QuickViewModal.jsx'
import ToastStack from '@/components/common/ToastStack.jsx'
import AnnouncementBar from './AnnouncementBar.jsx'
import './Layout.scss'

export default function Layout() {
  return (
    <div className="layout">
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      <AnnouncementBar />
      <Navbar />
      {/* Suspense lives here (not around the whole app) so the header stays
          on screen while a page chunk loads. The footer is inside it too: it
          appears together with the page, so it never jumps down from the
          middle of the screen once the page content arrives. */}
      <Suspense fallback={<RouteFallback />}>
        <main
          id="main-content"
          className="layout__main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
        <Footer />
      </Suspense>

      {/* Global overlays */}
      <CartDrawer />
      <QuickViewModal />
      <ToastStack />
    </div>
  )
}
