import { loadProducts } from '../firebase/firestore.js';
import { openProductPage } from './product.js';

export async function renderTrending(container) {
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>লোড হচ্ছে...</p></div>';
  
  const products = await loadProducts();
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>কোন পণ্য পাওয়া যায়নি</p></div>';
    return;
  }
  
  const trending = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);
  
  container.innerHTML = `
    <section>
      <h2><i class="fas fa-chart-line"></i> ট্রেন্ডিং পণ্য</h2>
      <p class="mb-2">এই সপ্তাহের সবচেয়ে জনপ্রিয় এবং হাই রেটেড পণ্য</p>
      <div class="product-grid" id="trendingGrid"></div>
    </section>
  `;
  
  const grid = document.getElementById('trendingGrid');
  
  grid.innerHTML = trending.map((product, index) => {
    const imageUrl = product.mainImage || product.image || (product.images && product.images[0]) || 'https://picsum.photos/500/400?random=' + product.id;
    
    return `
      <div class="card" data-product-id="${product.id}">
        
        <img class="card-img" src="${imageUrl}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://picsum.photos/500/400?random=${product.id}'">
        <div class="card-body">
          <h3>${escapeHtml(product.name)}</h3>
          <p class="card-desc">${escapeHtml((product.description || '').substring(0, 80))}...</p>
          <div class="card-price">${product.price} ${product.currency || 'BDT'}</div>
          <div class="card-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating || 4.5}/5 (${Math.floor(Math.random() * 500) + 100} রিভিউ)</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      openProductPage(card.dataset.productId);
    });
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}