'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  url: string;
  attributes: any;
}

interface Recommendation {
  product: Product;
  score: number;
  explanation: string;
  whyForYou: string;
}

export default function ShopPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [contextMessage, setContextMessage] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<{ [key: string]: { type: number; reason: string } }>({});

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (!storedUserId) {
      router.push('/');
    } else {
      setUserId(storedUserId);
      setUserName(storedUserName || 'there');
    }
  }, [router]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, queryText: query })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        setRecommendations(data.recommendations || []);
        setContextMessage(data.contextMessage || '');
        setSelectedFeedback({});
      } else {
        alert('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (productId: string, likeDislike: number, reasonTag: string) => {
    setSelectedFeedback(prev => ({ ...prev, [productId]: { type: likeDislike, reason: reasonTag } }));

    try {
      const response = await fetch('http://localhost:3001/api/shop/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          productId,
          likeDislike,
          reasonTag
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.learningMessage) {
          setContextMessage(data.learningMessage);
        }
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PersonaShop
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {userName}! 👋</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>Powered by <span className="font-semibold text-blue-600">Raindrop MCP</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What are you looking for today?
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., I want a quiet mechanical keyboard under $100 for work"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-sm text-gray-500 w-full mb-1">Quick searches:</p>
            {[
              'quiet keyboard under $100',
              'ergonomic office chair',
              'budget gaming monitor'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Context Message */}
        {contextMessage && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-purple-900">
              <strong>💡 {contextMessage}</strong>
            </p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Here are my top picks for you:
            </h3>

            {recommendations.map((rec, index) => (
              <div
                key={rec.product.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-6">
                  <div className="w-48 h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={rec.product.image_url}
                      alt={rec.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded mb-2">
                          #{index + 1} Recommendation
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{rec.product.name}</h4>
                        <p className="text-sm text-gray-600">{rec.product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-600">
                          ${rec.product.price}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Why this is great for you:</p>
                        <p className="text-sm text-blue-800">{rec.whyForYou}</p>
                      </div>
                      
                      <div className="text-sm text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: rec.explanation }} />
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      <a
                        href={rec.product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        Buy on Store →
                      </a>
                      <span className="text-xs text-gray-500">
                        ✨ PersonaShop earns a small commission (demo)
                      </span>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Help me learn:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleFeedback(rec.product.id, 1, 'love_it')}
                          className={`text-xs px-3 py-1 rounded-full border-2 transition-all ${
                            selectedFeedback[rec.product.id]?.type === 1
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          👍 Love it
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.product.id, -1, 'too_expensive')}
                          className={`text-xs px-3 py-1 rounded-full border-2 transition-all ${
                            selectedFeedback[rec.product.id]?.reason === 'too_expensive'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 hover:border-red-500'
                          }`}
                        >
                          💰 Too expensive
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.product.id, -1, 'dont_like_look')}
                          className={`text-xs px-3 py-1 rounded-full border-2 transition-all ${
                            selectedFeedback[rec.product.id]?.reason === 'dont_like_look'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 hover:border-red-500'
                          }`}
                        >
                          😕 Don&apos;t like the look
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.product.id, 1, 'brand_preference')}
                          className={`text-xs px-3 py-1 rounded-full border-2 transition-all ${
                            selectedFeedback[rec.product.id]?.reason === 'brand_preference'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          🏷️ Love this brand
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.product.id, 1, 'love_sustainability')}
                          className={`text-xs px-3 py-1 rounded-full border-2 transition-all ${
                            selectedFeedback[rec.product.id]?.reason === 'love_sustainability'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          🌱 Eco-friendly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Start by searching for what you need! 🔍
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>Powered by Raindrop SmartInference • Hosted on Vultr</p>
        </div>
      </footer>
    </div>
  );
}
