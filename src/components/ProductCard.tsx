import React from 'react';
import { Product } from '../types';
import { Coins, ShoppingCart, Sparkles, ShieldAlert } from 'lucide-react';

interface Props {
  product: Product;
  userCredits: number;
  onBuy: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, userCredits, onBuy }) => {
  const isAffordable = userCredits >= product.priceCredits;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between p-4 relative">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-6 left-6 z-10 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{product.badge}</span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        
        {/* Game label on image */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider backdrop-blur-sm">
          {product.game}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.desc}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-3">
          <div>
            <div className="flex items-center gap-1 text-amber-400 font-black text-base sm:text-lg">
              <Coins className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{product.priceCredits.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] font-bold text-amber-300/90 uppercase ml-0.5">Credits</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              ≈ {(product.priceCredits * 1000).toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          <button
            onClick={() => onBuy(product)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Mua Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
