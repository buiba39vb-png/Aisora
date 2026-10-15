import React, { useState } from 'react';
import { X, CreditCard, Coins, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { vndToCredits } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardData: {
    telco: string;
    amountVnd: number;
    credits: number;
    serial: string;
    pin: string;
  }) => Promise<void>;
}

export const DepositModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [telco, setTelco] = useState('Viettel');
  const [amountVnd, setAmountVnd] = useState<number>(50000);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculatedCredits = vndToCredits(amountVnd);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanSerial = serial.trim();
    const cleanPin = pin.trim();

    if (!cleanSerial || !cleanPin) {
      setError('Vui lòng nhập đầy đủ Số Serial và Mã Thẻ (PIN)!');
      return;
    }

    if (cleanPin.length < 8) {
      setError('Mã thẻ (PIN) quá ngắn, vui lòng kiểm tra lại!');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        telco,
        amountVnd,
        credits: calculatedCredits,
        serial: cleanSerial,
        pin: cleanPin,
      });
      setSerial('');
      setPin('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi thẻ. Vui lòng thử lại!');
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
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                NẠP THẺ CÀO &bull; NHẬN CREDITS
              </h3>
              <p className="text-[10px] text-amber-400 font-bold">
                Tỷ lệ quy đổi: 10,000 VNĐ = 10 Credits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quy đổi box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mệnh giá nạp</span>
            <p className="text-sm font-black text-white">{amountVnd.toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="text-amber-400 font-black text-lg">➔</div>
          <div className="space-y-0.5 text-right">
            <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1 justify-end">
              <Coins className="w-3 h-3" /> Số Credits Nhận
            </span>
            <p className="text-base font-black text-amber-400">
              +{calculatedCredits} <span className="text-xs">Credits</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nhà Mạng */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Chọn Nhà Mạng</label>
            <div className="grid grid-cols-3 gap-2">
              {['Viettel', 'Vinaphone', 'Mobifone', 'Zing', 'Garena'].map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setTelco(name)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    telco === name
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Mệnh Giá */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Mệnh Giá Thẻ Cào & Số Credits Tương Ứng
            </label>
            <select
              value={amountVnd}
              onChange={(e) => setAmountVnd(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value={10000}>10,000 VNĐ ➔ Nhận 10 Credits</option>
              <option value={20000}>20,000 VNĐ ➔ Nhận 20 Credits</option>
              <option value={50000}>50,000 VNĐ ➔ Nhận 50 Credits (Đề xuất)</option>
              <option value={100000}>100,000 VNĐ ➔ Nhận 100 Credits</option>
              <option value={200000}>200,000 VNĐ ➔ Nhận 200 Credits</option>
              <option value={500000}>500,000 VNĐ ➔ Nhận 500 Credits</option>
            </select>
          </div>

          {/* Số Serial */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Số Serial</label>
            <input
              type="text"
              required
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="Nhập dãy số serial trên thẻ cào"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:font-sans focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Mã PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mã Thẻ (Mã PIN)</label>
            <input
              type="text"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Cào lớp tráng bạc để lấy mã thẻ"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:font-sans focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảo mật giao dịch tối đa
            </p>
            <p>
              Thông tin nạp thẻ được gửi trực tiếp đến hệ thống quản trị riêng biệt để duyệt nạp an toàn 100%.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Đang gửi thẻ lên hệ thống...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GỬI THẺ &bull; QUY ĐỔI {calculatedCredits} CREDITS</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
