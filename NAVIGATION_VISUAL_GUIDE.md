# 📱 Guide Visuel - Navigation GRID 78 v2.0

Guide visuel des différentes variantes de navigation et leur utilisation.

---

## 🖥️ Desktop - Sidebar Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ╔═══════════════╗  ┌─────────────────────────────────────┐ │
│  ║               ║  │                                       │ │
│  ║  ┌─────┐     ║  │                                       │ │
│  ║  │ G78 │     ║  │        MAIN CONTENT AREA              │ │
│  ║  └─────┘     ║  │                                       │ │
│  ║  GRID 78     ║  │                                       │ │
│  ║  🚁 Drone    ║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║──────────────║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║ ┌──────────┐ ║  │                                       │ │
│  ║ │●[Active] │─╢  │                                       │ │
│  ║ │  Dashboard│ ║  │                                       │ │
│  ║ └──────────┘ ║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║ ┌──────────┐ ║  │                                       │ │
│  ║ │  Profil  │ ║  │                                       │ │
│  ║ └──────────┘ ║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║ ┌──────────┐ ║  │                                       │ │
│  ║ │ Planning │ ║  │                                       │ │
│  ║ └──────────┘ ║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║     ...      ║  │                                       │ │
│  ║              ║  │                                       │ │
│  ║──────────────║  └─────────────────────────────────────┘ │
│  ║ ┌──────────┐ ║                                           │
│  ║ │  👤 User │ ║          Footer                           │
│  ║ │  Email   │ ║                                           │
│  ║ │[Badge]   │ ║                                           │
│  ║ └──────────┘ ║                                           │
│  ╚═══════════════╝                                           │
│     288px (w-72)                                             │
└─────────────────────────────────────────────────────────────┘
```

**Caractéristiques :**
- ✅ Largeur fixe : 288px
- ✅ Background avec blur : glassmorphism
- ✅ Logo animé avec indicateur "en ligne"
- ✅ Items avec gradient cyan sur actif
- ✅ Indicateur blanc vertical à gauche
- ✅ Section utilisateur en bas
- ✅ Scrollbar customisée

---

## 📱 Mobile - Header + Bottom Bar

```
┌─────────────────────────────────┐
│ ☰  ┌───┐ GRID 78        👤  🔽 │ ← Header (sticky)
│    │G78│                        │
│    └───┘                        │
├─────────────────────────────────┤
│                                 │
│                                 │
│                                 │
│        MAIN CONTENT             │
│           AREA                  │
│                                 │
│        (Scrollable)             │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
├═════════════════════════════════┤
│ ──                              │ ← Indicateur actif
│ ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌──│ ← Bottom Bar (fixed)
│ │ ● │  │   │  │   │  │   │  │  │
│ │ 🏠│  │ 👤│  │ 📅│  │ ✈️│  │ 📚│
│ └───┘  └───┘  └───┘  └───┘  └──│
│ Dash   Prof  Plan  Miss  Form  │
└─────────────────────────────────┘
```

**Caractéristiques Bottom Bar :**
- ✅ Position : fixed bottom
- ✅ 5 items principaux maximum
- ✅ Icônes circulaires 44px minimum
- ✅ Gradient cyan sur item actif
- ✅ Indicateur en haut de l'item actif
- ✅ Labels cachés sur très petits écrans
- ✅ Badges en coin supérieur droit
- ✅ Animation pulse sur actif
- ✅ Support safe-area (encoches iPhone)

---

## 📱 Mobile - Drawer Sidebar

```
   Overlay (dark)
┌─────────────────────────────────┐
│████████████████████│            │
│████████████████████│            │
│████ Drawer Menu ███│  Tap to    │
│████████████████████│   close    │
│████ ┌───┐ ████████│            │
│████ │G78│ GRID 78 │            │
│████ └───┘ 🚁 Drone │            │
│████████████████████│            │
│████ ╔══════════╗ ██│            │
│████ ║  👤 User ║ ██│            │
│████ ║   Email  ║ ██│            │
│████ ║  [Badge] ║ ██│            │
│████ ╚══════════╝ ██│            │
│████───────────────█│            │
│████ ┌──────────┐ ██│            │
│████ │●[Active] │ ██│            │
│████ │Dashboard │ ██│            │
│████ └──────────┘ ██│            │
│████              ██│            │
│████ ┌──────────┐ ██│            │
│████ │  Profil  │ ██│            │
│████ └──────────┘ ██│            │
│████              ██│            │
│████    ...       ██│            │
│████████████████████│            │
│████████████████████│            │
└─────────────────────────────────┘
  85vw (max 384px)
```

**Caractéristiques Drawer :**
- ✅ Largeur : 85vw max 384px
- ✅ User card avec gradient en haut
- ✅ Navigation complète (tous les items)
- ✅ Fermeture auto après navigation
- ✅ Overlay semi-transparent
- ✅ Animation slide-in depuis la gauche

---

## 🎨 États Visuels des Items

### Desktop - Item Actif

```
┌──────────────────────────────────┐
│█                                 │ ← Indicateur blanc
│█  ┌───────────────────────────┐ │
│█  │ ╔═══╗  Dashboard       ► │ │ ← Gradient cyan
│█  │ ║ 🏠║                     │ │
│█  │ ╚═══╝                  [3]│ │ ← Badge (optionnel)
│█  └───────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

**Styles appliqués :**
- Background : `gradient cyan-500 → cyan-600`
- Ombre : `shadow-lg shadow-cyan-500/30`
- Texte : `white`
- Icône : `white + scale-110` + fond `white/20`
- Chevron : `visible, white`

---

### Desktop - Item Inactif (Hover)

```
┌──────────────────────────────────┐
│                                  │
│   ┌───────────────────────────┐ │
│   │ ╔═══╗  Profil          ► │ │ ← Fond cyan-50
│   │ ║ 👤║                     │ │ ← Texte cyan-700
│   │ ╚═══╝                     │ │ ← Scale 1.02x
│   └───────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

**Styles hover :**
- Background : `cyan-50`
- Texte : `cyan-700`
- Icône : `cyan-600 + scale-110` + fond `cyan-100`
- Chevron : `opacity 0 → 100`, slide in
- Scale : `1.02x`
- Effet brillance : gradient subtil

---

### Mobile Bottom Bar - Item Actif

```
     ──────
    ┌──────┐  ← Indicateur cyan en haut
    │      │
    │ ┌──┐ │
    │ │🏠│ │  ← Icône avec gradient
    │ └──┘ │
    │ Dash │  ← Label (si espace)
    └──────┘
```

**Styles appliqués :**
- Icône : gradient cyan circulaire + shadow
- Scale : `110%`
- Animation : `pulse`
- Indicateur : barre cyan 1px en haut
- Texte : `cyan-600`

---

### Mobile Bottom Bar - Item Inactif

```
    ┌──────┐
    │      │
    │ ┌──┐ │
    │ │👤│ │  ← Icône grise
    │ └──┘ │
    │ Prof │
    └──────┘
```

**Styles appliqués :**
- Icône : `navy-400` ou `gray-500`
- Fond : transparent
- Hover : fond `cyan-50`

---

## 🎯 Zones Touch & Click

### Desktop

```
Item Height: 44px minimum (py-2.5)
┌─────────────────────────────────┐
│  ← Clickable area →             │
│  Icon [16px] + Text + Chevron   │
│  ← Hover effects apply here →  │
└─────────────────────────────────┘
```

### Mobile Bottom Bar

```
Item: 44x44px minimum (touch target)
     [44px]
  ┌────────┐ ←
  │        │ 44px
  │  Icon  │
  │        │
  └────────┘ ←
  [Label] (8px)
```

---

## 🔄 Flow de Navigation

### Desktop

```
1. User hovers item
   ├─> Scale 1.02x
   ├─> Background cyan-50
   ├─> Icon scale 110%
   └─> Chevron appears

2. User clicks
   ├─> Scale 0.98x (active state)
   ├─> Navigate to page
   └─> Item becomes active

3. Active state
   ├─> Gradient background
   ├─> White text/icon
   ├─> Indicator bar
   └─> Shadow effect
```

### Mobile Bottom Bar

```
1. User taps item
   ├─> Scale 95% (active state)
   └─> Navigate to page

2. Active state
   ├─> Gradient background
   ├─> Scale 110%
   ├─> Top indicator
   ├─> Pulse animation
   └─> Cyan text color
```

---

## 📐 Spacing et Dimensions

### Desktop Sidebar

```
Width: 288px (72 * 4px)
Logo Height: 80px (20 * 4px)
Item Height: 40-44px
Item Padding: 12-16px horizontal, 10px vertical
Gap between items: 6px (space-y-1.5)
User section height: ~160px
```

### Mobile Bottom Bar

```
Height: 64px + safe-area-inset-bottom
Item Width: flex-1 with max-w-[80px]
Icon Size: 44x44px (touch target)
Gap between items: justify-around
Label Height: 16px (text-[10px])
Indicator Height: 4px (h-1)
```

### Mobile Header

```
Height: 64px (h-16)
Logo Size: 36x36px (h-9 w-9)
Avatar Size: 32x32px (h-8 w-8)
```

---

## 🎨 Color Mapping Visual

### Active State Gradient

```
from-grid-cyan-500  to-grid-cyan-600
   #00A7E1    ──────►   #0086b4
   
   ┌──────────────────────────────┐
   │███████████████████████████████│
   │█████████████ Active █████████│
   │███████████████████████████████│
   └──────────────────────────────┘
```

### Hover State

```
bg-grid-cyan-50
   #e6f7fc (très clair)
   
   ┌──────────────────────────────┐
   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
   │░░░░░░░░░░ Hover ░░░░░░░░░░░░░│
   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
   └──────────────────────────────┘
```

### Badge Orange

```
bg-grid-orange-500
   #F47920
   
    ┌───┐
    │ 3 │ ← Badge
    └───┘
```

---

## 📱 Responsive Behavior

### < 768px (Mobile)

```
✅ Bottom bar visible
✅ Sidebar hidden
✅ Header visible
✅ Drawer accessible via burger
✅ Content padding-bottom: 80px
✅ Footer margin-bottom: 64px
```

### ≥ 768px (Desktop)

```
✅ Sidebar visible (fixed)
✅ Bottom bar hidden (md:hidden)
✅ Header hidden
✅ Content margin-left: 288px
✅ No padding-bottom
✅ Footer margin-left: 288px
```

---

## 🌓 Dark Mode Comparison

### Light Mode

```
┌─────────────────────────────────┐
│ ░░░  GRID 78           ☀️       │ White bg
│─────────────────────────────────│
│ ░░░ ●  Dashboard               │ Cyan active
│ ░░░    Profil                  │ Navy text
│ ░░░    Planning                │
└─────────────────────────────────┘
```

### Dark Mode

```
┌─────────────────────────────────┐
│ ▓▓▓  GRID 78           🌙       │ Navy-800 bg
│─────────────────────────────────│
│ ▓▓▓ ●  Dashboard               │ Cyan active
│ ▓▓▓    Profil                  │ White text
│ ▓▓▓    Planning                │
└─────────────────────────────────┘
```

---

## 🎬 Animation Timeline

### Hover Animation (200ms)

```
0ms    50ms   100ms  150ms  200ms
│      │      │      │      │
├──────┼──────┼──────┼──────┤
│ Scale 1.0 → 1.01 → 1.02   │
│ BG opacity 0 → 50 → 100   │
│ Icon scale 1.0 → 1.05 →1.1│
│ Chevron -8px → -4px → 0px │
│ Chevron opacity 0 → 50→100│
└───────────────────────────┘
```

### Click Animation (200ms)

```
0ms    100ms  200ms
│      │      │
├──────┼──────┤
│ Scale 1.02 → 0.98 → 1.0   │
│ Navigate ──►               │
└───────────────────────────┘
```

---

## 🔢 Component Variants Summary

### Navigation Component

```tsx
// Usage 1: Desktop sidebar
<Navigation 
  userRole="pilot"
/>

// Usage 2: Desktop sidebar with callback
<Navigation 
  userRole="chief"
  onNavigate={() => console.log('navigated')}
/>
```

### MobileNavigation Component

```tsx
// Usage 1: Bottom bar (default for mobile)
<MobileNavigation 
  userRole="pilot"
  variant="bottom"
/>

// Usage 2: Drawer sidebar
<MobileNavigation 
  userRole="chief"
  onNavigate={() => setDrawerOpen(false)}
  variant="sidebar"
/>
```

---

## ✅ Checklist d'Intégration

### Desktop
- [ ] Sidebar fixe à gauche
- [ ] Largeur 288px (w-72)
- [ ] Logo avec hover effect
- [ ] Items avec animations
- [ ] Section utilisateur en bas
- [ ] Content avec margin-left: 288px

### Mobile
- [ ] Header sticky avec burger menu
- [ ] Bottom bar fixed en bas
- [ ] 5 items principaux dans bottom bar
- [ ] Drawer accessible via burger
- [ ] Content avec padding-bottom: 80px
- [ ] Safe-area support pour encoches

### Responsive
- [ ] Breakpoint à 768px (md:)
- [ ] Bottom bar cachée sur desktop
- [ ] Sidebar cachée sur mobile
- [ ] Transitions fluides entre breakpoints

### Dark Mode
- [ ] Toutes les couleurs ont variantes dark:
- [ ] Backgrounds adaptés
- [ ] Borders visibles
- [ ] Contrastes respectés

---

## 🎉 Quick Start

1. **Importer le Layout**
```tsx
import { MainLayout } from '@/components/layout/MainLayout'
```

2. **Envelopper votre contenu**
```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```

3. **C'est tout !** 🚀
   - Navigation desktop ✅
   - Navigation mobile ✅
   - Bottom bar ✅
   - Dark mode ✅

---

## 📚 Liens Utiles

- 📖 **Guide complet** : `NAVIGATION_GUIDE.md`
- 📋 **Résumé v2.0** : `NAVIGATION_V2_COMPLETE.md`
- 🎨 **Couleurs** : `COLORS_GRID78.md`
- 📂 **Code source** : `src/components/layout/Navigation.tsx`

---

**Version :** 2.0.0  
**Status :** ✅ Production Ready  
**Dernière mise à jour :** 14 janvier 2025
