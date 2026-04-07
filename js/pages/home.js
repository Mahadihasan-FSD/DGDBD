import { loadProducts } from '../firebase/firestore.js';
import { openProductPage } from './product.js';

export async function renderHome(container) {
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading products...</p></div>';
  
  const products = await loadProducts();
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No products found</p></div>';
    return;
  }
  
  console.log("Rendering", products.length, "products on home page");
  
  const featured = products.filter(p => p.hot === true).slice(0, 6);
  const latest = products.slice(0, 4);
  
  container.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <h1>Bangladesh's Best Tech Gadgets & Deals</h1>
        <p>Discover the best offers from Daraz & Rokomari</p>
        <div class="hero-buttons">
          <button class="btn-primary" id="shopNowBtn">
            <i class="fas fa-shopping-bag"></i> Start Shopping
          </button>
          <button class="btn-secondary" id="trendingNowBtn">
            <i class="fas fa-fire"></i> View Trending
          </button>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <span class="stat-number">10+</span>
          <span class="stat-label">Products</span>
        </div>
        <div class="stat">
          <span class="stat-number">5+</span>
          <span class="stat-label">Brands</span>
        </div>
        <div class="stat">
          <span class="stat-number">10k+</span>
          <span class="stat-label">Happy Customers</span>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="section-header">
        <h2><i class="fas fa-fire"></i> Hot Deals</h2>
        <a href="#" class="view-all" id="viewAllHot">View All →</a>
      </div>
      <div class="product-grid" id="featuredGrid"></div>
    </section>

    <section class="products-section">
      <div class="section-header">
        <h2><i class="fas fa-clock"></i> New Arrivals</h2>
        <a href="#" class="view-all" id="viewAllNew">View All →</a>
      </div>
      <div class="product-grid" id="latestGrid"></div>
    </section>
  `;
  
  // Render products into grids
  const featuredGrid = document.getElementById('featuredGrid');
  const latestGrid = document.getElementById('latestGrid');
  
  if (featuredGrid) {
    featuredGrid.innerHTML = '';
    featured.forEach(product => {
      featuredGrid.appendChild(createProductCard(product));
    });
  }
  
  if (latestGrid) {
    latestGrid.innerHTML = '';
    latest.forEach(product => {
      latestGrid.appendChild(createProductCard(product));
    });
  }
  
  // Attach button events
  const shopBtn = document.getElementById('shopNowBtn');
  const trendingBtn = document.getElementById('trendingNowBtn');
  const viewAllHot = document.getElementById('viewAllHot');
  const viewAllNew = document.getElementById('viewAllNew');
  
  if (shopBtn) shopBtn.onclick = () => window.location.hash = 'categories';
  if (trendingBtn) trendingBtn.onclick = () => window.location.hash = 'trending';
  if (viewAllHot) viewAllHot.onclick = (e) => { e.preventDefault(); window.location.hash = 'categories'; };
  if (viewAllNew) viewAllNew.onclick = (e) => { e.preventDefault(); window.location.hash = 'categories'; };
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-product-id', product.id);
  
  const imageUrl = product.mainImage || product.image || (product.images && product.images[0]) || `https://picsum.photos/id/${product.id}/500/400`;
  
  card.innerHTML = `
    ${product.hot ? '<div class="card-badge hot">🔥 Hot Deal</div>' : ''}
    <img class="card-img" src="${imageUrl}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://picsum.photos/500/400?random=${product.id}'">
    <div class="card-body">
      <h3>${escapeHtml(product.name)}</h3>
      <p class="card-desc">${escapeHtml((product.description || '').substring(0, 80))}...</p>
      <div class="card-price">${product.price} ${product.currency || 'BDT'}</div>
      <div class="card-rating">
        <i class="fas fa-star"></i>
        <span>${product.rating || 4.5}/5</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', (e) => {
    if (e.target.closest('.buy-now-btn')) return;
    openProductPage(product.id);
  });
  
  return card;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}