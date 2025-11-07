import type { Product, CartItem, Receipt, CheckoutFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API Base URL:', API_BASE_URL);

// Products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { success, message, data, count }
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Cart
export const fetchCart = async (): Promise<{ items: CartItem[]; total: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { success, message, data: { items, total, itemCount } }
    const cartData = data.data || { items: [], total: 0 };
    return {
      items: cartData.items || [],
      total: cartData.total || 0,
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (
  product: Product,
  quantity: number
): Promise<CartItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product.id,
        title: product.name,
        price: product.price,
        quantity,
        image: product.image || 'https://via.placeholder.com/150',
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns the updated cart
    console.log('Added to cart:', data);
    return data.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (productId: string | number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Removed from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItem = async (
  productId: string | number,
  quantity: number
): Promise<CartItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Updated cart item:', data);
    return data.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Checkout
export const checkout = async (
  cartItems: CartItem[],
  formData: CheckoutFormData
): Promise<Receipt> => {
  try {
    // Map cart items to the format expected by backend
    const formattedItems = cartItems.map(item => ({
      productId: item.productId,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || 'https://via.placeholder.com/150',
    }));

    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: formattedItems,
        customerName: formData.name,
        customerEmail: formData.email,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Checkout response:', data);
    
    // Transform backend response to receipt format
    const receipt: Receipt = {
      id: data.data.orderId,
      items: cartItems,
      total: data.data.total,
      timestamp: data.data.timestamp,
      customerName: data.data.customerName,
      customerEmail: data.data.customerEmail,
    };
    
    return receipt;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};
