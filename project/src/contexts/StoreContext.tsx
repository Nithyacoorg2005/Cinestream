import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'digital';
  movieId?: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: Date;
  trackingNumber?: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  checkout: (paymentMethod: string) => Promise<boolean>;
  getProductsByCategory: (category: string) => Product[];
  getProductsByMovie: (movieId: string) => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Quantum Heist T-Shirt',
    description: 'Official movie merchandise featuring the iconic logo',
    price: 24.99,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'apparel',
    movieId: '1',
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'CineStream Premium Hoodie',
    description: 'Comfortable hoodie with embroidered CineStream logo',
    price: 49.99,
    image: 'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'apparel',
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    name: 'Midnight Chronicles Poster Set',
    description: 'Set of 3 high-quality posters from the hit series',
    price: 19.99,
    image: 'https://images.pexels.com/photos/7991676/pexels-photo-7991676.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'collectibles',
    movieId: '2',
    inStock: true,
    rating: 4.3,
    reviews: 67
  },
  {
    id: '4',
    name: 'CineStream Coffee Mug',
    description: 'Start your day with your favorite streaming platform',
    price: 14.99,
    image: 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'accessories',
    inStock: true,
    rating: 4.6,
    reviews: 234
  },
  {
    id: '5',
    name: 'Stellar Horizon Soundtrack',
    description: 'Digital download of the epic space series soundtrack',
    price: 9.99,
    image: 'https://images.pexels.com/photos/7991522/pexels-photo-7991522.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'digital',
    movieId: '4',
    inStock: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '6',
    name: 'Ocean\'s Legacy Cap',
    description: 'Stylish cap inspired by the heist movie',
    price: 22.99,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'accessories',
    movieId: '3',
    inStock: true,
    rating: 4.2,
    reviews: 91
  },
  {
    id: '7',
    name: 'Shadow Protocol Action Figure',
    description: 'Collectible action figure of the main character',
    price: 34.99,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'collectibles',
    movieId: '6',
    inStock: false,
    rating: 4.7,
    reviews: 45
  },
  {
    id: '8',
    name: 'CineStream Phone Case',
    description: 'Protect your phone with style',
    price: 18.99,
    image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'accessories',
    inStock: true,
    rating: 4.4,
    reviews: 178
  }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cinestream_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const storedOrders = localStorage.getItem('cinestream_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('cinestream_cart', JSON.stringify(newCart));
  };

  const saveOrders = (newOrders: Order[]) => {
    localStorage.setItem('cinestream_orders', JSON.stringify(newOrders));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity }];
      }
      
      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => {
      const newCart = prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cinestream_cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const checkout = async (paymentMethod: string): Promise<boolean> => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrder: Order = {
        id: Date.now().toString(),
        items: [...cart],
        total: getCartTotal(),
        status: 'processing',
        orderDate: new Date(),
        trackingNumber: `CS${Date.now()}`
      };

      setOrders(prev => {
        const newOrders = [newOrder, ...prev];
        saveOrders(newOrders);
        return newOrders;
      });

      clearCart();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByMovie = (movieId: string) => {
    return products.filter(product => product.movieId === movieId);
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      checkout,
      getProductsByCategory,
      getProductsByMovie
    }}>
      {children}
    </StoreContext.Provider>
  );
};