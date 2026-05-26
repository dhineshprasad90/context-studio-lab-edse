# Context Studio Lab Homepage - Content & Implementation Plan

## Overview
This document provides the complete plan to recreate the Context Studio Lab homepage as shown in the screenshot. It includes:
1. Content in table format (for AEM authoring)
2. Block implementations (CSS + JS)
3. Navigation structure

---

## 1. Navigation Content (for /nav fragment)

### Table Format for Authors:
```
| Context Studio Lab | Home | Features | Architecture | Demo | Documentation |
```

**Explanation**: First cell is the brand/logo, remaining cells are navigation links.

---

## 2. Homepage Content Structure

### Section 1: Hero Banner

**Block Name**: `hero-banner`

**Table Format for Authors**:
```
| Hero Banner |
|-------------|
| Context Studio Lab |
| Advanced EDS Development Platform with Live Editing, Autonomous Block Generation, and Intelligent Orchestration |
```

**What it creates**:
- Large centered heading with gradient text
- Subtitle/description text
- Light background

---

### Section 2: Stats/Metrics

**Block Name**: `stats-metrics`

**Table Format for Authors**:
```
| Stats Metrics |
|---------------|
| <500ms | BUILD TIME |
| 85%+ | AUTONOMOUS |
| <1s | HMR LATENCY |
```

**What it creates**:
- Three columns with large numbers
- Labels below each number
- Centered layout
- Purple/blue gradient styling

---

### Section 3: Call-to-Action Buttons

**Block Name**: `cta-buttons`

**Table Format for Authors**:
```
| CTA Buttons |
|-------------|
| **Explore Features** | https://example.com/features |
| *View Documentation* | https://example.com/docs |
| Scroll to explore |
```

**What it creates**:
- Two buttons side by side
- Primary button (solid background) - uses **bold** formatting
- Secondary button (outline) - uses *italic* formatting
- "Scroll to explore" text below

---

## 3. Complete Homepage Content (Copy-Paste Ready)

### For Google Docs / Word / SharePoint:

Create a document with this structure:

```
Context Studio Lab
Advanced EDS Development Platform with Live Editing, Autonomous Block Generation, and Intelligent Orchestration

---

| Stats Metrics |
|---------------|
| <500ms | BUILD TIME |
| 85%+ | AUTONOMOUS |
| <1s | HMR LATENCY |

---

| CTA Buttons |
|-------------|
| **Explore Features** | https://example.com/features |
| *View Documentation* | https://example.com/docs |
| Scroll to explore |
```

---

## 4. Block Implementations

### Block 1: Hero Banner (`/blocks/hero-banner/`)

#### hero-banner.js
```javascript
export default function decorate(block) {
  const rows = [...block.children];
  
  // First row is the main heading
  if (rows[0]) {
    const heading = rows[0].querySelector('div');
    heading.classList.add('hero-banner-title');
  }
  
  // Second row is the description
  if (rows[1]) {
    const description = rows[1].querySelector('div');
    description.classList.add('hero-banner-description');
  }
}
```

#### hero-banner.css
```css
.hero-banner-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  padding: 80px 0 60px;
}

.hero-banner {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-banner-title {
  font-size: 72px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-banner-description {
  font-size: 24px;
  line-height: 1.6;
  color: #4a5568;
  max-width: 900px;
  margin: 0 auto;
}

@media (width < 900px) {
  .hero-banner-title {
    font-size: 48px;
  }
  
  .hero-banner-description {
    font-size: 18px;
  }
}

@media (width < 600px) {
  .hero-banner-title {
    font-size: 36px;
  }
  
  .hero-banner-description {
    font-size: 16px;
  }
}
```

---

### Block 2: Stats Metrics (`/blocks/stats-metrics/`)

#### stats-metrics.js
```javascript
export default function decorate(block) {
  const stats = document.createElement('div');
  stats.classList.add('stats-container');
  
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const statItem = document.createElement('div');
      statItem.classList.add('stat-item');
      
      const value = document.createElement('div');
      value.classList.add('stat-value');
      value.textContent = cells[0].textContent.trim();
      
      const label = document.createElement('div');
      label.classList.add('stat-label');
      label.textContent = cells[1].textContent.trim();
      
      statItem.append(value, label);
      stats.append(statItem);
    }
  });
  
  block.textContent = '';
  block.append(stats);
}
```

#### stats-metrics.css
```css
.stats-metrics {
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-metrics .stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  text-align: center;
}

.stats-metrics .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.stats-metrics .stat-value {
  font-size: 56px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stats-metrics .stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (width < 900px) {
  .stats-metrics .stat-value {
    font-size: 48px;
  }
}

@media (width < 600px) {
  .stats-metrics .stats-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .stats-metrics .stat-value {
    font-size: 40px;
  }
}
```

---

### Block 3: CTA Buttons (`/blocks/cta-buttons/`)

#### cta-buttons.js
```javascript
export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('cta-container');
  
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('buttons-wrapper');
  
  const rows = [...block.children];
  
  // Process button rows (first two rows)
  rows.slice(0, 2).forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const link = cells[1].querySelector('a');
      if (link) {
        // Button already created by decorateButtons in scripts.js
        const buttonWrapper = link.closest('.button-wrapper');
        if (buttonWrapper) {
          buttonsWrapper.append(buttonWrapper);
        }
      }
    }
  });
  
  container.append(buttonsWrapper);
  
  // Process scroll text (third row)
  if (rows[2]) {
    const scrollText = document.createElement('div');
    scrollText.classList.add('scroll-text');
    scrollText.textContent = rows[2].textContent.trim();
    container.append(scrollText);
  }
  
  block.textContent = '';
  block.append(container);
}
```

#### cta-buttons.css
```css
.cta-buttons {
  padding: 40px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.cta-buttons .cta-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.cta-buttons .buttons-wrapper {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-buttons .button-wrapper {
  margin: 0;
}

.cta-buttons a.button {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  min-width: 200px;
  text-align: center;
}

.cta-buttons a.button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-buttons a.button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  text-decoration: none;
}

.cta-buttons a.button.secondary {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  transition: background-color 0.2s, color 0.2s;
}

.cta-buttons a.button.secondary:hover {
  background-color: #667eea;
  color: white;
  text-decoration: none;
}

.cta-buttons .scroll-text {
  font-size: 14px;
  color: #a0aec0;
  margin-top: 16px;
}

@media (width < 600px) {
  .cta-buttons .buttons-wrapper {
    flex-direction: column;
    width: 100%;
  }
  
  .cta-buttons a.button {
    width: 100%;
  }
}
```

---

## 5. Navigation Structure

### Create /nav fragment

**Table Format**:
```
| Context Studio Lab | Home | Features | Architecture | Demo | Documentation |
```

This creates a horizontal navigation with:
- Brand/logo on the left
- Navigation links on the right

---

## 6. Implementation Steps

### Step 1: Create Block Directories
```bash
mkdir -p blocks/hero-banner
mkdir -p blocks/stats-metrics
mkdir -p blocks/cta-buttons
```

### Step 2: Create Block Files
- Create `hero-banner.js` and `hero-banner.css` in `/blocks/hero-banner/`
- Create `stats-metrics.js` and `stats-metrics.css` in `/blocks/stats-metrics/`
- Create `cta-buttons.js` and `cta-buttons.css` in `/blocks/cta-buttons/`

### Step 3: Create Content in AEM
1. Create a new document (Google Docs/Word/SharePoint)
2. Add the content structure as shown in Section 3
3. Save and preview in AEM

### Step 4: Test Locally
```bash
aem up
```
Navigate to `http://localhost:3000` to see the result

---

## 7. Content Authoring Guide for Non-Technical Users

### How to Create the Homepage:

1. **Open your authoring tool** (Google Docs, Word, or SharePoint)

2. **Add the hero section**:
   - Type the main heading: "Context Studio Lab"
   - Press Enter
   - Type the description text
   - Press Enter twice to create a new section

3. **Add the stats table**:
   - Insert a table with 2 columns and 4 rows
   - First row: Type "Stats Metrics" in first cell, leave second empty
   - Remaining rows: First column = metric value, Second column = label
   - Example:
     ```
     | Stats Metrics |           |
     | <500ms        | BUILD TIME |
     | 85%+          | AUTONOMOUS |
     | <1s           | HMR LATENCY |
     ```

4. **Add the buttons table**:
   - Insert a table with 2 columns and 3 rows
   - First row: Type "CTA Buttons" in first cell
   - Second row: Make text bold (**Explore Features**), add link in second cell
   - Third row: Make text italic (*View Documentation*), add link in second cell
   - Fourth row: Type "Scroll to explore" in first cell

5. **Save and preview** in AEM

---

## 8. Color Palette

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Background */
--bg-light: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);

/* Text Colors */
--text-dark: #2d3748;
--text-medium: #4a5568;
--text-light: #718096;
--text-lighter: #a0aec0;

/* Accent */
--accent-blue: #667eea;
--accent-purple: #764ba2;
```

---

## 9. Typography Scale

```css
/* Headings */
--hero-title: 72px (desktop), 48px (tablet), 36px (mobile)
--hero-description: 24px (desktop), 18px (tablet), 16px (mobile)

/* Stats */
--stat-value: 56px (desktop), 48px (tablet), 40px (mobile)
--stat-label: 14px (all sizes)

/* Buttons */
--button-text: 18px
```

---

## 10. Spacing System

```css
/* Vertical Spacing */
--section-padding: 80px (desktop), 60px (tablet), 40px (mobile)
--element-gap: 48px (large), 32px (medium), 24px (small), 16px (xsmall)

/* Horizontal Spacing */
--container-padding: 32px (desktop), 24px (mobile)
--max-width: 1200px
```

---

## Summary

This plan provides everything needed to recreate the Context Studio Lab homepage:

✅ **Content in table format** - Easy for authors to create
✅ **Three custom blocks** - hero-banner, stats-metrics, cta-buttons
✅ **Complete CSS styling** - Gradient text, responsive layout, hover effects
✅ **JavaScript decoration** - Transforms tables into styled components
✅ **Responsive design** - Mobile, tablet, and desktop breakpoints
✅ **Authoring guide** - Step-by-step instructions for content creators

The design uses modern CSS features (gradients, grid, flexbox) and follows AEM Edge Delivery Services best practices.