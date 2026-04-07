import { getProductById, trackProductClick } from '../firebase/firestore.js';
import { requireLogin } from '../firebase/auth.js';

let currentImageIndex = 0;
let currentProductImages = [];

export async function openProductPage(productId) {
  const container = document.getElementById('app');
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>পণ্যের তথ্য আনছে...</p></div>';
  
  const product = await getProductById(productId);
  
  if (!product) {
    container.innerHTML = `
      <div class="error-container">
        <i class="fas fa-search"></i>
        <h3>পণ্যটি পাওয়া যায়নি</h3>
        <p>আমরা এই পণ্যটি খুঁজে পাইনি।</p>
        <button onclick="window.app?.goHome()">হোম পেজে যান</button>
      </div>
    `;
    return;
  }
  
  // Setup images array
  const images = product.images?.filter(img => img && img !== '%%' && img !== '#') || 
                 (product.mainImage && product.mainImage !== '%%' ? [product.mainImage] : []) ||
                 (product.image && product.image !== '%%' ? [product.image] : []) ||
                 ['https://via.placeholder.com/500x500?text=No+Image'];
  
  currentProductImages = images;
  currentImageIndex = 0;
  
  // Generate features HTML from product.details
  const featuresHTML = generateFeaturesHTML(product);
  
  // Generate specifications table HTML
  const specsHTML = generateSpecsHTML(product);
  
  container.innerHTML = `
    <div class="product-page">
      <div class="product-gallery">
        <div class="main-image-container">
          <button class="gallery-nav prev" onclick="window.imageGallery?.prev()">
            <i class="fas fa-chevron-left"></i>
          </button>
          <img class="main-product-image" id="mainProductImage" src="${images[0]}" onerror="this.src='https://via.placeholder.com/500x500?text=Image+Not+Found'">
          <button class="gallery-nav next" onclick="window.imageGallery?.next()">
            <i class="fas fa-chevron-right"></i>
          </button>
          ${images.length > 1 ? '<div class="image-counter"><span id="currentImageIdx">1</span>/<span id="totalImages">' + images.length + '</span></div>' : ''}
        </div>
        ${images.length > 1 ? `
          <div class="thumbnail-list" id="thumbnailList">
            ${images.map((img, idx) => `
              <div class="thumbnail ${idx === 0 ? 'active' : ''}" data-index="${idx}" onclick="window.imageGallery?.setImage(${idx})">
                <img src="${img}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'" alt="থাম্বনেইল ${idx + 1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div class="product-info">
        <div class="product-badge">
          <span class="platform-badge"><i class="fas fa-store"></i> ${escapeHtml(product.platform || 'Daraz')}</span>
          ${product.hot ? '<span class="hot-badge"><i class="fas fa-fire"></i> হট ডিল</span>' : ''}
        </div>
        
        <h1>${escapeHtml(product.name)}</h1>
        
        <div class="product-rating-large">
          <div class="stars">
            ${generateStars(product.rating || 4.5)}
          </div>
          <span class="rating-text">${product.rating || 4.5}/5</span>
          <span class="review-count">(${Math.floor(Math.random() * 500) + 100} রিভিউ)</span>
        </div>
        
        <div class="product-price-large">
          <span class="price-amount">${product.price} ${product.currency || 'BDT'}</span>
          ${product.oldPrice ? `<span class="price-old">${product.oldPrice} BDT</span>` : ''}
        </div>
        
        <div class="product-meta-grid">
          <div class="meta-item">
            <i class="fas fa-tag"></i>
            <span>${escapeHtml(product.category)}</span>
          </div>
          ${product.details?.brand ? `
          <div class="meta-item">
            <i class="fas fa-building"></i>
            <span>${escapeHtml(product.details.brand)}</span>
          </div>
          ` : ''}
          ${product.details?.model ? `
          <div class="meta-item">
            <i class="fas fa-microchip"></i>
            <span>${escapeHtml(product.details.model)}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="product-description">
          <h3><i class="fas fa-info-circle"></i> পণ্যের বিবরণ</h3>
          <p>${escapeHtml(product.description)}</p>
        </div>
        
        ${specsHTML}
        
        ${featuresHTML}
        
        <div class="product-actions">
          <button class="buy-now-btn-large" onclick="window.handleBuyNow(${product.id})">
            <i class="fas fa-shopping-cart"></i>
            এখনই কিনুন
          </button>
          <button class="share-btn-large" onclick="window.shareProduct()">
            <i class="fas fa-share-alt"></i>
            শেয়ার করুন
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Setup gallery navigation
  window.imageGallery = {
    prev: () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateGalleryImage(images.length);
      }
    },
    next: () => {
      if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateGalleryImage(images.length);
      }
    },
    setImage: (index) => {
      currentImageIndex = index;
      updateGalleryImage(images.length);
    }
  };
  
  function updateGalleryImage(totalImages) {
    const mainImage = document.getElementById('mainProductImage');
    const currentIdxSpan = document.getElementById('currentImageIdx');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
      mainImage.src = images[currentImageIndex];
    }
    
    if (currentIdxSpan) {
      currentIdxSpan.textContent = currentImageIndex + 1;
    }
    
    thumbnails.forEach((thumb, idx) => {
      if (idx === currentImageIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
  
  // Setup global functions
  window.handleBuyNow = async (id) => {
    const loggedIn = await requireLogin();
    if (loggedIn) {
      await trackProductClick(id);
      window.open(product.affiliateLink, '_blank');
      window.showToast('স্টোরে রিডাইরেক্ট হচ্ছে...', 'success');
    }
  };
  
  window.shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      window.showToast('লিংক কপি করা হয়েছে!', 'success');
    }
  };
}

function generateSpecsHTML(product) {
  if (!product.details) return '';
  
  const details = product.details;
  let specsHTML = '<div class="product-specs"><h3><i class="fas fa-microchip"></i> স্পেসিফিকেশন</h3><table class="specs-table">';
  
  // Brand
  if (details.brand) {
    specsHTML += `<tr><td><strong>ব্র্যান্ড</strong></td><td>${escapeHtml(details.brand)}</td></tr>`;
  }
  
  // Model
  if (details.model) {
    specsHTML += `<tr><td><strong>মডেল</strong></td><td>${escapeHtml(details.model)}</td></tr>`;
  }
  
  // Display
  if (details.display) {
    if (details.display.type) {
      specsHTML += `<tr><td><strong>ডিসপ্লে</strong></td><td>${escapeHtml(details.display.type)}</td></tr>`;
    }
    if (details.display.resolution) {
      specsHTML += `<tr><td><strong>রেজোলিউশন</strong></td><td>${escapeHtml(details.display.resolution)}</td></tr>`;
    }
  }
  
  // Battery
  if (details.battery) {
    if (details.battery.capacity) {
      specsHTML += `<tr><td><strong>ব্যাটারি</strong></td><td>${escapeHtml(details.battery.capacity)}</td></tr>`;
    }
    if (details.battery.chargingTime) {
      specsHTML += `<tr><td><strong>চার্জিং টাইম</strong></td><td>${escapeHtml(details.battery.chargingTime)}</td></tr>`;
    }
    if (details.battery.batteryLife) {
      specsHTML += `<tr><td><strong>ব্যাটারি লাইফ</strong></td><td>${escapeHtml(details.battery.batteryLife)}</td></tr>`;
    }
    if (details.battery.workingTime) {
      specsHTML += `<tr><td><strong>ওয়ার্কিং টাইম</strong></td><td>${escapeHtml(details.battery.workingTime)}</td></tr>`;
    }
  }
  
  // Bluetooth
  if (details.bluetooth) {
    specsHTML += `<tr><td><strong>ব্লুটুথ</strong></td><td>${escapeHtml(details.bluetooth)}</td></tr>`;
  }
  
  // Water Resistance
  if (details.waterResistance) {
    specsHTML += `<tr><td><strong>ওয়াটার রেজিস্ট্যান্স</strong></td><td>${escapeHtml(details.waterResistance)}</td></tr>`;
  }
  
  // Compatibility
  if (details.compatibility) {
    specsHTML += `<tr><td><strong>কম্প্যাটিবিলিটি</strong></td><td>${escapeHtml(details.compatibility)}</td></tr>`;
  }
  
  // Material
  if (details.material) {
    specsHTML += `<tr><td><strong>ম্যাটেরিয়াল</strong></td><td>${escapeHtml(details.material)}</td></tr>`;
  }
  
  // Dimensions
  if (details.dimensions) {
    specsHTML += `<tr><td><strong>ডাইমেনশন</strong></td><td>${escapeHtml(details.dimensions)}</td></tr>`;
  }
  
  // Interface
  if (details.interface) {
    specsHTML += `<tr><td><strong>ইন্টারফেস</strong></td><td>${escapeHtml(details.interface)}</td></tr>`;
  }
  
  // Input Interface
  if (details.inputInterface) {
    specsHTML += `<tr><td><strong>ইনপুট</strong></td><td>${escapeHtml(details.inputInterface)}</td></tr>`;
  }
  
  specsHTML += '</table></div>';
  
  // Charging specs for power bank
  if (details.charging) {
    let chargingHTML = '<div class="product-specs"><h3><i class="fas fa-bolt"></i> চার্জিং স্পেসিফিকেশন</h3><table class="specs-table">';
    if (details.charging.wireless) {
      chargingHTML += `<tr><td><strong>ওয়্যারলেস চার্জিং</strong></td><td>${escapeHtml(details.charging.wireless)}</td></tr>`;
    }
    if (details.charging.usbC) {
      chargingHTML += `<tr><td><strong>USB-C</strong></td><td>${escapeHtml(details.charging.usbC)}</td></tr>`;
    }
    if (details.charging.usbA) {
      chargingHTML += `<tr><td><strong>USB-A</strong></td><td>${escapeHtml(details.charging.usbA)}</td></tr>`;
    }
    chargingHTML += '</table></div>';
    specsHTML += chargingHTML;
  }
  
  // Speed specs for fan
  if (details.speed) {
    let speedHTML = '<div class="product-specs"><h3><i class="fas fa-fan"></i> স্পিড স্পেসিফিকেশন</h3><table class="specs-table">';
    if (details.speed.levels) {
      speedHTML += `<tr><td><strong>স্পিড লেভেল</strong></td><td>${escapeHtml(details.speed.levels)}</td></tr>`;
    }
    if (details.speed.rpm) {
      if (details.speed.rpm.low) {
        speedHTML += `<tr><td><strong>লো স্পিড (RPM)</strong></td><td>${escapeHtml(details.speed.rpm.low)}</td></tr>`;
      }
      if (details.speed.rpm.medium) {
        speedHTML += `<tr><td><strong>মিডিয়াম স্পিড (RPM)</strong></td><td>${escapeHtml(details.speed.rpm.medium)}</td></tr>`;
      }
      if (details.speed.rpm.high) {
        speedHTML += `<tr><td><strong>হাই স্পিড (RPM)</strong></td><td>${escapeHtml(details.speed.rpm.high)}</td></tr>`;
      }
    }
    speedHTML += '</table></div>';
    specsHTML += speedHTML;
  }
  
  return specsHTML;
}

function generateFeaturesHTML(product) {
  if (!product.details || !product.details.features) return '';
  
  let featuresHTML = `
    <div class="product-features">
      <h3><i class="fas fa-list-check"></i> মূল বৈশিষ্ট্যসমূহ</h3>
      <ul>
  `;
  
  product.details.features.forEach(feature => {
    featuresHTML += `<li><i class="fas fa-check-circle"></i> ${escapeHtml(feature)}</li>`;
  });
  
  featuresHTML += `
      </ul>
    </div>
  `;
  
  return featuresHTML;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}