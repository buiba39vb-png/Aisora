import React from 'react';
import { ShieldAlert, RefreshCw, XOctagon, Lock } from 'lucide-react';

interface Props {
  reason?: string;
  onRetry: () => boolean;
}

export const DevToolsBlockedModal: React.FC<Props> = ({ reason, onRetry }) => {
  const [retryFailed, setRetryFailed] = React.useState(false);

  const handleCheck = () => {
    const success = onRetry();
    if (!success) {
      setRetryFailed(true);
      setTimeout(() => setRetryFailed(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/80 text-center relative overflow-hidden">
        {/* Glow & Scanlines background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Animated Warning Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/20 animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-black uppercase tracking-widest">
              <XOctagon className="w-3.5 h-3.5" />
              <span>CẢNH BÁO AN NINH & BẢO MẬT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              KHÔNG THỂ TIẾP TỤC!
            </h2>
            <p className="text-sm font-semibold text-rose-300">
              Phát hiện Developer Tools (F12 / Inspect / Console) đang được bật.
            </p>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Chính sách bảo mật Shop Lê Dương:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nhằm ngăn chặn hành vi can thiệp dữ liệu, sửa đổi số dư Credits và bảo vệ an toàn cho hệ thống nạp game, trang web yêu cầu tắt hoàn toàn Developer Tools trước khi tiếp tục thao tác.
            </p>
            {reason && (
              <p className="text-[11px] text-rose-400 font-mono bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                Chi tiết: {reason}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleCheck}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Tôi Đã Đóng DevTools - Kiểm Tra Lại</span>
            </button>
            {retryFailed && (
              <p className="text-xs text-rose-400 font-bold animate-pulse">
                ❌ Vẫn phát hiện Developer Tools! Vui lòng nhấn F12 hoặc phím tắt đóng công cụ.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
