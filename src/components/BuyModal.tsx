import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Coins, Gamepad2, ShieldCheck, AlertCircle, CreditCard, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  product: Product | null;
  userCredits: number;
  initialGtdId: string;
  initialEldoId: string;
  onClose: () => void;
  onOpenDeposit: () => void;
  onConfirm: (product: Product, gtdId: string, eldoId: string) => Promise<void>;
}

export const BuyModal: React.FC<Props> = ({
  isOpen,
  product,
  userCredits,
  initialGtdId,
  initialEldoId,
  onClose,
  onOpenDeposit,
  onConfirm,
}) => {
  const [gtdId, setGtdId] = useState(initialGtdId);
  const [eldoId, setEldoId] = useState(initialEldoId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGtdId(initialGtdId || '');
    setEldoId(initialEldoId || '');
  }, [initialGtdId, initialEldoId, isOpen]);

  if (!isOpen || !product) return null;

  const isAffordable = userCredits >= product.priceCredits;
  const missingCredits = product.priceCredits - userCredits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanGtd = gtdId.trim();
    const cleanEldo = eldoId.trim();

    if (!cleanGtd && !cleanEldo) {
      setError('Vui lòng nhập ID Gold Tower Defence hoặc ID Eldorado (hoặc cả 2) để nạp vật phẩm vào acc!');
      return;
    }

    if (!isAffordable) {
      setError(`Số dư không đủ! Cần thêm ${missingCredits} Credits để mua gói này.`);
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(product, cleanGtd, cleanEldo);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý đơn hàng. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                XÁC NHẬN MUA VẬT PHẨM
              </h3>
              <p className="text-[10px] text-indigo-400 font-bold uppercase">{product.game}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="text-sm font-black text-white">{product.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{product.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-1 justify-end">
                <Coins className="w-4 h-4 text-amber-400" />
                {product.priceCredits} <span className="text-xs">Credits</span>
              </span>
              <span className="text-[10px] text-slate-500 block">
                ≈ {(product.priceCredits * 1000).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
            <span className="text-slate-400">Số dư hiện tại của bạn:</span>
            <span className={`font-black ${isAffordable ? 'text-emerald-400' : 'text-rose-400'}`}>
              {userCredits} Credits
            </span>
          </div>
        </div>

        {/* Insufficient Credits Banner */}
        {!isAffordable && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Số dư Credits không đủ!</span>
            </div>
            <p className="text-rose-200/80 text-[11px] leading-relaxed">
              Bạn thiếu <b className="text-white">{missingCredits} Credits</b>. Nạp thêm thẻ cào ngay để hoàn tất đơn hàng.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDeposit();
              }}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Nạp Thêm Thẻ Cào Ngay</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Game IDs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                Game ID Nhận Quà
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">
                (Nhập 1 trong 2 hoặc cả 2)
              </span>
            </div>

            {/* GTD ID */}
            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1 flex items-center justify-between">
                <span>ID Gold Tower Defence:</span>
                {gtdId && <span className="text-[10px] text-emerald-400 font-semibold">✓ Đã có ID</span>}
              </label>
              <input
                type="text"
                value={gtdId}
                onChange={(e) => setGtdId(e.target.value)}
                placeholder="Ví dụ: GTD-9988 hoặc Tên acc GTD"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder:font-sans"
              />
            </div>

            {/* Eldorado ID */}
            <div>
              <label className="block text-[11px] font-bold text-sky-400 mb-1 flex items-center justify-between">
                <span>ID Game Eldorado:</span>
                {eldoId && <span className="text-[10px] text-sky-400 font-semibold">✓ Đã có ID</span>}
              </label>
              <input
                type="text"
                value={eldoId}
                onChange={(e) => setEldoId(e.target.value)}
                placeholder="Ví dụ: ELDO-7766 hoặc Tên acc Eldorado"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono placeholder:font-sans"
              />
            </div>

            <p className="text-[10px] text-slate-500 italic">
              * Hệ thống sẽ tự động cập nhật Game ID mới này vào hồ sơ của bạn cho các lần nạp sau.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isAffordable || submitting}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span>Đang xử lý đơn mua...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>XÁC NHẬN MUA & TRỪ {product.priceCredits} CREDITS</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
