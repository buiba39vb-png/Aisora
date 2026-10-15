import React, { useState, useEffect } from 'react';
import { CardDeposit, Order } from '../types';
import { 
  X, 
  Coins, 
  CreditCard, 
  Gamepad2, 
  Save, 
  History, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  userEmail: string;
  userCredits: number;
  initialGtdId: string;
  initialEldoId: string;
  myCards: CardDeposit[];
  myOrders: Order[];
  onClose: () => void;
  onOpenDeposit: () => void;
  onSaveGameIds: (gtdId: string, eldoId: string) => Promise<void>;
}

export const ProfileModal: React.FC<Props> = ({
  isOpen,
  userEmail,
  userCredits,
  initialGtdId,
  initialEldoId,
  myCards,
  myOrders,
  onClose,
  onOpenDeposit,
  onSaveGameIds,
}) => {
  const [gtdId, setGtdId] = useState(initialGtdId);
  const [eldoId, setEldoId] = useState(initialEldoId);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'orders'>('cards');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setGtdId(initialGtdId || '');
    setEldoId(initialEldoId || '');
  }, [initialGtdId, initialEldoId, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveGameIds(gtdId.trim(), eldoId.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                HỒ SƠ & QUẢN LÝ GAME ID
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Số Dư Credits Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Số Dư Tài Khoản</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-black text-amber-400">
                {userCredits.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-black text-amber-300">Credits</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              ≈ {(userCredits * 1000).toLocaleString('vi-VN')} VNĐ (10k = 10 Credits)
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>+ Nạp Thẻ</span>
          </button>
        </div>

        {/* Form Đổi Game ID Bất Cứ Lúc Nào */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Thay Đổi Game ID Của Bạn</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Đổi bất cứ lúc nào
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Bạn có thể cập nhật hoặc đổi ID game bất cứ khi nào, không giới hạn số lần. Hệ thống tự động ghi nhớ cho các lần mua tiếp theo.
          </p>

          <form onSubmit={handleSave} className="space-y-3 pt-1">
            {/* GTD ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-400">
                  ID Gold Tower Defence:
                </label>
                {gtdId && (
                  <button
                    type="button"
                    onClick={() => setGtdId('')}
                    className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    Xóa ID
                  </button>
                )}
              </div>
              <input
                type="text"
                value={gtdId}
                onChange={(e) => setGtdId(e.target.value)}
                placeholder="Nhập hoặc đổi ID Gold Tower Defence..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder:font-sans"
              />
            </div>

            {/* Eldorado ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-sky-400">
                  ID Game Eldorado:
                </label>
                {eldoId && (
                  <button
                    type="button"
                    onClick={() => setEldoId('')}
                    className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    Xóa ID
                  </button>
                )}
              </div>
              <input
                type="text"
                value={eldoId}
                onChange={(e) => setEldoId(e.target.value)}
                placeholder="Nhập hoặc đổi ID Eldorado..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono placeholder:font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang lưu...' : 'LƯU THAY ĐỔI GAME ID'}</span>
            </button>

            {saveSuccess && (
              <p className="text-xs text-emerald-400 font-bold text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu Game ID thành công!</span>
              </p>
            )}
          </form>
        </div>

        {/* Lịch Sử Giao Dịch */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Lịch Sử Nạp Thẻ ({myCards.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Đơn Mua Game ({myOrders.length})</span>
            </button>
          </div>

          {/* Cards Tab Content */}
          {activeTab === 'cards' && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {myCards.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
                  Bạn chưa có yêu cầu nạp thẻ nào.
                </div>
              ) : (
                myCards.map((card) => {
                  const isSuccess = card.status === 'completed';
                  const isRejected = card.status === 'rejected';
                  return (
                    <div
                      key={card.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{card.telco}</span>
                          <span className="text-[10px] text-slate-400">
                            {Number(card.amountVnd || 0).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                          +{card.credits} Credits
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          PIN: {card.pin}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          isSuccess
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isRejected
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isSuccess ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã cộng ví</span>
                          </>
                        ) : isRejected ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Thẻ lỗi</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Chờ duyệt</span>
                          </>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {myOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
                  Bạn chưa có đơn mua vật phẩm nào.
                </div>
              ) : (
                myOrders.map((order) => {
                  const isCompleted = order.status === 'completed';
                  return (
                    <div
                      key={order.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <b className="text-white text-xs">{order.productName}</b>
                        <div className="text-[10px] text-indigo-400 font-bold">
                          Game: {order.game} &bull; -{order.priceCredits} Credits
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                          ID nhận: <b className="text-amber-400">{order.gameId}</b>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã nạp xong</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Đang nạp</span>
                          </>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
