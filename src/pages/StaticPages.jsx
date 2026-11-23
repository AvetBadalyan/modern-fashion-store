import Icon from '@/components/common/Icon.jsx'
import { MEN_CHART, SHOE_CHART, WOMEN_CHART } from '@/data/sizeCharts.js'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/data/store.js'
import { usePageTitle } from '@/hooks/usePageTitle.js'
import { Link } from 'react-router-dom'
import './StaticPages.scss'

// Shared layout for simple informational pages
function PageLayout({ title, children }) {
  usePageTitle(title)
  return (
    <div className="static-page container">
      <nav
        className="static-page__crumbs"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>
        <Icon
          name="chevronRight"
          size={14}
        />
        <span>{title}</span>
      </nav>
      <h1 className="static-page__title">{title}</h1>
      <div className="static-page__content">{children}</div>
    </div>
  )
}

export function ShippingReturns() {
  return (
    <PageLayout title="Shipping & Returns">
      <section className="static-page__section">
        <h2>Shipping</h2>
        <p>
          We offer free standard shipping on all orders over $
          {FREE_SHIPPING_THRESHOLD}. Orders are typically processed within 1-2
          business days and delivered within 3-7 business days depending on your
          location.
        </p>
        <ul>
          <li>
            <strong>Standard shipping:</strong> 3-7 business days. Free on
            orders over ${FREE_SHIPPING_THRESHOLD}, otherwise ${SHIPPING_COST}.
          </li>
        </ul>
      </section>

      <section className="static-page__section">
        <h2>Returns</h2>
        <p>
          We want you to love your purchase. If you're not completely satisfied,
          you can return unworn items within 30 days of delivery for a full
          refund.
        </p>
        <ul>
          <li>
            Items must be unworn, unwashed, and have all original tags attached
          </li>
          <li>Return shipping is free for all US orders</li>
          <li>
            Refunds are processed within 5-7 business days of receiving your
            return
          </li>
        </ul>
      </section>

      <section className="static-page__section">
        <h2>How to return</h2>
        <ol>
          <li>
            <Link to="/contact">Contact us</Link> with your order number
          </li>
          <li>We email you a prepaid return label</li>
          <li>Drop the parcel off at any carrier location</li>
        </ol>
      </section>

      <p className="static-page__disclaimer">
        <em>This is a demo store. No orders are shipped.</em>
      </p>
    </PageLayout>
  )
}

export function SizeGuidePage() {
  return (
    <PageLayout title="Size Guide">
      <p className="static-page__intro">
        Find your perfect fit with our comprehensive size guide. All
        measurements are body measurements in inches unless otherwise noted.
      </p>

      {[WOMEN_CHART, MEN_CHART, SHOE_CHART].map((chart) => (
        <section
          key={chart.title}
          className="static-page__section"
        >
          <h2>{chart.title}</h2>
          <div className="static-page__table-wrap">
            <table className="static-page__table">
              <thead>
                <tr>
                  {chart.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="static-page__section">
        <h2>How to Measure</h2>
        <ul>
          <li>
            <strong>Chest:</strong> Measure around the fullest part of your
            chest, keeping the tape horizontal.
          </li>
          <li>
            <strong>Waist:</strong> Measure around your natural waistline,
            keeping the tape comfortably loose.
          </li>
          <li>
            <strong>Hip:</strong> Measure around the fullest part of your hips.
          </li>
          <li>
            <strong>Foot:</strong> Stand on a piece of paper and trace your
            foot. Measure from heel to longest toe.
          </li>
        </ul>
        <p className="static-page__note">
          If you fall between sizes, we recommend sizing up for a more relaxed
          fit.
        </p>
      </section>
    </PageLayout>
  )
}

export function Contact() {
  return (
    <PageLayout title="Contact Us">
      <p className="static-page__intro">
        We're here to help! Reach out to our customer service team with any
        questions about orders, products, or general inquiries.
      </p>

      <section className="static-page__section">
        <h2>Customer Service</h2>
        <div className="static-page__contact-grid">
          <div className="static-page__contact-card">
            <Icon
              name="user"
              size={24}
            />
            <h3>Email</h3>
            <p>hello@modern-fashion.com</p>
            <span>Response within 24 hours</span>
          </div>
          <div className="static-page__contact-card">
            <Icon
              name="truck"
              size={24}
            />
            <h3>Order Inquiries</h3>
            <p>orders@modern-fashion.com</p>
            <span>Track, modify, or return orders</span>
          </div>
        </div>
      </section>

      <section className="static-page__section">
        <h2>Hours of Operation</h2>
        <ul>
          <li>
            <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST
          </li>
          <li>
            <strong>Saturday:</strong> 10:00 AM - 4:00 PM EST
          </li>
          <li>
            <strong>Sunday:</strong> Closed
          </li>
        </ul>
      </section>

      <section className="static-page__section">
        <h2>Frequently Asked Questions</h2>
        <div className="static-page__faq">
          <details>
            <summary>How do I track my order?</summary>
            <p>
              Once your order ships, you'll receive an email with tracking
              information. You can also track your order by signing into your
              account and viewing your order history.
            </p>
          </details>
          <details>
            <summary>Can I modify or cancel my order?</summary>
            <p>
              Orders can be modified or cancelled within 1 hour of placement.
              After that, please contact us and we'll do our best to accommodate
              your request before the order ships.
            </p>
          </details>
          <details>
            <summary>Do you ship internationally?</summary>
            <p>
              Currently, we ship to the United States only. We're working on
              expanding our shipping options — sign up for our newsletter to be
              notified when international shipping becomes available.
            </p>
          </details>
        </div>
      </section>

      <p className="static-page__disclaimer">
        <em>This is a demo store. No real customer service is available.</em>
      </p>
    </PageLayout>
  )
}
