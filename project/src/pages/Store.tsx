import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, Filter, Search, CreditCard, Package, Truck } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';

const Store: React.FC = () => {
  const { user } = useAuth();
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    checkout,
    getProductsByCategory 
  } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'collectibles', name: 'Collectibles' },
    { id: 'digital', name: 'Digital' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const success = await checkout('stripe');
      if (success) {
        setShowCart(false);
        setShowCheckoutForm(false);
        // Show success message
        alert('Order placed successfully!');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred during checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">CineStream Store</h1>
            <p className="text-gray-400">Official merchandise and collectibles</p>
          </div>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-red-400">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Featured Categories */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
              >
                <div className="text-3xl mb-2">
                  {category.id === 'apparel' && '👕'}
                  {category.id === 'accessories' && '🎒'}
                  {category.id === 'collectibles' && '🏆'}
                  {category.id === 'digital' && '💿'}
                </div>
                <h3 className="font-bold">{category.name}</h3>
                <p className="text-gray-400 text-sm">
                  {getProductsByCategory(category.id).length} items
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4 bg-gray-800 rounded-lg p-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-sm">{item.product.name}</h3>
                          <p className="text-red-400 font-bold">${item.product.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-red-400">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCheckoutForm(false)} />
          <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Checkout</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 p-4 bg-gray-800 rounded-lg">
              <span>Total:</span>
              <span className="text-xl font-bold text-red-400">${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCheckoutForm(false)}
                className="flex-1 bg-gray-700 text-white py-3 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;