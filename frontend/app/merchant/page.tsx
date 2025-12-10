'use client';

export default function MerchantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PersonaShop for Merchants
              </h1>
              <p className="text-sm text-gray-500 mt-1">White-label AI shopping assistant for your store</p>
            </div>
            <a
              href="/"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to Shopping
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Increase Conversion & AOV with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PersonaShop provides a white-label AI shopping assistant that learns customer preferences,
            delivers personalized recommendations, and increases your average order value.
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Higher Conversion
            </h3>
            <p className="text-gray-600">
              Deep personalization helps customers find exactly what they need, reducing decision fatigue and cart abandonment.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Learning Assistant
            </h3>
            <p className="text-gray-600">
              Our AI learns from each interaction, continuously improving recommendations and building customer loyalty.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Easy Integration
            </h3>
            <p className="text-gray-600">
              Simple API or embeddable widget. Get up and running in minutes without building your own AI infrastructure.
            </p>
          </div>
        </div>

        {/* Business Model */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How PersonaShop Works for Your Business
          </h3>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Widget Integration</h4>
                <p className="text-gray-600">
                  Add our &quot;Shop with AI&quot; button to your product pages or checkout flow with a single line of code.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer Personalization</h4>
                <p className="text-gray-600">
                  PersonaShop creates a profile for each customer, learning their preferences, budget, and style over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Recommendations</h4>
                <p className="text-gray-600">
                  Our AI suggests products from your catalog that truly match each customer&apos;s needs and preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">4</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Increased Sales</h4>
                <p className="text-gray-600">
                  Better product-customer fit = higher conversion rates and larger basket sizes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Options */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-10 text-white mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Integration Options</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h4 className="text-2xl font-bold mb-4">🔌 Widget Embed</h4>
              <p className="mb-4">Drop-in JavaScript widget that works with any e-commerce platform.</p>
              <div className="bg-black/30 rounded p-4 text-sm font-mono overflow-x-auto">
                {'<script src="personashop.js"></script>\n<div id="personashop-widget"></div>'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h4 className="text-2xl font-bold mb-4">🔗 REST API</h4>
              <p className="mb-4">Full API access for custom integrations and experiences.</p>
              <div className="bg-black/30 rounded p-4 text-sm font-mono overflow-x-auto">
                {'POST /api/recommendations\nPOST /api/feedback\nGET /api/analytics'}
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Powered by Industry-Leading Technology
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Raindrop MCP</h4>
              <p className="text-sm text-gray-600">AI Engine for personalization and recommendations</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🌩️</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Vultr Cloud</h4>
              <p className="text-sm text-gray-600">Reliable, scalable infrastructure</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Cloudflare</h4>
              <p className="text-sm text-gray-600">Global CDN for instant response times</p>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl mb-2">💳</div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Stripe</h4>
              <p className="text-sm text-gray-600">Secure payment processing & analytics</p>
            </div>
          </div>
        </div>

        {/* Pricing Models */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Flexible Pricing</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Starter</h4>
              <p className="text-gray-600 mb-4">For small stores</p>
              <p className="text-3xl font-bold text-purple-600 mb-4">$99<span className="text-lg text-gray-500">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Up to 1,000 sessions/mo</li>
                <li>✓ Basic personalization</li>
                <li>✓ Widget integration</li>
                <li>✓ Email support</li>
              </ul>
            </div>

            <div className="border-2 border-purple-600 rounded-xl p-6 relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Professional</h4>
              <p className="text-gray-600 mb-4">For growing brands</p>
              <p className="text-3xl font-bold text-purple-600 mb-4">$299<span className="text-lg text-gray-500">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Up to 10,000 sessions/mo</li>
                <li>✓ Advanced personalization</li>
                <li>✓ API + Widget access</li>
                <li>✓ Priority support</li>
                <li>✓ Custom branding</li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h4>
              <p className="text-gray-600 mb-4">For large retailers</p>
              <p className="text-3xl font-bold text-purple-600 mb-4">Custom</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Unlimited sessions</li>
                <li>✓ Full AI customization</li>
                <li>✓ Dedicated infrastructure</li>
                <li>✓ 24/7 support</li>
                <li>✓ Revenue sharing options</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Store?</h3>
          <p className="text-xl mb-8 opacity-90">
            Start with a free demo and see how PersonaShop can increase your revenue.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all">
              Schedule Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </div>
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
            <span>⚡ CDN: <strong>Cloudflare</strong></span>
            <span>•</span>
            <span>💳 Payments: <strong>Stripe</strong></span>
          </div>
          <p className="mt-2">PersonaShop Merchant Solutions</p>
        </div>
      </footer>
    </div>
  );
}
