import React from 'react';
import { Coins, CreditCard, Gamepad2, LogOut, User as UserIcon } from 'lucide-react';

interface Props {
  userEmail: string;
  userCredits: number;
  currentGtdId: string;
  currentEldoId: string;
  currentGameFilter: string;
  onFilterChange: (game: string) => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  userEmail,
  userCredits,
  currentGtdId,
  currentEldoId,
  currentGameFilter,
  onFilterChange,
  onOpenDeposit,
  onOpenProfile,
  onLogout,
}) => {
  const displayId = currentGtdId || currentEldoId;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo Shop Lê Dương */}
        <div 
          onClick={() => onFilterChange('all')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            LD
          </div>
          <div>
            <span className="text-base sm:text-lg font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider block">
              LÊ DƯƠNG
            </span>
            <span className="text-[9px] text-amber-400/80 font-extrabold tracking-widest uppercase block -mt-1">
              SHOP GAME & CREDITS
            </span>
          </div>
        </div>

        {/* Filter Game Tabs */}
        <nav className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentGameFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất Cả Game
          </button>
          <button
            onClick={() => onFilterChange('Gold Tower Defence')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentGameFilter === 'Gold Tower Defence'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gold Tower Defence
          </button>
          <button
            onClick={() => onFilterChange('Eldorado')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentGameFilter === 'Eldorado'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Eldorado
          </button>
        </nav>

        {/* Actions Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Nút Đổi Nhanh Game ID */}
          <button
            onClick={onOpenProfile}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Nhấn để đổi Game ID bất cứ lúc nào"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {displayId ? `ID: ${displayId}` : 'Đổi Game ID'}
            </span>
            <span className="sm:hidden text-[10px]">ID Game</span>
          </button>

          {/* Nút Nạp Thẻ Cào */}
          <button
            onClick={onOpenDeposit}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Nạp Thẻ</span>
          </button>

          {/* Số Dư Credits (10k = 10 Credits) */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 cursor-pointer hover:border-amber-500/60 transition-all"
            title="10,000 VNĐ = 10 Credits"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Số Dư</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 leading-tight">
                {userCredits.toLocaleString('vi-VN')} <span className="text-[10px] text-amber-300">Credits</span>
              </span>
            </div>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenProfile}
            className="p-1 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-500 hover:scale-105 transition-transform cursor-pointer"
            title={`Tài khoản: ${userEmail}`}
          >
            <div className="w-8 h-8 rounded-[10px] bg-slate-900 flex items-center justify-center text-xs font-black text-white uppercase">
              {userEmail ? userEmail.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Đăng xuất"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
