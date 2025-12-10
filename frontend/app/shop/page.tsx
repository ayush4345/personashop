'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, ShoppingBag, Sparkles, ThumbsUp, DollarSign, Frown, Tag, Leaf, ExternalLink, Lightbulb } from 'lucide-react';

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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  PersonaShop
                </h1>
                <p className="text-xs text-muted-foreground">Welcome back, {userName}! 👋</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Raindrop MCP
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Box */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              What are you looking for today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., I want a quiet mechanical keyboard under $100 for work"
                className="h-12"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Quick searches:</span>
              {[
                'quiet keyboard under $100',
                'ergonomic office chair',
                'budget gaming monitor'
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="h-7 text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Context Message */}
        {contextMessage && (
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-purple-900 font-medium">{contextMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Here are my top picks for you:
            </h3>

            {recommendations.map((rec, index) => (
              <Card key={rec.product.id} className="shadow-xl hover:shadow-2xl transition-shadow border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-48 h-36 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={rec.product.image_url}
                        alt={rec.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">#{index + 1} Recommendation</Badge>
                          <CardTitle className="text-xl">{rec.product.name}</CardTitle>
                          <CardDescription>{rec.product.brand}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">
                            ${rec.product.price}
                          </p>
                        </div>
                      </div>

                      {/* Why For You */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4 pb-3">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Why this is great for you:</p>
                          <p className="text-sm text-blue-800">{rec.whyForYou}</p>
                        </CardContent>
                      </Card>

                      {/* Explanation */}
                      <div className="text-sm text-muted-foreground">
                        <div dangerouslySetInnerHTML={{ __html: rec.explanation }} />
                      </div>

                      <Separator />

                      {/* Buy Button */}
                      <div className="flex items-center gap-3">
                        <Button
                          asChild
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <a
                            href={rec.product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Buy on Store
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          ✨ PersonaShop earns a small commission (demo)
                        </span>
                      </div>

                      {/* Feedback Buttons */}
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-3">Help me learn:</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedFeedback[rec.product.id]?.type === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeedback(rec.product.id, 1, 'love_it')}
                            className="h-8"
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Love it
                          </Button>
                          <Button
                            variant={selectedFeedback[rec.product.id]?.reason === 'too_expensive' ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => handleFeedback(rec.product.id, -1, 'too_expensive')}
                            className="h-8"
                          >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Too expensive
                          </Button>
                          <Button
                            variant={selectedFeedback[rec.product.id]?.reason === 'dont_like_look' ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => handleFeedback(rec.product.id, -1, 'dont_like_look')}
                            className="h-8"
                          >
                            <Frown className="w-3 h-3 mr-1" />
                            Don&apos;t like the look
                          </Button>
                          <Button
                            variant={selectedFeedback[rec.product.id]?.reason === 'brand_preference' ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeedback(rec.product.id, 1, 'brand_preference')}
                            className="h-8"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            Love this brand
                          </Button>
                          <Button
                            variant={selectedFeedback[rec.product.id]?.reason === 'love_sustainability' ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeedback(rec.product.id, 1, 'love_sustainability')}
                            className="h-8"
                          >
                            <Leaf className="w-3 h-3 mr-1" />
                            Eco-friendly
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {recommendations.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Start by searching for what you need! 🔍
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Raindrop SmartInference • Hosted on Vultr
          </p>
        </div>
      </footer>
    </div>
  );
}
