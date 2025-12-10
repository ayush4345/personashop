'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, Zap } from 'lucide-react';

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
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  PersonaShop
                </h1>
                <p className="text-xs text-muted-foreground">AI Shopping Copilot that learns your taste</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Raindrop MCP
              </Badge>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Vultr
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">Welcome to PersonaShop!</CardTitle>
            <CardDescription className="text-base mt-2">
              Let&apos;s create your shopping persona so I can find the perfect products for you
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Budget Comfort */}
              <div className="space-y-3">
                <Label>What&apos;s your budget comfort zone?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Budget', emoji: '💰' },
                    { value: 'medium', label: 'Moderate', emoji: '💳' },
                    { value: 'high', label: 'Premium', emoji: '💎' }
                  ].map((level) => (
                    <Button
                      key={level.value}
                      type="button"
                      variant={formData.budgetComfort === level.value ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, budgetComfort: level.value })}
                      className="h-auto py-3 flex-col gap-1"
                    >
                      <span className="text-xl">{level.emoji}</span>
                      <span className="text-xs">{level.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Priorities */}
              <div className="space-y-3">
                <Label>What matters most to you? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'price', label: 'Best Price', emoji: '💵' },
                    { key: 'quality', label: 'High Quality', emoji: '⭐' },
                    { key: 'brand', label: 'Brand Names', emoji: '🏷️' },
                    { key: 'sustainability', label: 'Eco-Friendly', emoji: '🌱' },
                    { key: 'shipping', label: 'Fast Shipping', emoji: '🚚' }
                  ].map((priority) => (
                    <Button
                      key={priority.key}
                      type="button"
                      variant={formData.priorities.includes(priority.key) ? "default" : "outline"}
                      onClick={() => handlePriorityToggle(priority.key)}
                      className="h-auto py-3 justify-start gap-2"
                    >
                      <span>{priority.emoji}</span>
                      <span className="text-xs">{priority.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style Description */}
              <div className="space-y-2">
                <Label htmlFor="style">Describe your style (optional)</Label>
                <Input
                  id="style"
                  type="text"
                  value={formData.styleDescription}
                  onChange={(e) => setFormData({ ...formData, styleDescription: e.target.value })}
                  placeholder="e.g., minimalist, gamer, professional"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Examples: minimalist, gamer, professional, eco-conscious, techy
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin mr-2" />
                    Creating Your Persona...
                  </>
                ) : (
                  <>
                    Start Shopping
                    <ShoppingBag className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Privacy First:
                </strong>
                <span className="text-blue-800 mt-1 block">
                  Your persona is stored securely and only used to improve your shopping experience.
                  Powered by Raindrop SmartMemory for intelligent personalization.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Model Info */}
        <div className="mt-6 text-center">
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
            <a href="/merchant">
              Are you a merchant? Learn about PersonaShop for Business →
            </a>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 flex-wrap justify-center text-sm text-muted-foreground">
              <Badge variant="outline">🌩️ Vultr</Badge>
              <Badge variant="outline">🧠 Raindrop MCP</Badge>
              <Badge variant="outline">⚡ Next.js + Cloudflare</Badge>
            </div>
            <p className="text-xs text-muted-foreground">PersonaShop - Your AI Shopping Copilot</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
