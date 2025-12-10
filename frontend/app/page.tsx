'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    budgetComfort: 'medium',
    priorities: [] as string[],
    styleDescription: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePriorityToggle = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/persona/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name);
        router.push('/shop');
      } else {
        alert('Failed to create persona. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PersonaShop
              </h1>
              <p className="text-sm text-gray-500 mt-1">AI Shopping Copilot that learns your taste</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>Powered by <span className="font-semibold text-blue-600">Raindrop MCP</span></div>
              <div>Hosted on <span className="font-semibold text-purple-600">Vultr</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to PersonaShop! 🛍️
            </h2>
            <p className="text-lg text-gray-600">
              Let&apos;s create your shopping persona so I can find the perfect products for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Budget Comfort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What&apos;s your budget comfort zone?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetComfort: level })}
                    className={`py-3 px-4 rounded-lg border-2 transition-all ${
                      formData.budgetComfort === level
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level === 'low' && '💰 Budget'}
                    {level === 'medium' && '💳 Moderate'}
                    {level === 'high' && '💎 Premium'}
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What matters most to you? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'price', label: '💵 Best Price', icon: '💵' },
                  { key: 'quality', label: '⭐ High Quality', icon: '⭐' },
                  { key: 'brand', label: '🏷️ Brand Names', icon: '🏷️' },
                  { key: 'sustainability', label: '🌱 Eco-Friendly', icon: '🌱' },
                  { key: 'shipping', label: '🚚 Fast Shipping', icon: '🚚' }
                ].map((priority) => (
                  <button
                    key={priority.key}
                    type="button"
                    onClick={() => handlePriorityToggle(priority.key)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all text-left ${
                      formData.priorities.includes(priority.key)
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your style in a few words (optional)
              </label>
              <input
                type="text"
                value={formData.styleDescription}
                onChange={(e) => setFormData({ ...formData, styleDescription: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., minimalist, gamer, professional, eco-conscious"
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: minimalist, gamer, professional, eco-conscious, techy
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Creating Your Persona...' : 'Start Shopping 🚀'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>🔒 Privacy First:</strong> Your persona is stored securely and only used to improve your shopping experience.
              Powered by Raindrop SmartMemory for intelligent personalization.
            </p>
          </div>
        </div>

        {/* Business Model Info */}
        <div className="mt-8 text-center">
          <a href="/merchant" className="text-sm text-gray-600 hover:text-purple-600 underline">
            Are you a merchant? Learn about PersonaShop for Business
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-12">
        <div className="text-center text-sm text-gray-500 space-y-2">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <span>🌩️ Infrastructure: <strong>Vultr</strong></span>
            <span>•</span>
            <span>🧠 AI Engine: <strong>Raindrop MCP</strong></span>
            <span>•</span>
            <span>⚡ Frontend: <strong>Next.js + Cloudflare</strong></span>
          </div>
          <p className="mt-2">PersonaShop - Your AI Shopping Copilot</p>
        </div>
      </footer>
    </div>
  );
}
