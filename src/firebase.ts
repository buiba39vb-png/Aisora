import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { Product } from './types';

// Cấu hình Firebase mới được cung cấp (aisora-75b84)
export const firebaseConfig = {
  apiKey: "AIzaSyDa4Pg16yF0zs5WbNLJiC3cSs1ABTnwnY0",
  authDomain: "aisora-75b84.firebaseapp.com",
  projectId: "aisora-75b84",
  storageBucket: "aisora-75b84.firebasestorage.app",
  messagingSenderId: "679615947364",
  appId: "1:679615947364:web:8d00ed58808fce1df8f571",
  measurementId: "G-0JQ6DT33PB"
};

// Khởi tạo Firebase App & Authentication (Chỉ sử dụng Firebase Authentication)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Auth helper
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Email Admin được chỉ định
export const ADMIN_EMAIL = 'buiba39vb@gmail.com';

// Danh sách vật phẩm mặc định với giá chuyển đổi chuẩn sang Credits (10k = 10 Credits)
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-gtd-1",
    name: "Gói 1,000 Kim Cương",
    game: "Gold Tower Defence",
    priceCredits: 50, // 50,000 VNĐ = 50 Credits
    originalVnd: 50000,
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
    desc: "Nhận ngay 1,000 Kim Cương nâng cấp tháp phòng thủ cực mạnh.",
    badge: "Phổ biến"
  },
  {
    id: "prod-gtd-2",
    name: "Gói 5,000 Kim Cương VIP",
    game: "Gold Tower Defence",
    priceCredits: 200, // 200,000 VNĐ = 200 Credits
    originalVnd: 200000,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    desc: "Gói Kim Cương tiết kiệm 20% cho cao thủ Gold Tower Defence.",
    badge: "Tiết kiệm 20%"
  },
  {
    id: "prod-gtd-3",
    name: "Vé Chiến Binh Siêu Cấp Pass",
    game: "Gold Tower Defence",
    priceCredits: 100, // 100,000 VNĐ = 100 Credits
    originalVnd: 100000,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    desc: "Mở khóa toàn bộ tháp thần thoại và ngoại trang độc quyền mùa giải.",
    badge: "Mới ra mắt"
  },
  {
    id: "prod-eldo-1",
    name: "Gói 100 Ruby Khởi Đầu",
    game: "Eldorado",
    priceCredits: 20, // 20,000 VNĐ = 20 Credits
    originalVnd: 20000,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    desc: "Ruby nguyên chất giúp mở khóa nhanh tướng trợ chiến trong Eldorado.",
    badge: "Giá rẻ"
  },
  {
    id: "prod-eldo-2",
    name: "Gói 600 Ruby + Tướng Huyền Thoại",
    game: "Eldorado",
    priceCredits: 100, // 100,000 VNĐ = 100 Credits
    originalVnd: 100000,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    desc: "Combo siêu ưu đãi độc quyền dành riêng cho game thủ Eldorado.",
    badge: "HOT Nhất"
  },
  {
    id: "prod-eldo-3",
    name: "Rương Báu Hoàng Kim Eldorado",
    game: "Eldorado",
    priceCredits: 300, // 300,000 VNĐ = 300 Credits
    originalVnd: 300000,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    desc: "Nhận 2,000 Ruby + trang bị hoàng gia 5 sao sức mạnh tối thượng.",
    badge: "VIP Siêu Cấp"
  }
];

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { User };
