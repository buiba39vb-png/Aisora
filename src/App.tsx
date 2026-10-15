/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  auth, 
  DEFAULT_PRODUCTS,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithGoogle
} from './firebase';
import { Product, CardDeposit, Order, UserProfile, vndToCredits } from './types';
import { useSecurityBlocker } from './hooks/useSecurityBlocker';
import { DevToolsBlockedModal } from './components/DevToolsBlockedModal';
import { Navbar } from './components/Navbar';
import { GameIdBanner } from './components/GameIdBanner';
import { ProductCard } from './components/ProductCard';
import { DepositModal } from './components/DepositModal';
import { BuyModal } from './components/BuyModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthScreen } from './components/AuthScreen';
import { AdminApp } from './AdminApp';
import { 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [isExplicitAdminPortal, setIsExplicitAdminPortal] = useState(() => {
    return (
      window.location.search.includes('page=admin') ||
      window.location.search.includes('portal=admin') ||
      window.location.pathname.endsWith('/admin.html') ||
      window.location.pathname.endsWith('/admin')
    );
  });

  // 1. CHẶN DEVELOPER TOOLS & PHÍM TẮT BẢO MẬT (Ctrl+U, F12, Ctrl+Shift+I/J/C...)
  const { 
    isDevToolsBlocked, 
    blockedReason, 
    securityToast, 
    clearSecurityToast, 
    verifyDevToolsClosed 
  } = useSecurityBlocker(!isExplicitAdminPortal);

  // Auth state (Firebase Authentication only)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // In-memory client states (Do NOT save user profile data to Firestore/Storage)
  const [userCredits, setUserCredits] = useState<number>(100); // 100 Credits khởi tạo cho trải nghiệm
  const [gtdId, setGtdId] = useState<string>('');
  const [eldoradoId, setEldoradoId] = useState<string>('');

  // Shop states
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentGameFilter, setCurrentGameFilter] = useState('all');

  // Client-side transaction histories
  const [myCards, setMyCards] = useState<CardDeposit[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProductForBuy, setSelectedProductForBuy] = useState<Product | null>(null);

  // App Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 2. THEO DÕI TRẠNG THÁI FIREBASE AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Xử lý nạp thẻ cào (Client-only, Không gọi Firestore/Storage)
  const handleDepositCard = async (cardData: {
    telco: string;
    amountVnd: number;
    credits: number;
    serial: string;
    pin: string;
  }) => {
    if (!currentUser) throw new Error('Vui lòng đăng nhập!');

    const newCard: CardDeposit = {
      id: 'card-' + Date.now(),
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      telco: cardData.telco,
      amountVnd: cardData.amountVnd,
      credits: cardData.credits,
      serial: cardData.serial,
      pin: cardData.pin,
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
    };

    setMyCards((prev) => [newCard, ...prev]);
    showToast(`Đã gửi thẻ cào! Sau khi duyệt bạn sẽ nhận ${cardData.credits} Credits.`);
  };

  // Xử lý mua vật phẩm bằng Credits (Client-only, Không gọi Firestore/Storage)
  const handleConfirmBuy = async (product: Product, newGtd: string, newEldo: string) => {
    if (!currentUser) throw new Error('Vui lòng đăng nhập!');

    if (userCredits < product.priceCredits) {
      throw new Error(`Số dư không đủ! Bạn có ${userCredits} Credits, cần ${product.priceCredits} Credits.`);
    }

    const idParts = [];
    if (newGtd) idParts.push(`GTD: ${newGtd}`);
    if (newEldo) idParts.push(`Eldorado: ${newEldo}`);
    const combinedGameId = idParts.join(' | ');

    // Trừ số dư Credits trong state
    setUserCredits((prev) => prev - product.priceCredits);

    if (newGtd) setGtdId(newGtd);
    if (newEldo) setEldoradoId(newEldo);

    const newOrder: Order = {
      id: 'order-' + Date.now(),
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      productId: product.id,
      productName: product.name,
      game: product.game,
      priceCredits: product.priceCredits,
      gameId: combinedGameId,
      gtdId: newGtd,
      eldoradoId: newEldo,
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
    };

    setMyOrders((prev) => [newOrder, ...prev]);

    // Bắn pháo hoa ăn mừng giao dịch thành công
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`Mua thành công "${product.name}"! Trừ ${product.priceCredits} Credits.`);
  };

  // Lưu Game ID trong local state (Do NOT save user profile data to database)
  const handleSaveGameIds = async (newGtd: string, newEldo: string) => {
    setGtdId(newGtd);
    setEldoradoId(newEldo);
    showToast('Đã lưu thay đổi Game ID thành công!');
  };

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchGame = currentGameFilter === 'all' || p.game === currentGameFilter;
      const matchQuery = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchGame && matchQuery;
    });
  }, [products, currentGameFilter, searchQuery]);

  if (isExplicitAdminPortal) {
    return <AdminApp />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-amber-500/20 mb-4 animate-pulse">
          LD
        </div>
        <p className="text-xs font-bold text-slate-400">Đang khởi động Shop Lê Dương...</p>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị màn hình Auth
  if (!currentUser) {
    return (
      <>
        {isDevToolsBlocked && (
          <DevToolsBlockedModal
            reason={blockedReason}
            onRetry={verifyDevToolsClosed}
          />
        )}
        <AuthScreen
          onLogin={async (email, pass) => {
            await signInWithEmailAndPassword(auth, email, pass);
          }}
          onRegister={async (email, pass) => {
            await createUserWithEmailAndPassword(auth, email, pass);
          }}
          onGoogleLogin={async () => {
            await signInWithGoogle();
          }}
        />
      </>
    );
  }

  // Dashboard - Hiển thị ngay sau khi đăng nhập thành công
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* 1. MÀN HÌNH KHÓA KHI PHÁT HIỆN DEVELOPER TOOLS */}
      {isDevToolsBlocked && (
        <DevToolsBlockedModal
          reason={blockedReason}
          onRetry={verifyDevToolsClosed}
        />
      )}

      {/* 2. SECURITY NOTICE TOAST (Chặn Ctrl+U, F12, Chuột phải,...) */}
      {securityToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* 3. APP TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. NAVBAR (Có nút đăng xuất đưa người dùng về Auth screen) */}
      <Navbar
        userEmail={currentUser.email || ''}
        userCredits={userCredits}
        currentGtdId={gtdId}
        currentEldoId={eldoradoId}
        currentGameFilter={currentGameFilter}
        onFilterChange={setCurrentGameFilter}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={() => signOut(auth)}
      />

      {/* 5. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Banner Khuyến Mãi & Tỷ Lệ Credits */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-indigo-900/20 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-black uppercase tracking-wider border border-amber-500/40">
              <Coins className="w-3.5 h-3.5" />
              <span>Tỷ Lệ Quy Đổi Chuẩn: 10,000 VNĐ = 10 CREDITS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              SHOP NẠP GAME &bull; ĐỔI CREDITS AN TOÀN
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hỗ trợ nạp đầy đủ gói vật phẩm Gold Tower Defence và Eldorado. Tự động quy đổi mệnh giá thẻ cào sang Credits, bảo mật Firebase Authentication 100%!
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => setIsDepositOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Nạp Thẻ Nhận Credits Ngay</span>
              </button>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Quản Lý Hồ Sơ & Lịch Sử</span>
              </button>
            </div>
          </div>
        </div>

        {/* Khung Trạng Thái & Thay Đổi Game ID Nhanh Bất Cứ Khi Nào */}
        <GameIdBanner
          currentGtdId={gtdId}
          currentEldoId={eldoradoId}
          onOpenEdit={() => setIsProfileOpen(true)}
        />

        {/* Search & Game Tabs (Mobile) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Mobile Filter */}
          <div className="flex md:hidden bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setCurrentGameFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                currentGameFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setCurrentGameFilter('Gold Tower Defence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                currentGameFilter === 'Gold Tower Defence'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400'
              }`}
            >
              Gold Tower
            </button>
            <button
              onClick={() => setCurrentGameFilter('Eldorado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                currentGameFilter === 'Eldorado'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400'
              }`}
            >
              Eldorado
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm gói nạp, tên kim cương, ruby..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
            Không tìm thấy vật phẩm nào khớp với tìm kiếm.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                userCredits={userCredits}
                onBuy={(p) => setSelectedProductForBuy(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-300">
            HỆ THỐNG NẠP GAME & QUY ĐỔI CREDITS SHOP LÊ DƯƠNG
          </p>
          <p className="text-[11px] text-slate-500">
            Tỷ lệ quy đổi: 10,000 VNĐ = 10 Credits &bull; Bảo mật khóa DevTools chống can thiệp &bull; Tích hợp Firebase Authentication
          </p>
          <div className="pt-1 flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsExplicitAdminPortal(true)}
              className="text-slate-600 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Cổng Quản Trị Riêng Biệt (Admin Portal)</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* 7. MODALS */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSubmit={handleDepositCard}
      />

      <BuyModal
        isOpen={!!selectedProductForBuy}
        product={selectedProductForBuy}
        userCredits={userCredits}
        initialGtdId={gtdId}
        initialEldoId={eldoradoId}
        onClose={() => setSelectedProductForBuy(null)}
        onOpenDeposit={() => {
          setSelectedProductForBuy(null);
          setIsDepositOpen(true);
        }}
        onConfirm={handleConfirmBuy}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        userEmail={currentUser.email || ''}
        userCredits={userCredits}
        initialGtdId={gtdId}
        initialEldoId={eldoradoId}
        myCards={myCards}
        myOrders={myOrders}
        onClose={() => setIsProfileOpen(false)}
        onOpenDeposit={() => {
          setIsProfileOpen(false);
          setIsDepositOpen(true);
        }}
        onSaveGameIds={handleSaveGameIds}
      />
    </div>
  );
}
