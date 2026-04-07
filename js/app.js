import { initFirebase } from './firebase/firestore.js';
import { renderHome } from './pages/home.js';
import { renderCategories } from './pages/categories.js';
import { renderTrending } from './pages/trending.js';
import { renderAbout } from './pages/about.js';
import { renderContact } from './pages/contact.js';
import { renderPrivacy } from './pages/privacy.js';
import { renderTerms } from './pages/terms.js';
import { renderProfile } from './pages/profile.js';
import { showLoginModal, closeLoginModal, checkAuthState, logoutUser } from './firebase/auth.js';

let currentUser = null;
let currentPage = 'home';
let isLoading = false;

window.app = {
  goCategories: () => navigateTo('categories'),
  goTrending: () => navigateTo('trending'),
  goHome: () => navigateTo('home')
};

window.closeLoginModal = closeLoginModal;

async function init() {
  await initFirebase();
  checkAuthState((user) => {
    currentUser = user;
    updateAuthButton();
    if (!window.initialLoadDone) {
      window.initialLoadDone = true;
      let hash = window.location.hash.slice(1) || 'home';
      const validPages = ['home', 'categories', 'trending', 'about', 'contact', 'privacy', 'terms', 'profile'];
      if (!validPages.includes(hash)) hash = 'home';
      navigateTo(hash);
    }
  });
  setupEventListeners();
}

function setupEventListeners() {
  const ids = ['logoBtn', 'navHome', 'navCategories', 'navTrending'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = (e) => {
      e.preventDefault();
      navigateTo(id.replace('nav', '').toLowerCase() || 'home');
    };
  });
  
  document.getElementById('authBtn').onclick = () => toggleAuth();
  
  const footerIds = ['footerHome', 'footerCategories', 'footerTrending', 'footerAbout', 'footerContact', 'footerPrivacy', 'footerTerms', 'bottomPrivacy'];
  footerIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = (e) => {
      e.preventDefault();
      navigateTo(id.replace('footer', '').replace('bottom', '').toLowerCase() || 'home');
    };
  });
}

function updateAuthButton() {
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  if (currentUser) {
    btn.innerHTML = `<i class="fas fa-user-check"></i> প্রোফাইল`;
    btn.onclick = () => navigateTo('profile');
  } else {
    btn.innerHTML = `<i class="fas fa-user"></i> লগইন`;
    btn.onclick = () => toggleAuth();
  }
}

async function navigateTo(page) {
  if (isLoading) return;
  isLoading = true;
  window.location.hash = page;
  currentPage = page;
  
  const container = document.getElementById('app');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  try {
    switch(page) {
      case 'home': await renderHome(container); break;
      case 'categories': await renderCategories(container); break;
      case 'trending': await renderTrending(container); break;
      case 'about': await renderAbout(container); break;
      case 'contact': await renderContact(container); break;
      case 'privacy': await renderPrivacy(container); break;
      case 'terms': await renderTerms(container); break;
      case 'profile': await renderProfile(container); break;
      default: await renderHome(container);
    }
    window.scrollTo({ top: 0 });
  } catch (error) {
    container.innerHTML = `<div class="error-container"><h3>Error</h3><button onclick="location.reload()">Reload</button></div>`;
  }
  isLoading = false;
}

async function toggleAuth() {
  if (currentUser) {
    if (confirm('লগআউট করতে চান?')) {
      await logoutUser();
      navigateTo('home');
    }
  } else {
    showLoginModal(() => navigateTo(currentPage));
  }
}

window.addEventListener('hashchange', () => {
  let hash = window.location.hash.slice(1) || 'home';
  const valid = ['home', 'categories', 'trending', 'about', 'contact', 'privacy', 'terms', 'profile'];
  navigateTo(valid.includes(hash) ? hash : 'home');
});

window.showToast = (msg, type = 'info') => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
};

init();