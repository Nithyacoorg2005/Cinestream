import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Shield, Download, Users, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Limited content library',
        'Watch with ads',
        'Standard definition (480p)',
        '1 device at a time',
        'Basic profiles'
      ],
      limitations: [
        'No premium content',
        'Ads during playback',
        'Limited video quality',
        'No downloads',
        'No watch parties'
      ]
    },
    premium: {
      name: 'Premium',
      price: { monthly: 12.99, yearly: 129.99 },
      features: [
        'Full content library',
        'Ad-free experience',
        'Ultra HD (4K) streaming',
        'Watch on 4 devices',
        'Download for offline viewing',
        'Watch parties with friends',
        'Early access to new releases',
        'Premium customer support'
      ],
      popular: true
    }
  };

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe or another payment processor
    alert('Payment integration would be implemented here');
  };

  const currentPlan = user?.subscription || 'free';
  const yearlyDiscount = Math.round((1 - (plans.premium.price.yearly / 12) / plans.premium.price.monthly) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg">
            Unlock the full CineStream experience with Premium
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentPlan && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Current Plan</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentPlan === 'premium' 
                      ? 'bg-yellow-600 text-black' 
                      : 'bg-gray-700 text-white'
                  }`}>
                    {currentPlan === 'premium' ? 'Premium' : 'Free'}
                  </span>
                  {currentPlan === 'premium' && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
              {currentPlan === 'free' && (
                <button
                  onClick={handleUpgrade}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-colors relative ${
                billingCycle === 'yearly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                Save {yearlyDiscount}%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{plans.free.name}</h3>
              <div className="text-4xl font-bold mb-2">
                ${plans.free.price[billingCycle]}
                <span className="text-lg text-gray-400 font-normal">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-gray-400">Perfect for casual viewing</p>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-green-400">What's Included:</h4>
              {plans.free.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-red-400">Limitations:</h4>
              {plans.free.limitations.map((limitation, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400">{limitation}</span>
                </div>
              ))}
            </div>

            <button
              disabled={currentPlan === 'free'}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                currentPlan === 'free'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-red-900/20 to-gray-900 rounded-lg p-8 border-2 border-red-600 relative">
            {plans.premium.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span>{plans.premium.name}</span>
              </h3>
              <div className="text-4xl font-bold mb-2">
                ${plans.premium.price[billingCycle]}
                <span className="text-lg text-gray-400 font-normal">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-green-400 text-sm">
                  Save ${(plans.premium.price.monthly * 12 - plans.premium.price.yearly).toFixed(2)} per year
                </p>
              )}
              <p className="text-gray-400 mt-2">The ultimate streaming experience</p>
            </div>

            <div className="space-y-4 mb-8">
              {plans.premium.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={currentPlan === 'premium'}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                currentPlan === 'premium'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="bg-gray-900 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Premium Content</h3>
              <p className="text-gray-400 text-sm">Access to exclusive movies and series</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Ad-Free</h3>
              <p className="text-gray-400 text-sm">Uninterrupted viewing experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Offline Downloads</h3>
              <p className="text-gray-400 text-sm">Watch anywhere, anytime</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Watch Parties</h3>
              <p className="text-gray-400 text-sm">Enjoy movies with friends</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">What devices can I watch on?</h3>
              <p className="text-gray-400">CineStream works on computers, tablets, smartphones, smart TVs, and streaming devices. Premium allows up to 4 simultaneous streams.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">New users get access to our free tier immediately. You can upgrade to Premium at any time to unlock all features.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">How does offline viewing work?</h3>
              <p className="text-gray-400">Premium subscribers can download content to their devices for offline viewing. Downloads are available for 30 days or 48 hours after you start watching.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;