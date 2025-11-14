# 🎨 Guide des Couleurs GRID78

Palette de couleurs officielle basée sur le logo GRID 78 - Groupe Renseignement et Intervention Drone.

## 🌈 Palette Principale

### Bleu Cyan (Montagnes supérieures)
**HEX:** `#00A7E1`

```tsx
// TailwindCSS
className="bg-grid-cyan-500"
className="text-grid-cyan-600"
className="border-grid-cyan-500"

// Nuances disponibles
grid-cyan-50  → #e6f7fc (très clair)
grid-cyan-100 → #cceff9
grid-cyan-200 → #99dff3
grid-cyan-300 → #66cfed
grid-cyan-400 → #33bfe7
grid-cyan-500 → #00A7E1 ⭐ Principal
grid-cyan-600 → #0086b4
grid-cyan-700 → #006587
grid-cyan-800 → #00445a
grid-cyan-900 → #00232d (très foncé)
```

**Usage:** Éléments interactifs, liens, accents positifs, icônes d'action

---

### Orange (Section médiane)
**HEX:** `#F47920`

```tsx
// TailwindCSS
className="bg-grid-orange-500"
className="text-grid-orange-600"
className="border-grid-orange-500"

// Nuances disponibles
grid-orange-50  → #fef3ec
grid-orange-100 → #fde7d9
grid-orange-200 → #fbcfb3
grid-orange-300 → #f9b78d
grid-orange-400 → #f79f67
grid-orange-500 → #F47920 ⭐ Principal
grid-orange-600 → #c3611a
grid-orange-700 → #924913
grid-orange-800 → #62300d
grid-orange-900 → #311806
```

**Usage:** Boutons secondaires, badges, alertes d'avertissement, highlights

---

### Rouge (Section inférieure)
**HEX:** `#E31E24`

```tsx
// TailwindCSS
className="bg-grid-red-500"
className="text-grid-red-600"
className="border-grid-red-500"

// Nuances disponibles
grid-red-50  → #fce9ea
grid-red-100 → #f9d3d5
grid-red-200 → #f3a7ab
grid-red-300 → #ed7b81
grid-red-400 → #e74f57
grid-red-500 → #E31E24 ⭐ Principal
grid-red-600 → #b6181d
grid-red-700 → #881216
grid-red-800 → #5a0c0e
grid-red-900 → #2d0607
```

**Usage:** Actions destructives, erreurs, alertes critiques, badges urgents

---

### Bleu Marine (Bordure et texte)
**HEX:** `#002D72`

```tsx
// TailwindCSS
className="bg-grid-navy-500"
className="text-grid-navy-600"
className="border-grid-navy-500"

// Nuances disponibles
grid-navy-50  → #e6eaf2
grid-navy-100 → #ccd5e5
grid-navy-200 → #99abcb
grid-navy-300 → #6681b1
grid-navy-400 → #335797
grid-navy-500 → #002D72 ⭐ Principal
grid-navy-600 → #00245b
grid-navy-700 → #001b44
grid-navy-800 → #00122e
grid-navy-900 → #000917
```

**Usage:** Texte principal, headers, backgrounds sombres, navigation

---

### Violet (Silhouette centrale)
**HEX:** `#7B3F94`

```tsx
// TailwindCSS
className="bg-grid-purple-500"
className="text-grid-purple-600"
className="border-grid-purple-500"

// Nuances disponibles
grid-purple-50  → #f3edf6
grid-purple-100 → #e7dbed
grid-purple-200 → #cfb7db
grid-purple-300 → #b793c9
grid-purple-400 → #9f6fb7
grid-purple-500 → #7B3F94 ⭐ Principal
grid-purple-600 → #623276
grid-purple-700 → #4a2659
grid-purple-800 → #31193b
grid-purple-900 → #190d1e
```

**Usage:** Accents spéciaux, badges premium, éléments de distinction

---

## 🎭 Thèmes

### Light Mode (par défaut)
```css
--primary: Cyan (#00A7E1)
--secondary: Orange (#F47920)
--destructive: Rouge (#E31E24)
--foreground: Navy (#002D72)
--background: Blanc (#FFFFFF)
```

### Dark Mode (.dark)
```css
--primary: Cyan (#00A7E1)
--secondary: Orange (#F47920)
--accent: Violet (#7B3F94)
--destructive: Rouge (#E31E24)
--background: Navy foncé (#001430)
--foreground: Blanc (#FFFFFF)
```

---

## 📐 Exemples d'Utilisation

### Boutons

```tsx
// Bouton principal (Cyan)
<button className="bg-grid-cyan-500 hover:bg-grid-cyan-600 text-white">
  Action Principale
</button>

// Bouton secondaire (Orange)
<button className="bg-grid-orange-500 hover:bg-grid-orange-600 text-white">
  Action Secondaire
</button>

// Bouton danger (Rouge)
<button className="bg-grid-red-500 hover:bg-grid-red-600 text-white">
  Supprimer
</button>

// Bouton outline
<button className="border-2 border-grid-navy-500 text-grid-navy-500 hover:bg-grid-navy-50">
  Annuler
</button>
```

### Cards

```tsx
// Card avec bordure cyan
<div className="border-2 border-grid-cyan-500 bg-white rounded-lg p-6">
  <h3 className="text-grid-cyan-600 font-semibold">Mission</h3>
  <p className="text-grid-navy-500">Détails...</p>
</div>

// Card avec header coloré
<div className="bg-white rounded-lg overflow-hidden shadow-lg">
  <div className="bg-grid-navy-500 text-white p-4">
    <h3 className="font-bold">GRID 78</h3>
  </div>
  <div className="p-6">
    <p className="text-grid-navy-600">Contenu...</p>
  </div>
</div>
```

### Badges

```tsx
// Badge statut disponible
<span className="bg-grid-cyan-100 text-grid-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
  Disponible
</span>

// Badge mission en cours
<span className="bg-grid-orange-100 text-grid-orange-700 px-3 py-1 rounded-full text-sm font-medium">
  En cours
</span>

// Badge urgence
<span className="bg-grid-red-100 text-grid-red-700 px-3 py-1 rounded-full text-sm font-medium">
  Urgent
</span>
```

### Navigation

```tsx
// Navigation principale
<nav className="bg-grid-navy-500 text-white">
  <a href="#" className="hover:bg-grid-cyan-500 px-4 py-2">
    Dashboard
  </a>
</nav>

// Sidebar
<aside className="bg-grid-navy-600 text-white">
  <div className="p-4 bg-grid-cyan-500">
    <h2 className="font-bold">GRID 78</h2>
  </div>
</aside>
```

### Gradients

```tsx
// Gradient multi-couleurs GRID
<div className="bg-gradient-to-r from-grid-cyan-500 via-grid-orange-500 to-grid-red-500">
  Gradient officiel
</div>

// Gradient cyan vers navy
<div className="bg-gradient-to-b from-grid-cyan-50 to-grid-navy-50">
  Background doux
</div>

// Texte gradient
<h1 className="bg-gradient-to-r from-grid-cyan-500 via-grid-orange-500 to-grid-red-500 bg-clip-text text-transparent">
  GRID 78
</h1>
```

---

## 🎯 Recommandations d'Usage

### Hiérarchie Visuelle

1. **Texte principal**: `text-grid-navy-600` ou `text-grid-navy-700`
2. **Texte secondaire**: `text-grid-navy-500` ou `text-gray-600`
3. **Titres**: `text-grid-navy-700` ou `text-grid-cyan-600`
4. **Liens**: `text-grid-cyan-600 hover:text-grid-cyan-700`

### Actions & États

- ✅ **Succès/Disponible**: Cyan (#00A7E1)
- ⚠️ **Avertissement**: Orange (#F47920)
- ❌ **Erreur/Urgent**: Rouge (#E31E24)
- ℹ️ **Info**: Navy (#002D72)
- ⭐ **Premium/Spécial**: Violet (#7B3F94)

### Accessibilité

- **Contrastes minimums respectés** pour WCAG AA
- Ratio texte/fond testé pour chaque couleur
- Mode sombre avec contraste optimisé

---

## 💡 Notes

- Les couleurs sont extraites du logo officiel GRID 78
- Compatible avec shadcn/ui components
- Supporte light et dark mode
- Responsive et mobile-friendly

**Dernière mise à jour**: Setup initial avec couleurs du logo
