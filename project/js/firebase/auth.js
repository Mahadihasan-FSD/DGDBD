import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCv4EdnzDWLdmv3gWQr33EKKnUm_6i9jcM",
  authDomain: "dgdbd-b8b06.firebaseapp.com",
  projectId: "dgdbd-b8b06",
  storageBucket: "dgdbd-b8b06.firebasestorage.app",
  messagingSenderId: "942294779691",
  appId: "1:942294779691:web:27169a24148ac4f772e76e"
};

let auth = null;
let db = null;
let currentUserCallback = null;

export function initAuth() {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  return auth;
}

export async function loginWithGoogle() {
  if (!auth) initAuth();
  
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await saveUserToFirestore(result.user);
    if (window.showToast) {
      window.showToast(`স্বাগতম ${result.user.displayName || 'ইউজার'}!`, 'success');
    }
    return result.user;
  } catch (error) {
    console.error(error);
    if (window.showToast) window.showToast('লগইন ব্যর্থ হয়েছে', 'error');
    return null;
  }
}

export async function loginWithEmail(email, password) {
  if (!auth) initAuth();
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    if (window.showToast) window.showToast('স্বাগতম ফিরে!', 'success');
    return result.user;
  } catch (error) {
    let message = 'লগইন ব্যর্থ হয়েছে';
    if (error.code === 'auth/invalid-credential') message = 'ভুল ইমেইল বা পাসওয়ার্ড';
    else if (error.code === 'auth/user-not-found') message = 'এই ইমেইলে কোনো অ্যাকাউন্ট নেই';
    if (window.showToast) window.showToast(message, 'error');
    return null;
  }
}

export async function registerWithEmail(email, password, name, gender) {
  if (!auth) initAuth();
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await saveUserToFirestore(result.user, { name, gender });
    if (window.showToast) window.showToast(`স্বাগতম ${name}!`, 'success');
    return result.user;
  } catch (error) {
    let message = 'রেজিস্ট্রেশন ব্যর্থ হয়েছে';
    if (error.code === 'auth/email-already-in-use') message = 'এই ইমেইল already ব্যবহার হচ্ছে';
    if (error.code === 'auth/weak-password') message = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
    if (window.showToast) window.showToast(message, 'error');
    return null;
  }
}

async function saveUserToFirestore(user, extraData = {}) {
  if (!db) return;
  
  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || extraData.name || 'User',
    gender: extraData.gender || 'Not Specified',
    photoURL: user.photoURL || null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  await setDoc(userRef, userData, { merge: true });
}

export async function getUserProfile(uid) {
  if (!db) return null;
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    return null;
  }
}

export async function deleteUserAccount() {
  if (!auth || !auth.currentUser) return false;
  
  try {
    const user = auth.currentUser;
    if (db) await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    if (window.showToast) window.showToast('অ্যাকাউন্ট ডিলিট হয়েছে', 'success');
    return true;
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      window.showToast('দয়া করে আবার লগইন করুন', 'error');
    } else {
      window.showToast('ডিলিট ব্যর্থ হয়েছে', 'error');
    }
    return false;
  }
}

export async function resetPassword(email) {
  if (!auth) initAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    window.showToast('পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে', 'success');
    return true;
  } catch (error) {
    window.showToast(error.message, 'error');
    return false;
  }
}

export function checkAuthState(callback) {
  if (!auth) initAuth();
  currentUserCallback = callback;
  onAuthStateChanged(auth, (user) => {
    if (callback) callback(user);
  });
}

export function getCurrentUser() {
  return auth?.currentUser || null;
}

export function showLoginModal(onLogin) {
  const modal = document.getElementById('loginModal');
  const modalContent = modal?.querySelector('.modal-content');
  if (!modalContent) return;
  
  modalContent.innerHTML = getLoginFormHTML();
  modal.classList.remove('hidden');
  
  // Tab switching
  const tabBtns = modalContent.querySelectorAll('.tab-btn');
  const loginForm = modalContent.querySelector('#loginForm');
  const registerForm = modalContent.querySelector('#registerForm');
  
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      }
    };
  });
  
  // Login handler
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = modalContent.querySelector('#loginEmail').value;
    const password = modalContent.querySelector('#loginPassword').value;
    const user = await loginWithEmail(email, password);
    if (user && onLogin) onLogin(user);
    if (user) closeLoginModal();
  };
  
  // Register handler
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = modalContent.querySelector('#regName').value;
    const email = modalContent.querySelector('#regEmail').value;
    const gender = modalContent.querySelector('#regGender').value;
    const password = modalContent.querySelector('#regPassword').value;
    const confirm = modalContent.querySelector('#regConfirmPassword').value;
    
    if (!gender) {
      window.showToast('জেন্ডার নির্বাচন করুন', 'error');
      return;
    }
    if (password !== confirm) {
      window.showToast('পাসওয়ার্ড মিলছে না', 'error');
      return;
    }
    if (password.length < 6) {
      window.showToast('পাসওয়ার্ড ৬+ অক্ষর হতে হবে', 'error');
      return;
    }
    
    const user = await registerWithEmail(email, password, name, gender);
    if (user && onLogin) onLogin(user);
    if (user) closeLoginModal();
  };
  
  // Forgot password
  modalContent.querySelector('#forgotPassword').onclick = async (e) => {
    e.preventDefault();
    const email = modalContent.querySelector('#loginEmail').value;
    if (!email) {
      window.showToast('ইমেইল লিখুন', 'error');
      return;
    }
    await resetPassword(email);
  };
  
  // Google login
  modalContent.querySelector('#googleLoginBtn').onclick = async () => {
    const user = await loginWithGoogle();
    if (user && onLogin) onLogin(user);
    if (user) closeLoginModal();
  };
}

function getLoginFormHTML() {
  return `
    <span class="close-modal" onclick="window.closeLoginModal()">&times;</span>
    <div class="login-tabs">
      <button class="tab-btn active" data-tab="login">লগইন</button>
      <button class="tab-btn" data-tab="register">রেজিস্টার</button>
    </div>
    <div class="login-box">
      <i class="fas fa-user-circle"></i>
      <form id="loginForm" class="auth-form">
        <div class="form-group"><input type="email" id="loginEmail" placeholder="ইমেইল" required></div>
        <div class="form-group"><input type="password" id="loginPassword" placeholder="পাসওয়ার্ড" required></div>
        <div class="form-options">
          <label class="checkbox-label"><input type="checkbox"> মনে রাখুন</label>
          <a href="#" id="forgotPassword" class="forgot-link">পাসওয়ার্ড ভুলে গেছেন?</a>
        </div>
        <button type="submit" class="auth-submit-btn">লগইন করুন</button>
      </form>
      <form id="registerForm" class="auth-form hidden">
        <div class="form-group"><input type="text" id="regName" placeholder="আপনার নাম" required></div>
        <div class="form-group"><input type="email" id="regEmail" placeholder="ইমেইল" required></div>
        <div class="form-group">
          <select id="regGender" class="gender-select" required>
            <option value="">জেন্ডার নির্বাচন করুন</option>
            <option value="Male">পুরুষ (Male)</option>
            <option value="Female">মহিলা (Female)</option>
            <option value="Other">অন্যান্য (Other)</option>
          </select>
        </div>
        <div class="form-group"><input type="password" id="regPassword" placeholder="পাসওয়ার্ড (৬+ অক্ষর)" required></div>
        <div class="form-group"><input type="password" id="regConfirmPassword" placeholder="পাসওয়ার্ড নিশ্চিত করুন" required></div>
        <button type="submit" class="auth-submit-btn">রেজিস্টার করুন</button>
      </form>
      <div class="divider"><span>অথবা</span></div>
      <button id="googleLoginBtn" class="google-btn"><i class="fab fa-google"></i> গুগল দিয়ে লগইন করুন</button>
    </div>
  `;
}

export function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('hidden');
}

export async function logoutUser() {
  if (auth) await signOut(auth);
  if (window.showToast) window.showToast('লগআউট হয়েছে', 'success');
}

export function requireLogin() {
  return new Promise((resolve) => {
    if (auth?.currentUser) return resolve(true);
    showLoginModal(() => resolve(!!auth?.currentUser));
  });
}