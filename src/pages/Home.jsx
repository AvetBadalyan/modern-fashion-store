import Icon from '@/components/common/Icon.jsx'
import ProductCard from '@/components/product/ProductCard.jsx'
import { CATEGORIES, PRODUCTS, img, imgSrcSet } from '@/data/products.js'
import { usePageTitle } from '@/hooks/usePageTitle.js'
import { resetFilters, setNewOnly } from '@/store/filtersSlice.js'
import { useAppDispatch } from '@/store/hooks.js'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Home.scss'

const HERO_IMAGE = 'photo-1490481651871-ab68de25d43d'

// PRODUCTS never changes at runtime, so these lists are built once.
const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4)
const onSale = PRODUCTS.filter((p) => p.onSale).slice(0, 4)
const bestSellers = [...PRODUCTS]
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 8)

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function Home() {
  const dispatch = useAppDispatch()
  usePageTitle(null) // Home — use base title

  // Called when a link to the shop is clicked: drop old search text and
  // filters so the visitor sees the whole category. The category itself comes
  // from the URL (the Shop page reads it).
  const openShop = () => dispatch(resetFilters())

  return (
    <div className="home">
      {/* ---------------- Hero ---------------- */}
      {/* The hero text uses a CSS animation (see Home.scss) instead of
          framer-motion, so it can appear before the animation library loads. */}
      <section className="hero">
        <img
          className="hero__bg"
          src={img(HERO_IMAGE, 1600)}
          srcSet={imgSrcSet(HERO_IMAGE, [640, 1000, 1600])}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <p className="hero__eyebrow">Autumn / Winter Collection</p>
          <h1 className="hero__title">
            Dress with
            <br />
            intention.
          </h1>
          <p className="hero__sub">
            Considered essentials and statement pieces, crafted to move with you
            season after season.
          </p>
          <div className="hero__cta">
            <Link
              to="/shop/women"
              className="btn"
              onClick={openShop}
            >
              Shop Women
            </Link>
            <Link
              to="/shop/men"
              className="btn"
              onClick={openShop}
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="section container">
        <header className="section-head">
          <div>
            <p className="overline">Browse</p>
            <h2 className="section-head__title">Shop by category</h2>
          </div>
          <Link
            to="/shop"
            className="section-head__link"
            onClick={openShop}
          >
            View all{' '}
            <Icon
              name="arrowRight"
              size={18}
            />
          </Link>
        </header>

        <div className="category-grid">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={i === 0 ? 'category-card--wide' : undefined}
            >
              <Link
                to={`/shop/${c.id}`}
                className="category-card"
                onClick={openShop}
              >
                <img
                  src={img(c.image, 800)}
                  srcSet={imgSrcSet(c.image, [400, 600, 800])}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  alt={c.title}
                  loading="lazy"
                />
                <span className="category-card__overlay" />
                <span className="category-card__body">
                  <span className="category-card__tag">{c.tagline}</span>
                  <span className="category-card__title">{c.title}</span>
                  <span className="category-card__cta">
                    Shop now{' '}
                    <Icon
                      name="arrowRight"
                      size={16}
                    />
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- New arrivals ---------------- */}
      <section className="section container">
        <header className="section-head">
          <div>
            <p className="overline">Just dropped</p>
            <h2 className="section-head__title">New arrivals</h2>
          </div>
          <Link
            to="/shop"
            className="section-head__link"
            onClick={() => {
              dispatch(resetFilters())
              dispatch(setNewOnly(true))
            }}
          >
            See all new{' '}
            <Icon
              name="arrowRight"
              size={18}
            />
          </Link>
        </header>
        <div className="product-grid">
          {newArrivals.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ---------------- Editorial banner ---------------- */}
      <section className="editorial">
        <img
          src={img('photo-1483985988355-763728e1935b', 1400)}
          srcSet={imgSrcSet(
            'photo-1483985988355-763728e1935b',
            [600, 900, 1400]
          )}
          sizes="(min-width: 1024px) 56vw, 100vw"
          alt=""
          className="editorial__img"
          loading="lazy"
        />
        <div className="editorial__panel">
          <p className="overline">The edit</p>
          <h2>Timeless layers for the season ahead</h2>
          <p>
            From tailored coats to featherweight knits, discover the pieces our
            stylists are reaching for right now.
          </p>
          <Link
            to="/shop"
            className="btn"
            onClick={openShop}
          >
            Explore the collection
          </Link>
        </div>
      </section>

      {/* ---------------- Best sellers ---------------- */}
      <section className="section container">
        <header className="section-head">
          <div>
            <p className="overline">Loved by everyone</p>
            <h2 className="section-head__title">Best sellers</h2>
          </div>
        </header>
        <div className="product-grid">
          {bestSellers.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ---------------- Sale strip ---------------- */}
      {onSale.length > 0 && (
        <section className="section container">
          <header className="section-head">
            <div>
              <p className="overline overline--sale">Limited time</p>
              <h2 className="section-head__title">On sale now</h2>
            </div>
          </header>
          <div className="product-grid">
            {onSale.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
