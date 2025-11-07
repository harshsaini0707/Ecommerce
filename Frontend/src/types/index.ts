export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface CartItem {
  id: string | number;
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  customerName: string;
  customerEmail: string;
}
