# Available Components & Utilities

## 🧩 shadcn/ui Components (Already Installed)

### Layout
```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
```

### Forms
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
```

### Navigation
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

### Feedback
```tsx
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
```

### Data Display
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

---

## 🎨 Tailwind CSS Classes

### Colors (Amber Theme)
```css
bg-amber-50, bg-amber-100, bg-amber-400, bg-amber-500
text-amber-600, text-amber-700
border-amber-100, border-amber-200
hover:bg-amber-500
```

### Gradients
```css
bg-gradient-to-b from-amber-50 to-white
bg-gradient-to-r from-amber-400 to-amber-600
```

### Animations
```css
animate-pulse
animate-bounce
animate-spin
transition-all duration-300
hover:scale-105
hover:-translate-y-1
```

### Shadows
```css
shadow-sm
shadow-md
shadow-lg
shadow-xl
hover:shadow-2xl
```

### Spacing
```css
p-4, p-6, p-8, p-12
m-4, m-6, m-8
gap-4, gap-6
space-y-4, space-x-4
```

---

## 🎭 Lucide Icons

```tsx
import { 
  Clock, MapPin, TrendingUp, Plus, Trash2, Eye, EyeOff,
  User, Mail, Lock, LogOut, Settings, Search,
  ChevronRight, ChevronLeft, ChevronDown,
  Check, X, AlertCircle, Info,
  Upload, Download, Share2, Copy,
  Home, List, BarChart, Users
} from "lucide-react"

// Usage
<Clock className="h-4 w-4 text-amber-600" />
```

---

## 🔧 Utility Functions

### Class Names
```tsx
import { cn } from "@/lib/utils"

// Merge classes conditionally
<div className={cn(
  "base-class",
  condition && "conditional-class",
  "another-class"
)} />
```

### Date Formatting
```tsx
// Time left calculation
const getTimeLeft = (endsAt: string) => {
  const timeLeft = new Date(endsAt).getTime() - Date.now()
  if (timeLeft <= 0) return "Ended"
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}
```

---

## 🎬 Animation Examples

### Hover Scale
```tsx
<div className="transition-transform hover:scale-105 duration-300">
  Content
</div>
```

### Fade In
```tsx
<div className="animate-in fade-in duration-500">
  Content
</div>
```

### Slide Up
```tsx
<div className="animate-in slide-in-from-bottom duration-500">
  Content
</div>
```

### Stagger Children
```tsx
<div className="space-y-4">
  {items.map((item, i) => (
    <div 
      key={item.id}
      className="animate-in fade-in slide-in-from-left"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {item.content}
    </div>
  ))}
</div>
```

---

## 📱 Responsive Design

### Breakpoints
```tsx
// Mobile first
<div className="
  text-sm          // mobile
  md:text-base     // tablet (768px+)
  lg:text-lg       // desktop (1024px+)
  xl:text-xl       // large (1280px+)
">
```

### Grid Layouts
```tsx
<div className="
  grid 
  grid-cols-1      // mobile: 1 column
  md:grid-cols-2   // tablet: 2 columns
  lg:grid-cols-3   // desktop: 3 columns
  gap-4
">
```

---

## 🎯 Common Patterns

### Card with Hover Effect
```tsx
<Card className="
  border-2 border-amber-100
  transition-all duration-300
  hover:shadow-lg hover:-translate-y-1
  cursor-pointer
">
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Button with Loading State
```tsx
<Button 
  disabled={loading}
  className="bg-amber-400 hover:bg-amber-500"
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Badge with Status
```tsx
<Badge className={cn(
  "font-semibold",
  status === 'winning' && "bg-green-500",
  status === 'outbid' && "bg-gray-400"
)}>
  {status === 'winning' ? (
    <>
      <TrendingUp className="mr-1 h-3 w-3" />
      Winning
    </>
  ) : (
    'Outbid'
  )}
</Badge>
```

---

## 🔥 Pro Tips

1. **Use `cn()` for conditional classes** - Cleaner than template literals
2. **Animate with transform/opacity** - Better performance than width/height
3. **Add loading states** - Better UX during async operations
4. **Use semantic colors** - amber for primary, green for success, red for danger
5. **Group related items** - Use Card or borders to create visual sections
6. **Add micro-interactions** - Small hover effects make big difference
7. **Test on mobile** - Most users will be on mobile devices
8. **Keep it simple** - Don't over-animate or over-design

---

Happy designing! 🎨
