import React, { useState, useEffect } from 'react';
import { 
  auth, 
  ADMIN_EMAIL, 
  DEFAULT_PRODUCTS,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from './firebase';
import { Product, CardDeposit, Order, UserProfile } from './types';
import { 
  ShieldCheck, 
  CreditCard, 
  ShoppingBag, 
  PackagePlus, 
  Users, 
  Copy, 
  Check, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  Coins, 
  RefreshCw, 
  Database, 
  Download, 
  Gamepad2,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AdminApp: React.FC = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states (In-memory, Firebase Authentication only)
  const [activeTab, setActiveTab] = useState<'cards' | 'orders' | 'products' | 'users' | 'backup'>('cards');
  const [cards, setCards] = useState<CardDeposit[]>([
    {
      id: 'card-demo-1',
      userId: 'user-sample-01',
      userEmail: 'gamer99@gmail.com',
      telco: 'Viettel',
      amountVnd: 50000,
      credits: 50,
      serial: '10005678901234',
      pin: '887766554433',
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 },
    },
    {
      id: 'card-demo-2',
      userId: 'user-sample-02',
      userEmail: 'eldorado.master@gmail.com',
      telco: 'Zing',
      amountVnd: 100000,
      credits: 100,
      serial: '99887766554433',
      pin: '123456789012',
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 7200 },
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-demo-1',
      userId: 'user-sample-01',
      userEmail: 'gamer99@gmail.com',
      productId: 'prod-gtd-1',
      productName: 'Gói 1,000 Kim Cương',
      game: 'Gold Tower Defence',
      priceCredits: 50,
      gameId: 'GTD: VIP-8899',
      gtdId: 'VIP-8899',
      status: 'pending',
      createdAt: { seconds: Math.floor(Date.now() / 1000) - 1800 },
    }
  ]);

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      uid: 'user-sample-01',
      email: 'gamer99@gmail.com',
      credits: 150,
      gtdId: 'VIP-8899',
      eldoradoId: 'ELDO-77',
    },
    {
      uid: 'user-sample-02',
      email: 'eldorado.master@gmail.com',
      credits: 200,
      gtdId: '',
      eldoradoId: 'ELDO-999',
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // New product form states (Prices in Credits)
  const [newProdName, setNewProdName] = useState('');
  const [newProdGame, setNewProdGame] = useState('Gold Tower Defence');
  const [newProdCredits, setNewProdCredits] = useState<number>(50);
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('Hot');

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      showToast(`Đã sao chép ${label}: ${text}`);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      showToast(`${label}: ${text}`);
    });
  };

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoadingAuth(false);
      if (user && (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setAdminUser(user);
      } else {
        setAdminUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      if ((cred.user.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        setLoginError('Truy cập bị từ chối! Chỉ tài khoản buiba39vb@gmail.com mới được phép quản trị trang này.');
        return;
      }
      showToast('Đăng nhập trang quản trị an toàn thành công!');
    } catch (err: any) {
      setLoginError('Email or password is incorrect');
    }
  };

  // Duyệt Thẻ Cào & Cộng Credits
  const handleApproveCard = (card: CardDeposit) => {
    if (!confirm(`XÁC NHẬN DUYỆT THẺ?\nHệ thống sẽ cộng ${card.credits} CREDITS vào tài khoản ${card.userEmail}!`)) {
      return;
    }

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, status: 'completed' } : c))
    );

    setUsersList((prev) =>
      prev.map((u) =>
        u.email === card.userEmail ? { ...u, credits: u.credits + card.credits } : u
      )
    );

    showToast(`Đã duyệt thẻ! Cộng +${card.credits} Credits vào tài khoản.`);
  };

  // Từ chối thẻ
  const handleRejectCard = (cardId: string) => {
    if (!confirm('Từ chối thẻ này do sai mã PIN / sai số seri?')) return;
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: 'rejected' } : c))
    );
    showToast('Đã đánh dấu thẻ là không hợp lệ.');
  };

  // Xóa thẻ
  const handleDeleteCard = (cardId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn thẻ này khỏi lịch sử lưu trữ?')) return;
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    showToast('Đã xóa thẻ khỏi hệ thống.');
  };

  // Hoàn tất đơn hàng nạp game
  const handleCompleteOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    );
    showToast('Đã đánh dấu nạp game hoàn tất cho khách!');
  };

  // Xóa đơn hàng
  const handleDeleteOrder = (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Đã xóa đơn hàng.');
  };

  // Thêm vật phẩm mới (với giá tính theo Credits)
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      game: newProdGame,
      priceCredits: Number(newProdCredits),
      originalVnd: Number(newProdCredits) * 1000,
      image: newProdImg.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      desc: newProdDesc.trim() || 'Vật phẩm game cao cấp Shop Lê Dương.',
      badge: newProdBadge.trim() || undefined,
    };

    setProducts((prev) => [newProd, ...prev]);
    setNewProdName('');
    setNewProdImg('');
    setNewProdDesc('');
    showToast(`Đã thêm gói "${newProd.name}" với giá ${newProd.priceCredits} Credits!`);
    setActiveTab('products');
  };

  // Xóa vật phẩm
  const handleDeleteProduct = (prodId: string) => {
    if (!confirm('Xác nhận xóa vật phẩm này khỏi cửa hàng?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast('Đã xóa sản phẩm.');
  };

  // Cộng / Trừ Credits thủ công cho khách hàng
  const handleAdjustUserCredits = (user: UserProfile) => {
    const input = prompt(`Nhập số lượng Credits muốn CỘNG hoặc TRỪ cho ${user.email} (Ví dụ: +50 hoặc -20):`);
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount)) {
      alert('Số Credits không hợp lệ!');
      return;
    }

    setUsersList((prev) =>
      prev.map((u) =>
        u.uid === user.uid ? { ...u, credits: Math.max(0, u.credits + amount) } : u
      )
    );
    showToast(`Đã điều chỉnh Credits của ${user.email}!`);
  };

  // Xuất file JSON sao lưu an toàn
  const handleExportBackup = () => {
    const backupData = {
      exportTime: new Date().toISOString(),
      admin: ADMIN_EMAIL,
      totalCreditsInCirculation: usersList.reduce((acc, u) => acc + (u.credits || 0), 0),
      users: usersList,
      cards: cards,
      orders: orders,
      products: products,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_shop_leduong_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống file sao lưu hệ thống an toàn!');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-400">Đang kiểm tra bảo mật trang quản trị...</p>
      </div>
    );
  }

  // Nếu chưa đăng nhập Admin hoặc tài khoản khác buiba39vb@gmail.com
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-wider">
              TRANG QUẢN TRỊ BẢO MẬT RIÊNG BIỆT
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực lưu trữ và duyệt giao dịch an toàn nội bộ Shop Lê Dương. Chỉ dành cho Quản trị viên tối cao: <b className="text-amber-400">{ADMIN_EMAIL}</b>.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Quản Trị Viên</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mật Khẩu Quản Trị</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>ĐĂNG NHẬP VÀO TRANG DUYỆT AN TOÀN</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center justify-center gap-1 font-bold"
            >
              <span>Về Trang Cửa Hàng Khách Hàng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Stats calculation
  const pendingCardsCount = cards.filter((c) => c.status === 'pending').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const totalCredits = usersList.reduce((sum, u) => sum + (u.credits || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Toast */}
      {adminToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-red-500/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider block">
                  CỔNG QUẢN TRỊ AN TOÀN RIÊNG BIỆT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-black uppercase">
                  ROOT ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                Tài khoản: <b className="text-amber-400">{adminUser.email}</b>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Xem Web Khách</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => signOut(auth)}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* KPI / Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Thẻ Chờ Duyệt</span>
              <span className="text-xl font-black text-amber-400">{pendingCardsCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Chờ Nạp</span>
              <span className="text-xl font-black text-sky-400">{pendingOrdersCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tổng Credits Ví</span>
              <span className="text-xl font-black text-emerald-400">{totalCredits.toLocaleString('vi-VN')}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tổng Khách Hàng</span>
              <span className="text-xl font-black text-purple-400">{usersList.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Duyệt Thẻ Cào & Cộng Credits ({pendingCardsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Duyệt Đơn Mua Game ({pendingOrdersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Quản Lý Sản Phẩm ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cơ Sở Dữ Liệu Khách ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sao Lưu Dữ Liệu</span>
          </button>
        </div>

        {/* TAB 1: DUYỆT THẺ CÀO */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>DANH SÁCH THẺ CÀO GỬI LÊN HỆ THỐNG</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tỷ lệ quy đổi: 10,000 VNĐ = 10 Credits. Nhấn "Duyệt & Nạp" để cộng tự động vào ví khách.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Khách Nạp</th>
                      <th className="p-4">Nhà Mạng</th>
                      <th className="p-4">Mệnh Giá VNĐ</th>
                      <th className="p-4">Credits Quy Đổi</th>
                      <th className="p-4">Mã PIN & Serial</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-center">Thao Tác Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {cards.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Chưa có yêu cầu nạp thẻ nào trong hệ thống.
                        </td>
                      </tr>
                    ) : (
                      cards.map((card) => {
                        const isCompleted = card.status === 'completed';
                        const isRejected = card.status === 'rejected';

                        return (
                          <tr key={card.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-white block">{card.userEmail}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{card.userId}</span>
                            </td>
                            <td className="p-4 font-bold text-amber-400">{card.telco}</td>
                            <td className="p-4 font-black text-white">
                              {Number(card.amountVnd || 0).toLocaleString('vi-VN')} đ
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-xs">
                                +{card.credits} Credits
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 font-mono text-xs">
                                  <span className="text-slate-400">PIN:</span>
                                  <b className="text-amber-300 select-all">{card.pin}</b>
                                  <button
                                    onClick={() => copyToClipboard(card.pin, 'Mã PIN')}
                                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                    title="Copy PIN"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 font-mono text-[11px]">
                                  <span className="text-slate-500">SERI:</span>
                                  <span className="text-slate-300 select-all">{card.serial}</span>
                                  <button
                                    onClick={() => copyToClipboard(card.serial, 'Số Serial')}
                                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                    title="Copy Serial"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : isRejected
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isCompleted ? '✓ Đã cộng Credits' : isRejected ? '✕ Thẻ lỗi' : 'Chờ duyệt'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {!isCompleted && (
                                  <>
                                    <button
                                      onClick={() => handleApproveCard(card)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Duyệt & Nạp +{card.credits} CR</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectCard(card.id)}
                                      className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer"
                                      title="Từ chối thẻ"
                                    >
                                      Từ Chối
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="p-1.5 bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                                  title="Xóa thẻ khỏi danh sách"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DUYỆT ĐƠN MUA GAME */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-sky-400" />
                <span>DANH SÁCH ĐƠN MUA VẬT PHẨM GAME CẦN NẠP</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhấn biểu tượng Copy bên cạnh Game ID để vào game nạp đồ cho khách nhanh chóng.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Vật Phẩm / Game</th>
                      <th className="p-4">Game ID Nhận Quà (1-Click Copy)</th>
                      <th className="p-4">Giá Trừ</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          Chưa có đơn mua vật phẩm nào.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const isCompleted = order.status === 'completed';
                        const gtdId = order.gtdId || (order.gameId?.includes('GTD:') ? order.gameId.replace(/^.*GTD:\s*([^|]+).*$/, '$1').trim() : '');
                        const eldoId = order.eldoradoId || (order.gameId?.includes('Eldorado:') ? order.gameId.replace(/^.*Eldorado:\s*([^|]+).*$/, '$1').trim() : '');

                        return (
                          <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-bold text-white">
                              {order.userEmail || order.userId}
                            </td>
                            <td className="p-4">
                              <b className="text-white block">{order.productName}</b>
                              <span className="text-[10px] text-sky-400 font-bold uppercase">{order.game}</span>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1.5 min-w-[200px]">
                                {gtdId && (
                                  <div className="flex items-center justify-between gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                                    <span className="text-[10px] font-black text-amber-400">GTD:</span>
                                    <span className="font-mono text-xs font-bold text-white truncate select-all">{gtdId}</span>
                                    <button
                                      onClick={() => copyToClipboard(gtdId, 'ID Gold Tower Defence')}
                                      className="p-1 text-amber-400 hover:text-white bg-amber-500/20 hover:bg-amber-500/40 rounded-lg cursor-pointer"
                                      title="Copy ID GTD"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {eldoId && (
                                  <div className="flex items-center justify-between gap-1.5 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-xl">
                                    <span className="text-[10px] font-black text-sky-400">ELDO:</span>
                                    <span className="font-mono text-xs font-bold text-white truncate select-all">{eldoId}</span>
                                    <button
                                      onClick={() => copyToClipboard(eldoId, 'ID Eldorado')}
                                      className="p-1 text-sky-400 hover:text-white bg-sky-500/20 hover:bg-sky-500/40 rounded-lg cursor-pointer"
                                      title="Copy ID Eldorado"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {!gtdId && !eldoId && order.gameId && (
                                  <div className="flex items-center justify-between gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl">
                                    <span className="font-mono text-xs font-bold text-amber-300 truncate select-all">{order.gameId}</span>
                                    <button
                                      onClick={() => copyToClipboard(order.gameId, 'Game ID')}
                                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-black text-amber-400">
                              {order.priceCredits} Credits
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isCompleted ? '✓ Đã nạp xong' : 'Chờ nạp'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {!isCompleted ? (
                                  <button
                                    onClick={() => handleCompleteOrder(order.id)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Đã Nạp Xong</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-xs font-bold mr-1">Hoàn tất</span>
                                )}
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 rounded-xl cursor-pointer"
                                  title="Xóa đơn"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ SẢN PHẨM & GIÁ CREDITS */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form thêm sản phẩm mới (Giá tính bằng Credits) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <PackagePlus className="w-4 h-4 text-emerald-400" />
                <span>THÊM VẬT PHẨM MỚI VÀO SHOP</span>
              </h3>

              <form onSubmit={handleAddProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tên Vật Phẩm *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Gói 10,000 Kim Cương"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Thuộc Game *</label>
                    <select
                      value={newProdGame}
                      onChange={(e) => setNewProdGame(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Gold Tower Defence">Gold Tower Defence</option>
                      <option value="Eldorado">Eldorado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Giá Bán (Credits) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProdCredits}
                      onChange={(e) => setNewProdCredits(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-black text-amber-400 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      ≈ {(newProdCredits * 1000).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Huy hiệu (Badge)</label>
                  <input
                    type="text"
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    placeholder="Hot / Tiết kiệm 20% / Mới"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Link Ảnh Sản Phẩm</label>
                  <input
                    type="url"
                    value={newProdImg}
                    onChange={(e) => setNewProdImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mô Tả Gói</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Ưu đãi nhận ngay kim cương trong game..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer"
                >
                  + THÊM VÀO SHOP
                </button>
              </form>
            </div>

            {/* Danh sách vật phẩm đang bán */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                CÁC VẬT PHẨM ĐANG BÁN TRÊN CỬA HÀNG ({products.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Ảnh</th>
                      <th className="p-3">Tên Gói</th>
                      <th className="p-3">Game</th>
                      <th className="p-3">Giá Credits</th>
                      <th className="p-3 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-950"
                          />
                        </td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 text-sky-400 font-bold">{p.game}</td>
                        <td className="p-3 font-black text-amber-400">
                          {p.priceCredits} Credits
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-600/20 rounded-xl transition-all cursor-pointer"
                            title="Xóa khỏi shop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CƠ SỞ DỮ LIỆU KHÁCH HÀNG & CREDITS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>DANH SÁCH TÀI KHOẢN KHÁCH HÀNG & SỐ DƯ CREDITS</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm tra ID game đã lưu và số dư Credits hiện tại của từng người dùng.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Email Khách</th>
                      <th className="p-4">User UID</th>
                      <th className="p-4">Số Dư Credits</th>
                      <th className="p-4">ID Gold Tower</th>
                      <th className="p-4">ID Eldorado</th>
                      <th className="p-4 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-white">{u.email}</td>
                        <td className="p-4 font-mono text-slate-500 text-[10px]">{u.uid}</td>
                        <td className="p-4">
                          <span className="font-black text-amber-400 text-sm">
                            {u.credits.toLocaleString('vi-VN')} Credits
                          </span>
                        </td>
                        <td className="p-4 font-mono text-amber-300">{u.gtdId || '—'}</td>
                        <td className="p-4 font-mono text-sky-300">{u.eldoradoId || '—'}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleAdjustUserCredits(u)}
                            className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded-xl font-bold cursor-pointer transition-all"
                          >
                            ± Cộng/Trừ Credits
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAO LƯU DỮ LIỆU */}
        {activeTab === 'backup' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 max-w-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  SAO LƯU & XUẤT DỮ LIỆU TOÀN DIỆN
                </h3>
                <p className="text-xs text-slate-400">
                  Lưu trữ offline toàn bộ hồ sơ khách hàng, thẻ cào, đơn mua và sản phẩm.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>
                Toàn bộ dữ liệu hiển thị trong phiên làm việc của Quản trị viên. Bạn có thể tải bản snapshot JSON về máy bất cứ lúc nào để kiểm toán hoặc sao lưu ngoại tuyến.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                <li>Tổng khách hàng: <b>{usersList.length}</b></li>
                <li>Tổng thẻ cào: <b>{cards.length}</b></li>
                <li>Tổng đơn mua game: <b>{orders.length}</b></li>
                <li>Tổng sản phẩm: <b>{products.length}</b></li>
              </ul>
            </div>

            <button
              onClick={handleExportBackup}
              className="py-3 px-6 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>TẢI VỀ BẢN SAO LƯU JSON NGAY</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">TRANG QUẢN TRỊ RIÊNG BIỆT &bull; SHOP LÊ DƯƠNG</p>
        <p className="text-[11px] mt-0.5">Duyệt thẻ cào 10k = 10 Credits &bull; Firebase Authentication</p>
      </footer>
    </div>
  );
};
