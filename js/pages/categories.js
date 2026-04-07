import { loadProducts } from '../firebase/firestore.js';
import { openProductPage } from './product.js';

export async function renderCategories(container) {
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>লোড হচ্ছে...</p></div>';
  
  const products = await loadProducts();
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>কোন পণ্য পাওয়া যায়নি</p></div>';
    return;
  }
  
  const categories = [...new Set(products.map(p => p.category))];
  
  container.innerHTML = `
    <section>
      <h2><i class="fas fa-th-large"></i> সব ক্যাটাগরি</h2>
      <div class="category-bar" id="categoryBar"></div>
      <div class="product-grid" id="categoryGrid"></div>
    </section>
  `;
  
  const categoryBar = document.getElementById('categoryBar');
  const categoryGrid = document.getElementById('categoryGrid');
  
  // Add "All" button
  categoryBar.innerHTML = `<button class="cat-btn active" data-category="all">সব পণ্য</button>`;
  
  categories.forEach(cat => {
    categoryBar.innerHTML += `<button class="cat-btn" data-category="${cat}">${cat}</button>`;
  });
  
  // Display all products initially
  displayProducts(products, categoryGrid);
  
  // Add click handlers
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
      
      displayProducts(filtered, categoryGrid);
    });
  });
}

function displayProducts(products, grid) {
  if (!grid) return;
  
  if (products.length === 0) {
    grid.innerHTML = '<p class="text-center">এই ক্যাটাগরিতে কোনো পণ্য নেই।</p>';
    return;
  }
  
  grid.innerHTML = products.map(product => {
    const imageUrl = product.mainImage || product.image || (product.images && product.images[0]) || 'https://picsum.photos/500/400?random=' + product.id;
    
    return `
      <div class="card" data-product-id="${product.id}">
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
      </div>
    `;
  }).join('');
  
  // Attach click events
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