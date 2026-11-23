import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'
import ScrollToTop from '@/components/common/ScrollToTop.jsx'
import Layout from '@/components/layout/Layout.jsx'
import { useAppSelector } from '@/store/hooks.js'
import { selectTheme } from '@/store/uiSlice.js'
import { lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

// Route-level code splitting: each page ships as its own chunk so the initial
// bundle only carries the shell plus the first route the visitor lands on.
const Home = lazy(() => import('@/pages/Home.jsx'))
const Shop = lazy(() => import('@/pages/Shop.jsx'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail.jsx'))
const Wishlist = lazy(() => import('@/pages/Wishlist.jsx'))
const Checkout = lazy(() => import('@/pages/Checkout.jsx'))
const Auth = lazy(() => import('@/pages/Auth.jsx'))
const NotFound = lazy(() => import('@/pages/NotFound.jsx'))

// Static pages (shipping, size guide, contact) - named exports need wrapper
const ShippingReturns = lazy(() =>
  import('@/pages/StaticPages.jsx').then((m) => ({
    default: m.ShippingReturns
  }))
)
const SizeGuidePage = lazy(() =>
  import('@/pages/StaticPages.jsx').then((m) => ({ default: m.SizeGuidePage }))
)
const Contact = lazy(() =>
  import('@/pages/StaticPages.jsx').then((m) => ({ default: m.Contact }))
)

export default function App() {
  const theme = useAppSelector(selectTheme)

  // Apply the active theme to <html data-theme> whenever it changes. The
  // initial value is also set in main.jsx before render to avoid a flash.
  // The browser UI colour (<meta name="theme-color">) follows the theme too.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#161719' : '#faf9f7')
  }, [theme])

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route
            path="shop"
            element={<Shop />}
          />
          <Route
            path="shop/:categoryId"
            element={<Shop />}
          />
          <Route
            path="product/:productId"
            element={<ProductDetail />}
          />
          <Route
            path="wishlist"
            element={<Wishlist />}
          />
          <Route
            path="checkout"
            element={<Checkout />}
          />
          <Route
            path="account"
            element={<Auth />}
          />
          <Route
            path="shipping-returns"
            element={<ShippingReturns />}
          />
          <Route
            path="size-guide"
            element={<SizeGuidePage />}
          />
          <Route
            path="contact"
            element={<Contact />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
