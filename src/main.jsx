import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Filter,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Store,
  Truck,
  UserRound,
  WalletCards,
  X
} from 'lucide-react';
import { categories as fallbackCategories, products as fallbackProducts } from './catalog';
import './styles.css';

const quickActions = [
  { label: 'Pulsa', value: 'Rp25.000', icon: WalletCards },
  { label: 'Tagihan', value: 'Bayar cepat', icon: Truck },
  { label: 'Official Store', value: 'Brand asli', icon: Store },
  { label: 'Promo Hari Ini', value: 'Diskon besar', icon: Bell }
];

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);

function Header({ query, setQuery, cartCount, mobileFiltersOpen, setMobileFiltersOpen }) {
  return (
    <header className="topbar">
      <div className="utility-bar">
        <span>Download HijauMart App</span>
        <span>Mitra HijauMart</span>
        <span>Mulai Berjualan</span>
        <span>Promo</span>
        <span>Bantuan</span>
      </div>
      <div className="mainbar">
        <a className="brand" href="#" aria-label="HijauMart home">
          <span className="brand-mark">H</span>
          <span>HijauMart</span>
        </a>
        <button className="category-button" type="button">
          <Menu size={18} />
          Kategori
        </button>
        <label className="searchbox">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari di HijauMart"
          />
        </label>
        <button
          className="icon-button mobile-filter-button"
          type="button"
          aria-label={mobileFiltersOpen ? 'Tutup filter' : 'Buka filter'}
          onClick={() => setMobileFiltersOpen((value) => !value)}
        >
          {mobileFiltersOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
        </button>
        <nav className="header-actions" aria-label="Aksi akun">
          <button className="icon-button cart-button" type="button" aria-label="Keranjang">
            <ShoppingCart size={20} />
            <span>{cartCount}</span>
          </button>
          <button className="icon-button" type="button" aria-label="Pesan">
            <MessageCircle size={20} />
          </button>
          <button className="icon-button" type="button" aria-label="Notifikasi">
            <Bell size={20} />
          </button>
          <span className="divider" />
          <button className="account-button" type="button">
            <UserRound size={17} />
            Robin
          </button>
        </nav>
      </div>
      <div className="location-row">
        <div className="trend-links">
          <span>iphone 15</span>
          <span>sepatu running</span>
          <span>kopi susu</span>
          <span>rak dapur</span>
          <span>serum wajah</span>
        </div>
        <button className="ship-to" type="button">
          <MapPin size={16} />
          Dikirim ke Jakarta Selatan
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section">
      <div className="promo-panel">
        <div>
          <h1>Belanja kebutuhan harian lebih hemat</h1>
          <p>Voucher ongkir, flash sale elektronik, dan pilihan toko terpercaya dalam satu halaman.</p>
          <div className="hero-actions">
            <button type="button">Belanja Sekarang</button>
            <button type="button">Lihat Promo</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="bag bag-main">
            <span>Diskon</span>
            <strong>45%</strong>
          </div>
          <div className="parcel parcel-one" />
          <div className="parcel parcel-two" />
          <div className="coin coin-one" />
          <div className="coin coin-two" />
        </div>
      </div>
      <div className="side-deals">
        <article>
          <span>Flash Sale</span>
          <strong>Mulai Rp9rb</strong>
          <small>Berakhir 02:15:09</small>
        </article>
        <article>
          <span>Official Store</span>
          <strong>Brand favorit</strong>
          <small>Garansi original</small>
        </article>
      </div>
    </section>
  );
}

function QuickPanel() {
  return (
    <section className="quick-panel" aria-label="Akses cepat">
      {quickActions.map(({ label, value, icon: Icon }) => (
        <button className="quick-action" type="button" key={label}>
          <span>
            <Icon size={19} />
          </span>
          <div>
            <strong>{label}</strong>
            <small>{value}</small>
          </div>
        </button>
      ))}
    </section>
  );
}

function CategoryStrip({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section className="category-strip" aria-label="Kategori pilihan">
      <div className="section-heading">
        <h2>Kategori Pilihan</h2>
        <a href="#">
          Lihat semua <ChevronRight size={16} />
        </a>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            className={selectedCategory === category ? 'selected' : ''}
            type="button"
            key={category}
            onClick={() => setSelectedCategory((current) => (current === category ? 'Semua' : category))}
          >
            <span aria-hidden="true">{category.slice(0, 2)}</span>
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

function Sidebar({ categories, selectedCategory, setSelectedCategory, onlyPromo, setOnlyPromo, sort, setSort, mobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-title">
        <Filter size={18} />
        Filter
      </div>
      <div className="filter-group">
        <span>Kategori</span>
        <button
          className={selectedCategory === 'Semua' ? 'selected' : ''}
          type="button"
          onClick={() => setSelectedCategory('Semua')}
        >
          Semua
        </button>
        {categories.slice(0, 6).map((category) => (
          <button
            className={selectedCategory === category ? 'selected' : ''}
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <label className="switch-row">
        <input type="checkbox" checked={onlyPromo} onChange={(event) => setOnlyPromo(event.target.checked)} />
        Produk promo saja
      </label>
      <div className="filter-group">
        <span>Urutkan</span>
        {[
          ['popular', 'Paling Sesuai'],
          ['price-low', 'Harga Terendah'],
          ['price-high', 'Harga Tertinggi']
        ].map(([value, label]) => (
          <button className={sort === value ? 'selected' : ''} type="button" key={value} onClick={() => setSort(value)}>
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function ProductCard({ product, onAdd, isFavorite, onFavorite }) {
  return (
    <article className="product-card">
      <button
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        type="button"
        aria-label={`Favoritkan ${product.name}`}
        onClick={() => onFavorite(product.name)}
      >
        <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      <div className="product-image" style={{ '--product-bg': product.color, '--product-accent': product.accent }}>
        <div className="product-object" />
      </div>
      <div className="product-info">
        <span className="product-tag">{product.tag}</span>
        <h3>{product.name}</h3>
        <strong>{formatRupiah(product.price)}</strong>
        <div className="discount-row">
          <span>{product.discount}</span>
          <del>{formatRupiah(Math.round(product.price * 1.18))}</del>
        </div>
        <div className="meta-row">
          <span>
            <Star size={14} fill="currentColor" /> {product.rating}
          </span>
          <span>Terjual {product.sold}</span>
        </div>
        <small className="city">{product.city}</small>
        <button className="add-button" type="button" onClick={() => onAdd(product)}>
          + Keranjang
        </button>
      </div>
    </article>
  );
}

function ProductFeed({ productsToShow, onAdd, favorites, toggleFavorite, selectedCategory, query, apiStatus }) {
  return (
    <section className="feed">
      <div className="feed-heading">
        <div>
          <h2>Rekomendasi Untukmu</h2>
          <p>
            {apiStatus === 'loading'
              ? 'Mengambil produk dari backend...'
              : query
              ? `Hasil pencarian untuk "${query}"`
              : selectedCategory === 'Semua'
                ? 'Produk populer dari toko pilihan'
                : `Pilihan terbaik kategori ${selectedCategory}`}
          </p>
        </div>
        <button type="button">
          Toko Terdekat <ChevronDown size={15} />
        </button>
      </div>
      <div className="product-grid">
        {productsToShow.map((product) => (
          <ProductCard
            product={product}
            key={product.name}
            onAdd={onAdd}
            isFavorite={favorites.includes(product.name)}
            onFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

function CartToast({ cartItems }) {
  if (!cartItems.length) return null;

  const latest = cartItems[cartItems.length - 1];

  return (
    <div className="cart-toast" role="status">
      <ShoppingCart size={18} />
      <div>
        <strong>{latest.name}</strong>
        <span>ditambahkan ke keranjang</span>
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sort, setSort] = useState('popular');
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState(fallbackProducts);
  const [apiStatus, setApiStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetch('/api/categories'), fetch('/api/products')])
      .then(async ([categoryResponse, productResponse]) => {
        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error('API response failed');
        }

        const categoryPayload = await categoryResponse.json();
        const productPayload = await productResponse.json();

        if (isMounted) {
          setCategories(categoryPayload.data);
          setProducts(productPayload.data);
          setApiStatus('ready');
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories(fallbackCategories);
          setProducts(fallbackProducts);
          setApiStatus('fallback');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const productsToShow = useMemo(() => {
    let items = products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
      const categoryMatch =
        selectedCategory === 'Semua' ||
        product.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Elektronik' && /galaxy|headphone/i.test(product.name)) ||
        (selectedCategory === 'Fashion' && /sepatu|kemeja/i.test(product.name)) ||
        (selectedCategory === 'Makanan' && /kopi/i.test(product.name)) ||
        (selectedCategory === 'Rumah Tangga' && /rak|panci/i.test(product.name)) ||
        (selectedCategory === 'Kesehatan' && /serum/i.test(product.name));

      return matchesQuery && categoryMatch && (!onlyPromo || Number.parseInt(product.discount, 10) >= 20);
    });

    if (sort === 'price-low') items = [...items].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') items = [...items].sort((a, b) => b.price - a.price);

    return items;
  }, [query, selectedCategory, onlyPromo, sort]);

  const addToCart = (product) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, name: product.name })
    })
      .then((response) => {
        if (!response.ok) throw new Error('Cart API failed');
        return response.json();
      })
      .then((payload) => {
        setCartItems(payload.data);
      })
      .catch(() => {
        setCartItems((items) => [...items, product]);
      });
  };

  const toggleFavorite = (name) => {
    setFavorites((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  };

  return (
    <>
      <Header
        query={query}
        setQuery={setQuery}
        cartCount={cartItems.length}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      <main>
        <Hero />
        <QuickPanel />
        <CategoryStrip categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <div className="content-shell">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onlyPromo={onlyPromo}
            setOnlyPromo={setOnlyPromo}
            sort={sort}
            setSort={setSort}
            mobileOpen={mobileFiltersOpen}
          />
          <ProductFeed
            productsToShow={productsToShow}
            onAdd={addToCart}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selectedCategory={selectedCategory}
            query={query}
            apiStatus={apiStatus}
          />
        </div>
      </main>
      <CartToast cartItems={cartItems} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
