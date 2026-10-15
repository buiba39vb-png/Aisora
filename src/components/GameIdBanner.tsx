import React from 'react';
import { Gamepad2, ShieldCheck, Edit3, Sparkles } from 'lucide-react';

interface Props {
  currentGtdId: string;
  currentEldoId: string;
  onOpenEdit: () => void;
}

export const GameIdBanner: React.FC<Props> = ({
  currentGtdId,
  currentEldoId,
  onOpenEdit,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>Hồ Sơ Game ID Nhận Vật Phẩm</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Đổi bất cứ khi nào
            </span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs">
          {/* Gold Tower Defence ID */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-amber-500/30">
            <span className="text-[11px] font-black text-amber-400 uppercase">GTD ID:</span>
            <span className="font-mono text-slate-100 font-bold">
              {currentGtdId || <span className="text-slate-500 italic">Chưa liên kết</span>}
            </span>
          </div>

          {/* Eldorado ID */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-sky-500/30">
            <span className="text-[11px] font-black text-sky-400 uppercase">Eldorado ID:</span>
            <span className="font-mono text-slate-100 font-bold">
              {currentEldoId || <span className="text-slate-500 italic">Chưa liên kết</span>}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 hidden lg:inline flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Tự động điền khi mua vật phẩm & không giới hạn lần đổi
          </span>
        </div>
      </div>

      <button
        onClick={onOpenEdit}
        className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Thay Đổi Game ID</span>
      </button>
    </div>
  );
};
