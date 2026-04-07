import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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
  appId: "1:942294779691:web:27169a24148ac4f772e76e"
};

let db = null;
let productsCache = null;
let firestoreInitialized = false;

function getFirebaseApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export async function initFirebase() {
  if (firestoreInitialized) {
    return true;
  }
  
  try {
    const app = getFirebaseApp();
    db = getFirestore(app);
    firestoreInitialized = true;
    console.log("✅ Firestore connected");
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
  
  // Ultimate fallback - use the products from your JSON file as inline data
  productsCache = [
    {
      "id": "1",
      "name": "Colmi P28 Plus Calling Fitness Smartwatch",
      "price": 2750,
      "currency": "BDT",
      "category": "Smart Watches",
      "image": "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchBlack.jpg?v=1675499168&width=493",
      "images": [
        "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchBlack.jpg?v=1675499168&width=493",
        "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchgray.jpg?v=1675499168&width=493",
        "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchgold.jpg?v=1675499168&width=493",
        "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchPink.jpg?v=1675499168&width=493"
      ],
      "mainImage": "https://www.colmi.info/cdn/shop/products/COLMIP28PlusSmartwatchBlack.jpg?v=1675499168&width=493",
      "description": "বড় 1.69 inch TFT Full Touch Display সহ স্মার্টওয়াচ। Bluetooth Calling, Fitness Tracking, Heart Rate ও 100+ Watch Faces সাপোর্ট করে।",
      "affiliateLink": "https://s.daraz.com.bd/s.bZGln?cc",
      "platform": "Daraz",
      "rating": 4.4,
      "hot": true,
      "details": {
        "brand": "COLMI",
        "model": "P28 Plus Smartwatch",
        "bluetooth": "v5.1",
        "display": {
          "type": "1.69 inch TFT Full Touchscreen",
          "resolution": "240 x 280 Pixels"
        },
        "battery": {
          "capacity": "235 mAh",
          "chargingTime": "About 2 Hours",
          "batteryLife": "Approx. 2–3 Days"
        },
        "features": ["Bluetooth Calling", "Heart Rate Monitoring", "Sleep Tracking", "Sports Modes"]
      }
    },
    {
      "id": "2",
      "name": "Xiaomi SOLOVE F5 Portable Desktop Fan 4000mAh",
      "price": 1895,
      "currency": "BDT",
      "category": "Mini Fans",
      "image": "https://www.lilium.com.bd/wp-content/uploads/2025/07/XIAOMI-SOLOVE-Desktop-Fan-600x600.jpg",
      "mainImage": "https://www.lilium.com.bd/wp-content/uploads/2025/07/XIAOMI-SOLOVE-Desktop-Fan-600x600.jpg",
      "description": "4000mAh ব্যাটারি সহ পোর্টেবল ডেস্কটপ ফ্যান। USB Type-C charging এবং long backup time সহ।",
      "affiliateLink": "https://s.daraz.com.bd/s.bZACy?cc",
      "platform": "Daraz",
      "rating": 4.5,
      "hot": true,
      "details": {
        "brand": "Xiaomi",
        "model": "SOLOVE F5",
        "battery": {
          "capacity": "4000mAh",
          "workingTime": "3–12 Hours"
        },
        "features": ["Portable Design", "USB Type-C Charging", "Long Battery Backup"]
      }
    },
    {
      "id": "3",
      "name": "JISULIFE FA43 Handheld Turbo Fan 4000mAh",
      "price": 1575,
      "currency": "BDT",
      "category": "Mini Fans",
      "image": "https://jisulife.com.bd/wp-content/uploads/2022/11/Screenshot_4-1.png",
      "mainImage": "https://jisulife.com.bd/wp-content/uploads/2022/11/Screenshot_4-1.png",
      "description": "Turbo airflow technology সহ শক্তিশালী হ্যান্ডহেল্ড ফ্যান।",
      "affiliateLink": "https://www.rokomari.com/electronics/304418/jisulife-fa43-handheld-turbo-fan-4000mah",
      "platform": "Rokomari",
      "rating": 4.6,
      "hot": true,
      "details": {
        "brand": "JISULIFE",
        "model": "FA43",
        "features": ["Turbo Airflow", "3 Speed", "USB Type-C"]
      }
    },
    {
      "id": "4",
      "name": "Joyroom PBM08 Pro Ultra-Slim 10000mAh Magnetic Wireless Power Bank",
      "price": 2950,
      "currency": "BDT",
      "category": "Power Banks",
      "image": "https://www.joyroom.com/cdn/shop/files/JOYROOMJR-PBM0820WPowerBank5000mAhB2B.jpg?v=1750675829&width=1000",
      "mainImage": "https://www.joyroom.com/cdn/shop/files/JOYROOMJR-PBM0820WPowerBank5000mAhB2B.jpg?v=1750675829&width=1000",
      "description": "Ultra-slim 10000mAh Magnetic Wireless Power Bank",
      "affiliateLink": "https://s.daraz.com.bd/s.b05dY?cc",
      "platform": "Daraz",
      "rating": 4.7,
      "hot": true,
      "details": {
        "brand": "Joyroom",
        "model": "JR-PBM08 Pro",
        "battery": {
          "capacity": "10000mAh"
        },
        "features": ["Magnetic Wireless", "20W Fast Charging", "Ultra-Slim"]
      }
    }
  ];
  console.log("✅ Using fallback product data");
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