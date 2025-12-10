# shadcn/ui Migration Guide

This document explains the shadcn/ui component implementation in PersonaShop.

---

## 📦 What is shadcn/ui?

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Unlike traditional component libraries, shadcn/ui components are copied into your project, giving you full ownership and customization control.

**Benefits:**
- ✅ Accessible by default (Radix UI primitives)
- ✅ Fully customizable (you own the code)
- ✅ Type-safe with TypeScript
- ✅ Works with Tailwind CSS
- ✅ No runtime dependencies for components
- ✅ Industry-standard patterns

---

## 🎨 Components Implemented

### 1. Button (`components/ui/button.tsx`)
Versatile button component with multiple variants.

**Variants:**
- `default` - Primary purple gradient
- `outline` - Border only
- `secondary` - Gray background
- `ghost` - No background
- `link` - Text link style
- `destructive` - Red for dangerous actions

**Sizes:**
- `sm` - Small (h-8)
- `default` - Medium (h-9)
- `lg` - Large (h-10)
- `icon` - Square icon button

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button>Click me</Button>
<Button variant="outline">Secondary Action</Button>
<Button size="lg" disabled>Loading...</Button>
```

### 2. Card (`components/ui/card.tsx`)
Flexible card container with modular sections.

**Components:**
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle/description
- `CardContent` - Main content
- `CardFooter` - Bottom section (actions)

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Brand</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Details here...</p>
  </CardContent>
</Card>
```

### 3. Input (`components/ui/input.tsx`)
Consistent text input with focus states.

**Features:**
- Built-in focus ring
- Placeholder support
- Disabled state styling
- Consistent height (h-9 or h-11)

**Usage:**
```tsx
import { Input } from '@/components/ui/input';

<Input
  type="email"
  placeholder="your.email@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### 4. Label (`components/ui/label.tsx`)
Accessible form labels using Radix UI.

**Features:**
- Properly associates with inputs
- Disabled cursor support
- Consistent typography

**Usage:**
```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### 5. Badge (`components/ui/badge.tsx`)
Small status/category indicators.

**Variants:**
- `default` - Purple primary
- `secondary` - Gray
- `destructive` - Red
- `outline` - Border only

**Usage:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge>New</Badge>
<Badge variant="secondary">Raindrop MCP</Badge>
<Badge variant="outline">🌩️ Vultr</Badge>
```

### 6. Separator (`components/ui/separator.tsx`)
Visual divider using Radix UI.

**Orientations:**
- `horizontal` - Default
- `vertical` - For sidebars/columns

**Usage:**
```tsx
import { Separator } from '@/components/ui/separator';

<div>
  <p>Section 1</p>
  <Separator className="my-4" />
  <p>Section 2</p>
</div>
```

---

## 🎨 Theming

### Color Palette

All colors are defined as CSS variables using HSL values:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 262.1 83.3% 57.8%;      /* Purple */
  --secondary: 240 4.8% 95.9%;       /* Gray */
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;      /* Red */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 262.1 83.3% 57.8%;         /* Focus ring */
}
```

### Using Theme Colors

```tsx
// In Tailwind classes
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="border-border bg-background text-foreground">

// In custom CSS
background-color: hsl(var(--primary));
color: hsl(var(--muted-foreground));
```

### Customizing Colors

To change the color scheme:

1. Update CSS variables in `app/globals.css`
2. Use HSL values for consistency
3. Ensure sufficient contrast ratios (WCAG AA)

**Example - Change primary to blue:**
```css
:root {
  --primary: 217 91% 60%;  /* Blue instead of purple */
}
```

---

## 🔧 Utilities

### `cn()` Function

Located in `lib/utils.ts`, this utility merges Tailwind classes intelligently:

```typescript
import { cn } from '@/lib/utils';

<Button className={cn(
  "base-class",
  isActive && "active-class",
  "override-class"
)} />
```

**How it works:**
1. Uses `clsx` to conditionally apply classes
2. Uses `tailwind-merge` to resolve conflicts (e.g., `p-4` + `p-2` = `p-2`)

---

## 📐 Layout Patterns

### Card with Actions
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

### Form Layout
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### Grid of Cards
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.content}
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 🎯 Best Practices

### Component Composition

**Do:**
```tsx
<Button variant="outline" size="lg">
  <Icon className="mr-2" />
  Text
</Button>
```

**Don't:**
```tsx
<button className="px-4 py-2 border rounded...">
  Text
</button>
```

### State Management

**Do:**
```tsx
<Button variant={isActive ? "default" : "outline"}>
  {isActive ? "Active" : "Inactive"}
</Button>
```

**Don't:**
```tsx
<button className={isActive ? "bg-purple-600..." : "bg-gray-200..."}>
  {isActive ? "Active" : "Inactive"}
</button>
```

### Accessibility

**Do:**
```tsx
<Label htmlFor="search">Search</Label>
<Input id="search" aria-label="Search products" />
```

**Don't:**
```tsx
<input placeholder="Search" />  // Missing label
```

---

## 🚀 Adding New Components

shadcn/ui has many more components available. To add them:

### Method 1: Manual Copy
1. Visit https://ui.shadcn.com/docs/components
2. Copy component code
3. Create file in `components/ui/`
4. Update imports as needed

### Method 2: CLI (if available)
```bash
npx shadcn-ui@latest add [component-name]
```

**Popular components to add:**
- `dialog` - Modal/popup
- `dropdown-menu` - Dropdown menus
- `select` - Dropdown select
- `checkbox` - Checkboxes
- `radio-group` - Radio buttons
- `tabs` - Tab navigation
- `toast` - Notifications
- `alert` - Alert messages
- `skeleton` - Loading placeholders

---

## 🎨 Customization Examples

### Custom Button Variant
```typescript
// In button.tsx
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        // ... existing variants
        gradient: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
      },
    },
  }
)
```

Usage:
```tsx
<Button variant="gradient">Gradient Button</Button>
```

### Custom Card Style
```tsx
<Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
  <CardHeader>
    <CardTitle className="text-purple-900">
      Special Card
    </CardTitle>
  </CardHeader>
</Card>
```

### Custom Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

---

## 📱 Responsive Design

### Mobile-First Breakpoints
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>

<Button className="w-full sm:w-auto">
  {/* Full width mobile, auto desktop */}
</Button>

<div className="hidden md:flex">
  {/* Hidden on mobile, visible on tablet+ */}
</div>
```

---

## 🐛 Troubleshooting

### Issue: Styles not applying
**Solution:** Ensure Tailwind CSS is properly configured and `globals.css` is imported in `layout.tsx`.

### Issue: cn() not found
**Solution:** Create `lib/utils.ts` with the `cn` function.

### Issue: Radix UI errors
**Solution:** Install required Radix packages:
```bash
npm install @radix-ui/react-slot @radix-ui/react-label
```

### Issue: Colors not working
**Solution:** Check that CSS variables are defined in `globals.css` and used correctly:
```tsx
// Correct
<div className="bg-primary">

// Incorrect
<div style={{ background: 'var(--primary)' }}>  // Missing hsl()
```

---

## 📚 Resources

- **shadcn/ui Docs**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/
- **Class Variance Authority**: https://cva.style/

---

## ✨ Benefits for PersonaShop

### Before shadcn/ui
- Custom CSS classes everywhere
- Inconsistent styling
- No accessibility features
- Hard to maintain

### After shadcn/ui
- ✅ Consistent design system
- ✅ Accessible by default
- ✅ Easy to customize
- ✅ Type-safe components
- ✅ Professional appearance
- ✅ Maintainable codebase

---

**Implemented by**: GitHub Copilot
**Date**: December 10, 2024
**Commit**: 7e3daa8
