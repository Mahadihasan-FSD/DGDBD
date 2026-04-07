import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv4EdnzDWLdmv3gWQr33EKKnUm_6i9jcM",
  authDomain: "dgdbd-b8b06.firebaseapp.com",
  projectId: "dgdbd-b8b06",
  storageBucket: "dgdbd-b8b06.firebasestorage.app",
  messagingSenderId: "942294779691",
  appId: "1:942294779691:web:27169a24148ac4f772e76e",
  measurementId: "G-GM2F1N4RCL"
};

let db = null;
let productsCache = null;

export async function initFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Firebase connected");
    await loadProducts();
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase init failed, using local data", error);
    await loadProducts();
    return false;
  }
}

export async function loadProducts() {
  if (productsCache) return productsCache;
  
  // Load from JSON file first
  try {
    const response = await fetch('./products.json');
    if (response.ok) {
      productsCache = await response.json();
      console.log("✅ Products loaded from JSON:", productsCache.length, "products");
      return productsCache;
    }
  } catch (error) {
    console.warn("⚠️ JSON load failed", error);
  }
  
  // Fallback to Firestore if JSON fails
  try {
    if (db) {
      const snapshot = await getDocs(collection(db, "products"));
      if (!snapshot.empty) {
        productsCache = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("✅ Products loaded from Firestore:", productsCache.length);
        return productsCache;
      }
    }
  } catch (error) {
    console.warn("⚠️ Firestore fetch failed", error);
  }
  
  // Ultimate fallback dummy data
  productsCache = [
    {
      id: "1",
      name: "Sample Product 1",
      price: 1000,
      currency: "BDT",
      category: "Sample",
      images: ["https://picsum.photos/id/1/500/500"],
      mainImage: "https://picsum.photos/id/1/500/500",
      description: "Sample product description",
      affiliateLink: "#",
      platform: "Daraz",
      rating: 4.5,
      hot: true
    },
    {
      id: "2",
      name: "Sample Product 2",
      price: 2000,
      currency: "BDT",
      category: "Sample",
      images: ["https://picsum.photos/id/2/500/500"],
      mainImage: "https://picsum.photos/id/2/500/500",
      description: "Another sample product",
      affiliateLink: "#",
      platform: "Daraz",
      rating: 4.2,
      hot: false
    }
  ];
  return productsCache;
}

export async function trackProductClick(productId) {
  if (!db) return;
  try {
    const productRef = doc(db, "products", productId.toString());
    await updateDoc(productRef, {
      clicks: increment(1)
    });
  } catch (error) {
    console.log("Click tracking skipped");
  }
}

export async function getProductById(id) {
  const products = await loadProducts();
  return products.find(p => p.id == id);
}