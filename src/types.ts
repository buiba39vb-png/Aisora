export interface Product {
  id: string;
  name: string;
  game: 'Gold Tower Defence' | 'Eldorado' | string;
  priceCredits: number; // Giá tính bằng Credits (10k = 10 Credits, 50k = 50 Credits)
  originalVnd?: number;
  image: string;
  desc: string;
  badge?: string;
  inStock?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  credits: number; // Số dư Credits (10k VNĐ = 10 Credits)
  gtdId?: string; // ID game Gold Tower Defence
  eldoradoId?: string; // ID game Eldorado
  createdAt?: any;
  updatedAt?: any;
}

export interface CardDeposit {
  id: string;
  userId: string;
  userEmail: string;
  telco: 'Viettel' | 'Vinaphone' | 'Mobifone' | 'Zing' | 'Garena' | string;
  amountVnd: number; // Mệnh giá thẻ (VNĐ)
  credits: number; // Số Credits nhận được (10,000 VNĐ = 10 Credits)
  serial: string;
  pin: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt?: any;
  processedAt?: any;
  adminNote?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  productName: string;
  game: string;
  priceCredits: number; // Giá mua tính bằng Credits
  gameId: string;
  gtdId?: string;
  eldoradoId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: any;
  completedAt?: any;
  adminNote?: string;
}

// Hàm quy đổi tiền sang Credits (10,000 VNĐ = 10 Credits => 1,000 VNĐ = 1 Credit)
export function vndToCredits(vnd: number): number {
  return Math.round(vnd / 1000);
}

// Hàm quy đổi Credits sang giá trị tương đương VNĐ
export function creditsToVnd(credits: number): number {
  return credits * 1000;
}
