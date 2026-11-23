import Icon from '@/components/common/Icon.jsx'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/data/store.js'
import { usePageTitle } from '@/hooks/usePageTitle.js'
import { authService } from '@/services/authService.js'
import { createOrder, orderService } from '@/services/orderService.js'
import { selectUser } from '@/store/authSlice.js'
import {
  clearCart,
  selectCartItems,
  selectCartSubtotal
} from '@/store/cartSlice.js'
import { useAppDispatch, useAppSelector } from '@/store/hooks.js'
import { addToast } from '@/store/uiSlice.js'
import { formatPrice } from '@/utils/formatPrice.js'
import { formatSize } from '@/utils/productHelpers.js'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Checkout.scss'

const initialForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
}

export default function Checkout() {
  const dispatch = useAppDispatch()
  usePageTitle('Checkout')
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const user = useAppSelector(selectUser)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const confirmHeadingRef = useRef(null)

  // Auto-fill form from saved address (for signed-in users) or basic user info
  useEffect(() => {
    if (user) {
      const savedAddress = authService.getAddress(user.email)
      if (savedAddress) {
        // Use saved address (full auto-fill for returning customers)
        setForm({
          fullName: savedAddress.fullName || user.name || '',
          email: savedAddress.email || user.email || '',
          address: savedAddress.address || '',
          city: savedAddress.city || '',
          postalCode: savedAddress.postalCode || '',
          country: savedAddress.country || ''
        })
      } else {
        // First-time signed-in user: just fill name and email
        setForm((f) => ({
          ...f,
          fullName: user.name || '',
          email: user.email || ''
        }))
      }
    }
  }, [user])

  // After placing the order the page content changes completely, so move
  // keyboard/screen-reader focus to the confirmation heading.
  useEffect(() => {
    if (placed) confirmHeadingRef.current?.focus()
  }, [placed])

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Required'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = 'Enter a valid email'
    if (!form.address.trim()) next.address = 'Required'
    if (!form.city.trim()) next.city = 'Required'
    if (!/^[A-Za-z0-9 -]{3,10}$/.test(form.postalCode.trim()))
      next.postalCode = 'Enter a valid postal code'
    if (!form.country.trim()) next.country = 'Required'
    setErrors(next)
    return next
  }

  const placeOrder = (e) => {
    e.preventDefault()
    const formErrors = validate()
    const invalidFields = Object.keys(formErrors)
    if (invalidFields.length > 0) {
      dispatch(addToast('Please check the highlighted fields', 'error'))
      // Move focus to the first field with a problem (inputs are named
      // after the form keys, so `elements` can look them up).
      e.currentTarget.elements[invalidFields[0]]?.focus()
      return
    }

    // Trim the text so " Jane " and "Jane" are stored the same way.
    const shippingAddress = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim()
    }

    // Build the order — keyed by checkout email for reconciliation
    const newOrder = createOrder({
      items,
      subtotal,
      shipping,
      total,
      shippingAddress
    })

    try {
      // orderService.add throws if persistence fails (e.g. storage full).
      orderService.add(newOrder)

      // Save shipping address for signed-in users (faster future checkouts)
      if (user) {
        authService.saveAddress(user.email, shippingAddress)
      }

      // Only show the confirmation once the order is safely persisted.
      setOrderData(newOrder)
      setPlaced(true)
      dispatch(clearCart())
      dispatch(addToast('Order placed successfully'))
      window.scrollTo({ top: 0 })
    } catch (err) {
      dispatch(
        addToast(
          err.message ?? 'Something went wrong placing your order',
          'error'
        )
      )
    }
  }

  // --- Confirmation --------------------------------------------------------
  if (placed && orderData) {
    const isGuest = !user

    return (
      <div className="checkout-confirm container section">
        <motion.div
          className="checkout-confirm__card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="checkout-confirm__tick">
            <Icon
              name="check"
              size={34}
            />
          </span>
          <p className="overline">Thank you</p>
          <h1
            ref={confirmHeadingRef}
            tabIndex={-1}
          >
            Your order is confirmed
          </h1>
          <p className="checkout-confirm__sub">
            Your order number is <strong>{orderData.id}</strong>. This is a demo
            store, so no email is sent. You can find the order under{' '}
            <strong>{orderData.shippingAddress.email}</strong> in your order
            history.
          </p>

          {/* Account creation prompt for guest users */}
          {isGuest && (
            <div className="checkout-confirm__account-prompt">
              <Icon
                name="user"
                size={20}
              />
              <div className="checkout-confirm__account-text">
                <strong>Create an account to track this order</strong>
                <p>
                  Save your details for faster checkout and view your order
                  history anytime.
                </p>
              </div>
              <Link
                to="/account"
                state={{
                  prefillEmail: orderData.shippingAddress.email,
                  prefillName: orderData.shippingAddress.fullName,
                  mode: 'signup'
                }}
                className="btn btn--sm"
              >
                Create account
              </Link>
            </div>
          )}

          <div className="checkout-confirm__actions">
            <Link
              to="/account"
              state={{ tab: 'orders' }}
              className="btn"
            >
              {isGuest ? 'Sign in' : 'View order history'}
            </Link>
            <Link
              to="/shop"
              className="btn btn--outline"
            >
              Continue shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // --- Empty cart ----------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="checkout-empty container section">
        <Icon
          name="bag"
          size={48}
        />
        <h1>Your bag is empty</h1>
        <p>Add some pieces before heading to checkout.</p>
        <Link
          to="/shop"
          className="btn"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  // --- Checkout form -------------------------------------------------------
  return (
    <div className="checkout container">
      <header className="checkout__head">
        <p className="overline">Secure checkout</p>
        <h1>Checkout</h1>
      </header>

      <div className="checkout__grid">
        <form
          className="checkout__form"
          onSubmit={placeOrder}
          noValidate
        >
          {!user && (
            <div className="checkout__signin-note">
              <Icon
                name="user"
                size={18}
              />
              <span>
                Have an account? <Link to="/account">Sign in</Link> for a faster
                checkout.
              </span>
            </div>
          )}

          <p className="checkout__required-note">All fields are required.</p>

          <fieldset className="checkout__fieldset">
            <legend>Contact</legend>
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                value={form.fullName}
                onChange={update('fullName')}
                name="fullName"
                aria-required="true"
                aria-invalid={!!errors.fullName}
                placeholder="Jane Doe"
                autoComplete="name"
              />
              {errors.fullName && (
                <em
                  className="field__err"
                  role="alert"
                >
                  {errors.fullName}
                </em>
              )}
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                name="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <em
                  className="field__err"
                  role="alert"
                >
                  {errors.email}
                </em>
              )}
            </label>
          </fieldset>

          <fieldset className="checkout__fieldset">
            <legend>Shipping address</legend>
            <label className="field">
              <span>Address</span>
              <input
                type="text"
                value={form.address}
                onChange={update('address')}
                name="address"
                aria-required="true"
                aria-invalid={!!errors.address}
                placeholder="123 Market Street"
                autoComplete="address-line1"
              />
              {errors.address && (
                <em
                  className="field__err"
                  role="alert"
                >
                  {errors.address}
                </em>
              )}
            </label>
            <div className="checkout__row">
              <label className="field">
                <span>City</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={update('city')}
                  name="city"
                  aria-required="true"
                  aria-invalid={!!errors.city}
                  placeholder="New York"
                  autoComplete="address-level2"
                />
                {errors.city && (
                  <em
                    className="field__err"
                    role="alert"
                  >
                    {errors.city}
                  </em>
                )}
              </label>
              <label className="field">
                <span>Postal code</span>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={update('postalCode')}
                  name="postalCode"
                  aria-required="true"
                  aria-invalid={!!errors.postalCode}
                  placeholder="10001"
                  autoComplete="postal-code"
                />
                {errors.postalCode && (
                  <em
                    className="field__err"
                    role="alert"
                  >
                    {errors.postalCode}
                  </em>
                )}
              </label>
            </div>
            <label className="field">
              <span>Country</span>
              <input
                type="text"
                value={form.country}
                onChange={update('country')}
                name="country"
                aria-required="true"
                aria-invalid={!!errors.country}
                placeholder="United States"
                autoComplete="country-name"
              />
              {errors.country && (
                <em
                  className="field__err"
                  role="alert"
                >
                  {errors.country}
                </em>
              )}
            </label>
          </fieldset>

          <button
            className="btn btn--block checkout__submit"
            type="submit"
          >
            <Icon
              name="shield"
              size={18}
            />{' '}
            Place order · {formatPrice(total)}
          </button>
          <p className="checkout__disclaimer">
            This is a demo store. No payment is taken and no order is shipped.
          </p>
        </form>

        {/* Order summary */}
        <aside className="checkout__summary">
          <h2>Order summary</h2>
          <ul className="checkout__lines">
            {items.map((item) => (
              <li
                key={item.key}
                className="checkout__line"
              >
                <div className="checkout__line-img">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                  />
                  <span className="checkout__line-qty">{item.quantity}</span>
                </div>
                <div className="checkout__line-info">
                  <p>{item.name}</p>
                  <span>
                    {item.color} · {formatSize(item.size)}
                  </span>
                </div>
                <span className="checkout__line-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="checkout__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="checkout__grand">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
