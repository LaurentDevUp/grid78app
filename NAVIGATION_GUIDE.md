# 🧭 Guide Navigation GRID 78

Documentation du système de navigation moderne et responsive.

## 📱 Vue d'ensemble

Le système de navigation a été entièrement repensé avec :
- ✨ **Design moderne** avec animations fluides
- 📱 **100% Responsive** (mobile, tablette, desktop)
- 🎨 **Thème GRID 78** respecté
- 🌓 **Support Dark Mode**
- ♿ **Accessible** et intuitif

---

## 🖥️ Navigation Desktop/Sidebar

### Fonctionnalités

**Design amélioré :**
- Gradient cyan sur l'item actif avec ombre portée
- Animations de scale au hover (1.02x) et au clic (0.98x)
- Icônes avec fond coloré et animation scale
- Indicateur blanc sur le côté gauche pour l'item actif
- Chevron animé qui apparaît au hover
- Effet de brillance au survol

**Responsive :**
```tsx
<Navigation userRole={userRole} onNavigate={onNavigate} />
```

**Classes responsive :**
- `px-2 md:px-3` - Padding horizontal adaptatif
- `py-3 md:py-2.5` - Padding vertical adaptatif
- Support du dark mode avec `dark:` prefixes

---

## 📱 Navigation Mobile

### Deux variantes disponibles

#### 1. **Sidebar Mobile** (Menu drawer)
Navigation complète dans un menu latéral

```tsx
<MobileNavigation 
  userRole={userRole} 
  onNavigate={onNavigate}
  variant="sidebar" // par défaut
/>
```

#### 2. **Bottom Bar** (Barre de navigation inférieure)
Navigation compacte en bas de l'écran - Style iOS/Android moderne

```tsx
<MobileNavigation 
  userRole={userRole} 
  onNavigate={onNavigate}
  variant="bottom"
/>
```

### Bottom Bar - Caractéristiques

**Design :**
- Fixed en bas de l'écran (`fixed bottom-0`)
- Bordure supérieure cyan avec ombre
- Icônes circulaires avec gradient pour l'item actif
- Indicateur en haut de l'item actif
- Labels masqués sur très petits écrans (`hidden xs:block`)
- Badges positionnés en coin supérieur droit
- Animation pulse sur l'item actif
- Support `safe-bottom` pour les encoches iPhone

**Limitations :**
- Affiche maximum 5 items principaux
- Caché sur desktop (`md:hidden`)
- Labels réduits (10px)

---

## 🎨 Éléments Visuels

### États des Items

#### **Item Actif (Sélectionné)**
```
Desktop:
- Background: gradient cyan (500 → 600)
- Texte: blanc
- Icône: blanc avec scale 110%
- Ombre: cyan/30 shadow-lg
- Indicateur: barre blanche à gauche

Mobile Bottom:
- Background: gradient cyan circulaire
- Indicateur: barre cyan en haut
- Scale: 110%
```

#### **Item Inactif**
```
Desktop:
- Texte: navy-600
- Hover: background cyan-50, scale 1.02x
- Icône: navy-500 → cyan-600 au hover
- Chevron: apparaît au hover

Mobile Bottom:
- Texte: navy-400
- Hover: background cyan-50
```

### Animations

```css
/* Transitions fluides */
transition-all duration-200

/* Scale effects */
hover:scale-[1.02]
active:scale-[0.98]
active:scale-95 (mobile)

/* Translations */
group-hover:translate-x-0.5 (texte)
group-hover:translate-x-0 (chevron)

/* Opacité */
opacity-0 → opacity-100 (chevron, effet brillance)

/* Pulse */
animate-pulse (item actif mobile)
```

---

## 🎯 Utilisation dans les Layouts

### Layout Desktop avec Sidebar

```tsx
// src/app/dashboard/layout.tsx
import { Navigation } from '@/components/layout/Navigation'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-grid-navy-800">
        <div className="p-4">
          <h1>GRID 78</h1>
        </div>
        <Navigation userRole={user.role} />
      </aside>
      
      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

### Layout Mobile avec Bottom Bar

```tsx
// src/app/layout.tsx (racine)
import { MobileNavigation } from '@/components/layout/Navigation'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Contenu principal avec padding bottom pour la bar */}
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        
        {/* Bottom bar mobile uniquement */}
        <MobileNavigation 
          userRole={user.role}
          variant="bottom"
        />
      </body>
    </html>
  )
}
```

### Layout Hybride (Recommandé)

```tsx
export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Desktop: Sidebar permanente */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-grid-navy-800 border-r">
        <Navigation userRole={user.role} />
      </aside>

      {/* Mobile: Drawer sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-grid-navy-800">
            <MobileNavigation 
              userRole={user.role} 
              onNavigate={() => setIsSidebarOpen(false)}
              variant="sidebar"
            />
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <main className="md:ml-64 pb-20 md:pb-0">
        {/* Header mobile avec burger */}
        <header className="md:hidden p-4 border-b">
          <button onClick={() => setIsSidebarOpen(true)}>
            Menu
          </button>
        </header>
        
        {children}
      </main>

      {/* Bottom bar mobile uniquement */}
      <MobileNavigation 
        userRole={user.role}
        variant="bottom"
      />
    </div>
  )
}
```

---

## 🔧 Configuration

### Items de Navigation

Modifier `navigationItems` dans `Navigation.tsx` :

```tsx
export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',      // Titre affiché
    href: '/dashboard',      // URL
    icon: LayoutDashboard,   // Composant Lucide
    requiredRole: 'chief',   // Optionnel: restreindre par rôle
    badge: '3',              // Optionnel: badge notification
  },
  // ... autres items
]
```

### Personnalisation des Couleurs

Les couleurs utilisent la palette GRID 78 définie dans `tailwind.config.ts` :

```tsx
// Gradient actif
from-grid-cyan-500 to-grid-cyan-600

// Hover inactif
hover:bg-grid-cyan-50
hover:text-grid-cyan-700

// Badge
bg-grid-orange-500

// Texte
text-grid-navy-600
```

---

## 📐 Breakpoints Responsive

```css
/* Mobile first */
default: < 768px (mobile)
md:     ≥ 768px (tablette/desktop)
xs:     custom breakpoint pour labels bottom bar

/* Exemples */
md:hidden     → Caché sur desktop
md:block      → Visible sur desktop uniquement
md:px-4       → Padding différent sur desktop
```

---

## ♿ Accessibilité

**Bonnes pratiques implémentées :**
- ✅ Navigation sémantique avec `<nav>`
- ✅ Liens avec `<Link>` Next.js
- ✅ Contrastes WCAG AA respectés
- ✅ États focus visibles
- ✅ Touch targets ≥ 44px (mobile)
- ✅ Transitions réduites si préférence utilisateur
- ✅ Support clavier complet

**À ajouter (optionnel) :**
```tsx
// ARIA labels
<nav aria-label="Navigation principale">

// État actif
<Link aria-current={isActive ? 'page' : undefined}>

// Badge count
<span aria-label={`${item.badge} notifications`}>
```

---

## 🎯 Bonnes Pratiques

### Performance

```tsx
// ✅ Bon: Transition ciblée
transition-all duration-200

// ❌ Éviter: Trop de nested animations
// Préférer des animations simples et fluides
```

### Responsive

```tsx
// ✅ Bon: Mobile first
className="px-2 md:px-4"

// ❌ Éviter: Desktop first
className="md:px-2 px-4"
```

### Dark Mode

```tsx
// ✅ Bon: Toujours prévoir le dark mode
className="bg-white dark:bg-grid-navy-800"

// ⚠️ Vérifier les contrastes
text-grid-navy-600 dark:text-gray-300
```

---

## 🚀 Améliorations Futures

### Possibles Extensions

1. **Collapse/Expand** - Sidebar rétractable
```tsx
const [collapsed, setCollapsed] = useState(false)
// Masquer les labels, garder uniquement les icônes
```

2. **Groupes de Navigation** - Sections thématiques
```tsx
interface NavGroup {
  title: string
  items: NavItem[]
}
```

3. **Recherche rapide** - Cmd+K menu
```tsx
// Palette de commandes avec items de navigation
<CommandPalette items={navigationItems} />
```

4. **Notifications en temps réel** - Badges dynamiques
```tsx
// WebSocket ou polling pour mettre à jour les badges
badge: notifications.count
```

5. **Drag & Drop** - Réorganiser les favoris
```tsx
// Permettre à l'utilisateur de personnaliser l'ordre
```

---

## 📝 Changelog

### Version 2.0 (Actuelle)
- ✨ Design moderne avec gradients et animations
- 📱 Support mobile avec bottom bar
- 🎨 Respect de la charte GRID 78
- 🌓 Dark mode intégré
- ♿ Accessibilité améliorée
- 📐 Responsive complet

### Version 1.0 (Ancienne)
- Navigation basique avec bordure gauche
- Pas de support mobile dédié
- Animations limitées

---

## 🆘 Troubleshooting

### Bottom bar se chevauche avec le contenu

```tsx
// Solution: Ajouter padding-bottom sur le contenu
<main className="pb-20 md:pb-0">
  {children}
</main>
```

### Animations saccadées

```tsx
// Vérifier les transitions CSS
// S'assurer que will-change n'est pas surutilisé
// Utiliser transform au lieu de margin/padding pour animer
```

### Dark mode ne fonctionne pas

```tsx
// Vérifier next-themes configuration
// S'assurer que la classe 'dark' est sur <html>
```

### Items ne s'affichent pas sur mobile

```tsx
// Vérifier le filtrage par rôle
// S'assurer que variant="bottom" est utilisé
// Vérifier les breakpoints md:hidden
```

---

## 📚 Ressources

- [Lucide Icons](https://lucide.dev) - Icônes utilisées
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Framer Motion](https://framer.com/motion) - Pour animations avancées (optionnel)
- [Next.js Navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)

---

**Dernière mise à jour** : Design amélioré avec support mobile complet
