# AEM Edge Delivery Services - Codebase Context Understanding

## Project Overview

This is an **Adobe Experience Manager (AEM) Edge Delivery Services** website project built on the AEM Boilerplate foundation. It delivers high-performance, author-friendly web experiences using modern web standards without build steps or transpilation.

### Technology Stack
- **Platform**: AEM Sites as a Cloud Service with Edge Delivery Services
- **JavaScript**: Vanilla ES6+ (no frameworks, no build process)
- **CSS**: Modern CSS3 (Grid, Flexbox, Custom Properties)
- **HTML**: Semantic HTML5 with AEM-specific markup conventions
- **Backend**: `*.aem.live` content delivery system
- **Development**: Node.js tooling with AEM CLI

### Key URLs
- **Local Dev**: `http://localhost:3000` (via `aem up` or `npx @adobe/aem-cli up`)
- **Preview**: `https://main--{repo}--{owner}.aem.page/`
- **Production**: `https://main--{repo}--{owner}.aem.live/`

---

## Architecture & Core Concepts

### 1. Three-Phase Page Loading Strategy

The application uses a progressive loading approach optimized for Core Web Vitals:

**Phase 1: Eager Loading** (`loadEager` in scripts.js)
- Executes immediately for Largest Contentful Paint (LCP)
- Decorates page structure (sections, blocks, buttons, icons)
- Loads only the first section
- Sets document language and theme
- Conditionally loads fonts on desktop or if previously cached

**Phase 2: Lazy Loading** (`loadLazy` in scripts.js)
- Loads after LCP is achieved
- Loads header and footer
- Loads remaining page sections
- Handles URL hash navigation
- Loads lazy styles

**Phase 3: Delayed Loading** (`loadDelayed` in scripts.js)
- Executes 3 seconds after page load
- Loads marketing technology and analytics
- Non-critical functionality that shouldn't impact performance

### 2. Content Structure

**Sections**: Top-level content containers on a page
- Wrapped in `<div class="section">`
- Can contain default content (text, headings, links) and blocks
- Support metadata for styling (e.g., `.section.light`, `.section.highlight`)

**Blocks**: Reusable, self-contained components
- Each block has its own directory: `/blocks/{blockname}/`
- Contains `{blockname}.js` (decoration logic) and `{blockname}.css` (styles)
- Blocks transform initial HTML structure into final rendered output
- Initial structure acts as a "contract" between authors and developers

### 3. Block Decoration Pattern

Every block exports a default `decorate` function:

```javascript
export default async function decorate(block) {
  // 1. Load dependencies (if needed)
  // 2. Extract configuration from DOM
  // 3. Transform DOM structure
  // 4. Add event listeners
}
```

**Key Principles**:
- Blocks are self-contained and reusable
- Must handle gracefully when authors omit or add fields
- Should be responsive and accessible by default
- All selectors scoped to the block to avoid conflicts

### 4. Auto-Blocking

Auto-blocking creates blocks from content patterns without explicit authoring. Implemented in `buildAutoBlocks()` in scripts.js:

**Hero Block Auto-Creation**:
- Detects when an `<h1>` appears before a `<picture>`
- Automatically wraps them in a hero block
- Prepends to the page as the first section

**Fragment Auto-Loading**:
- Detects links to `/fragments/*` paths
- Dynamically imports and replaces with fragment content
- Enables content reuse across pages

---

## File Structure & Responsibilities

### Core Files

**`scripts/aem.js`** (NEVER MODIFY)
- Core AEM library for Edge Delivery
- Provides decoration utilities: `decorateBlocks`, `decorateSections`, `decorateIcons`
- Block loading: `loadBlock`, `loadSection`, `loadSections`
- Header/footer loading: `loadHeader`, `loadFooter`
- Image optimization: `createOptimizedPicture`
- Metadata access: `getMetadata`
- RUM (Real User Monitoring) implementation

**`scripts/scripts.js`** (Main entry point)
- Orchestrates page decoration and loading
- Implements three-phase loading strategy
- Contains auto-blocking logic
- Decorates buttons from formatted links
- Exports `decorateMain()` for main content decoration

**`scripts/delayed.js`**
- Placeholder for delayed functionality
- Loads 3 seconds after page load
- Used for marketing tags, analytics, non-critical features

**`head.html`**
- Global HTML head content
- Content Security Policy (CSP) configuration
- Viewport meta tag
- Script and stylesheet references
- Applied to all pages

**`404.html`**
- Custom 404 error page

### Styling

**`styles/styles.css`** (Critical CSS)
- Minimal global styling for LCP
- CSS custom properties (design tokens)
- Typography system
- Button styles (primary, secondary, accent)
- Section layout
- Mobile-first with responsive breakpoints at 600px, 900px, 1200px

**`styles/lazy-styles.css`**
- Additional global styles loaded post-LCP
- Below-the-fold content styling

**`styles/fonts.css`**
- Web font definitions
- Font-face declarations for Roboto and Roboto Condensed
- Loaded conditionally based on viewport and cache

### Blocks (Current Implementation)

**`blocks/header/`**
- Responsive navigation with hamburger menu
- Loads content from `/nav` fragment
- Desktop dropdown menus
- Mobile slide-out navigation
- Keyboard accessibility (Escape to close, Enter/Space to open)
- Focus management

**`blocks/footer/`**
- Site footer component
- Typically loads from `/footer` fragment

**`blocks/hero/`**
- Hero banner component
- Currently empty (placeholder for implementation)
- Auto-created when h1 precedes picture

**`blocks/cards/`**
- Card grid layout
- Transforms table structure to `<ul>/<li>`
- Optimizes images with `createOptimizedPicture`
- Separates card images and body content

**`blocks/columns/`**
- Multi-column layout component

**`blocks/fragment/`**
- Loads and embeds content fragments
- Enables content reuse across pages
- Exports `loadFragment()` utility

---

## Development Workflow

### Setup & Commands

```bash
# Install dependencies
npm install

# Start local development server
aem up
# or
npx -y @adobe/aem-cli up --no-open --forward-browser-logs

# Linting
npm run lint        # Check JS and CSS
npm run lint:fix    # Auto-fix issues
```

### Testing Content

**With CMS Content**: Dev server serves previewed content from AEM

**Without CMS Content**: Create static HTML files
1. Create `drafts/` folder at project root
2. Add `.html` or `.plain.html` files following AEM markup structure
3. Start server with: `aem up --html-folder drafts`

**Inspecting Content**:
```bash
curl http://localhost:3000/path/to/page           # Final HTML
curl http://localhost:3000/path/to/page.md        # Markdown
curl http://localhost:3000/path/to/page.plain.html # Plain HTML
```

### Code Style Guidelines

**JavaScript**:
- ES6+ features (arrow functions, destructuring, template literals)
- Airbnb ESLint rules
- Always include `.js` extensions in imports
- Unix line endings (LF)
- No transpilation or build steps

**CSS**:
- Stylelint standard configuration
- Modern CSS features (Grid, Flexbox, Custom Properties)
- Mobile-first responsive design
- Media queries at 600px, 900px, 1200px
- All selectors scoped to block (e.g., `.cards .item-list`)
- Avoid `.{blockname}-container` and `.{blockname}-wrapper` classes

**HTML**:
- Semantic HTML5 elements
- WCAG 2.1 AA accessibility standards
- Proper heading hierarchy
- ARIA labels where appropriate

---

## Performance Optimization

### Best Practices
1. **Lazy Loading**: Use for non-critical resources
2. **Image Optimization**: All images auto-optimized by AEM backend
3. **Code Splitting**: Automatic via `/blocks/` directory structure
4. **Minimal Dependencies**: Avoid external libraries
5. **Critical CSS**: Only LCP-required styles in `styles.css`
6. **Font Loading**: Conditional based on viewport and cache

### Performance Testing
- Target PageSpeed Insights score: **100**
- Test feature preview URLs before merging
- Use `https://developers.google.com/speed/pagespeed/insights/`

---

## Deployment Process

### Environments

**Local Development**:
- URL: `http://localhost:3000`
- Serves uncommitted code + previewed content

**Feature Preview**:
- URL: `https://{branch}--{repo}--{owner}.aem.page/`
- Serves committed code from feature branch + previewed content

**Production Preview**:
- URL: `https://main--{repo}--{owner}.aem.page/`
- Serves main branch code + previewed content

**Production Live**:
- URL: `https://main--{repo}--{owner}.aem.live/`
- Serves main branch code + published content

### Publishing Workflow

1. **Develop**: Create feature branch and implement changes
2. **Test Locally**: Verify at `http://localhost:3000`
3. **Push**: Commit and push to feature branch
4. **Preview**: AEM Code Sync makes changes available on feature preview
5. **Performance Check**: Run PageSpeed Insights on feature preview URL
6. **Pull Request**: 
   - Include link to feature preview page demonstrating changes
   - Create test content if needed
7. **Verify**: Use `gh pr checks` to monitor status
8. **Review**: Human reviewer inspects code and preview URL
9. **Merge**: Changes deployed to production via main branch
10. **Publish**: Content authors publish content to make it live

---

## Key Utilities & APIs

### From `aem.js`

**Decoration**:
- `decorateBlocks(main)` - Adds block classes and attributes
- `decorateSections(main)` - Wraps content in section divs
- `decorateIcons(element)` - Converts `:icon-name:` to SVG icons
- `decorateButtons(main)` - Styles formatted links as buttons
- `decorateTemplateAndTheme()` - Applies template/theme classes

**Loading**:
- `loadBlock(block)` - Loads and decorates a single block
- `loadSection(section, callback)` - Loads blocks in a section
- `loadSections(main)` - Loads all sections
- `loadHeader(header)` - Loads header block
- `loadFooter(footer)` - Loads footer block
- `loadCSS(href)` - Dynamically loads CSS file

**Images**:
- `createOptimizedPicture(src, alt, eager, breakpoints)` - Creates responsive picture element

**Utilities**:
- `buildBlock(blockName, content)` - Programmatically creates block
- `getMetadata(name)` - Retrieves page metadata
- `toClassName(name)` - Converts string to valid class name
- `readBlockConfig(block)` - Extracts key-value config from block

---

## Security Considerations

- **CSP**: Content Security Policy configured in `head.html`
- **Client-Side Only**: All code runs in browser (public)
- **No Secrets**: Never commit API keys or passwords
- **Dependencies**: Regularly update via Renovate
- **File Exclusion**: Use `.hlxignore` to prevent serving sensitive files

---

## Accessibility Standards

- **WCAG 2.1 AA Compliance**: Target standard
- **Semantic HTML**: Use appropriate elements
- **Heading Hierarchy**: Logical h1-h6 structure
- **Alt Text**: Required for all images
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Test with assistive technology
- **Focus Management**: Visible focus indicators
- **ARIA Labels**: Use where semantic HTML insufficient

---

## Troubleshooting & Resources

### Documentation
- Main Docs: https://www.aem.live/docs/
- Developer Tutorial: https://www.aem.live/developer/tutorial
- Project Anatomy: https://www.aem.live/developer/anatomy-of-a-project
- Performance Guide: https://www.aem.live/developer/keeping-it-100
- Markup Reference: https://www.aem.live/developer/markup-sections-blocks
- David's Model: https://www.aem.live/docs/davidsmodel

### Search Tips
- Web search: `site:www.aem.live {query}`
- Full-text search: `curl -s https://www.aem.live/docpages-index.json | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'`

### Common Issues
- **Block not loading**: Check console for errors, verify file paths
- **Styles not applying**: Ensure selectors are scoped to block
- **Performance issues**: Check PageSpeed Insights, optimize images
- **Content not appearing**: Verify content is previewed in AEM

---

## Contributing Guidelines

1. **Follow Existing Patterns**: Match boilerplate code style
2. **Test Locally**: Verify changes before committing
3. **Run Linting**: `npm run lint:fix` before committing
4. **Performance First**: Maintain 100 PageSpeed score
5. **Document Changes**: Update docs for significant changes
6. **Provide Preview**: Include feature preview URL in PRs
7. **Accessibility**: Ensure WCAG 2.1 AA compliance

---

## Project Configuration Files

- **`.editorconfig`**: Editor formatting rules
- **`.eslintrc.js`**: JavaScript linting configuration
- **`.stylelintrc.json`**: CSS linting configuration
- **`.gitignore`**: Git exclusions
- **`.hlxignore`**: AEM serving exclusions (same format as .gitignore)
- **`.renovaterc.json`**: Automated dependency updates
- **`package.json`**: Node.js dependencies and scripts

---

## Summary

This AEM Edge Delivery Services project prioritizes:
- ⚡ **Performance**: 100 PageSpeed score target
- 📝 **Authoring**: Easy content creation in AEM
- 🎨 **Maintainability**: Clean, vanilla code without frameworks
- ♿ **Accessibility**: WCAG 2.1 AA compliance
- 📱 **Responsiveness**: Mobile-first design
- 🔒 **Security**: CSP and best practices

The architecture separates concerns through blocks, uses progressive loading for optimal performance, and maintains simplicity through vanilla JavaScript and modern CSS.

---

## Content Rendering Pipeline - Deep Dive

### How Content Flows from AEM to Browser

The content rendering process in AEM Edge Delivery Services follows a sophisticated pipeline that transforms authored content into optimized, interactive web pages.

### 1. Content Authoring & Backend Processing

**Content Creation**:
- Authors create content in AEM (Adobe Experience Manager)
- Content is structured using documents (Google Docs, Word, SharePoint)
- Authors use tables to define blocks and their content
- Content is saved and previewed in AEM

**Backend Transformation**:
- AEM Edge Delivery backend (`*.aem.live`) processes authored content
- Converts documents to semantic HTML5
- Generates clean markup following specific conventions:
  - Sections: `<div>` containers for page segments
  - Blocks: Nested `<div>` structures representing components
  - Default content: Standard HTML elements (p, h1-h6, ul, ol, etc.)

**Initial HTML Structure Example**:
```html
<main>
  <div> <!-- Section 1 -->
    <div> <!-- Block: hero -->
      <div><div>Picture</div></div>
      <div><div>Heading Text</div></div>
    </div>
  </div>
  <div> <!-- Section 2 -->
    <p>Regular paragraph content</p>
    <div> <!-- Block: cards -->
      <div><div>Card 1 Image</div><div>Card 1 Text</div></div>
      <div><div>Card 2 Image</div><div>Card 2 Text</div></div>
    </div>
  </div>
</main>
```

### 2. Page Load Initialization

**Step 1: HTML & Core Scripts Load**
```
Browser requests page → Server returns HTML with:
├── <head> content from head.html
├── <script src="/scripts/aem.js" type="module">
├── <script src="/scripts/scripts.js" type="module">
└── <link rel="stylesheet" href="/styles/styles.css">
```

**Step 2: aem.js Initialization**
- `init()` function runs automatically
- Sets up `window.hlx` global object with configuration
- Initializes RUM (Real User Monitoring)
- Determines `codeBasePath` for loading resources

**Step 3: scripts.js Execution**
- Calls `loadPage()` which orchestrates the three-phase loading
- Begins eager loading phase immediately

### 3. Eager Loading Phase (LCP Critical)

**Executed by `loadEager()` in scripts.js**:

```javascript
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();        // 1. Apply template/theme classes
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);              // 2. Decorate all content
    document.body.classList.add('appear'); // 3. Make body visible
    await loadSection(main.querySelector('.section'), waitForFirstImage); // 4. Load first section
  }
  // Conditionally load fonts
}
```

**Content Decoration Process (`decorateMain`)**:

1. **`decorateIcons(main)`**:
   - Finds all `<span class="icon icon-{name}">` elements
   - Replaces with `<img>` tags pointing to `/icons/{name}.svg`
   - Sets lazy loading and dimensions

2. **`buildAutoBlocks(main)`**:
   - **Hero Auto-Block**: Detects h1 before picture, wraps in hero block
   - **Fragment Auto-Load**: Finds links to `/fragments/*`, loads and embeds content
   - Programmatically creates block structures using `buildBlock()`

3. **`decorateSections(main)`**:
   - Wraps content in section divs
   - Identifies default content vs blocks
   - Adds `.section` class and `data-section-status="initialized"`
   - Wraps non-block content in `.default-content-wrapper`
   - Initially hides sections with `display: none`

4. **`decorateBlocks(main)`**:
   - Finds all `div.section > div > div` (potential blocks)
   - For each block:
     - Adds `.block` class
     - Sets `data-block-name` from first class
     - Sets `data-block-status="initialized"`
     - Calls `wrapTextNodes()` to wrap inline text in `<p>` tags
     - Adds `{blockname}-wrapper` class to parent
     - Adds `{blockname}-container` class to section

5. **`decorateButtons(main)`**:
   - Finds links inside paragraphs
   - Checks for formatting: `**link**` (strong) or `*link*` (em)
   - Converts to buttons:
     - `**link**` → `.button.primary`
     - `*link*` → `.button.secondary`
     - `***link***` → `.button.accent`
   - Wraps in `.button-wrapper`

**After Decoration, HTML Looks Like**:
```html
<main>
  <div class="section hero-container" data-section-status="initialized" style="display: none;">
    <div class="hero-wrapper">
      <div class="hero block" data-block-name="hero" data-block-status="initialized">
        <div><div><picture>...</picture></div></div>
        <div><div><h1>Heading</h1></div></div>
      </div>
    </div>
  </div>
  <div class="section cards-container" data-section-status="initialized" style="display: none;">
    <div class="default-content-wrapper">
      <p>Regular content</p>
    </div>
    <div class="cards-wrapper">
      <div class="cards block" data-block-name="cards" data-block-status="initialized">
        <!-- cards content -->
      </div>
    </div>
  </div>
</main>
```

**First Section Loading**:
- `loadSection()` called on first section only
- Changes `data-section-status` to "loading"
- Loads all blocks in that section via `loadBlock()`

### 4. Block Loading & Decoration

**`loadBlock(block)` Process**:

1. **Check Status**: Skip if already loading/loaded
2. **Set Status**: `data-block-status = "loading"`
3. **Load CSS**: 
   ```javascript
   loadCSS(`/blocks/{blockname}/{blockname}.css`)
   ```
4. **Load & Execute JavaScript**:
   ```javascript
   const mod = await import(`/blocks/{blockname}/{blockname}.js`);
   await mod.default(block); // Call decorate function
   ```
5. **Wait for Completion**: Both CSS and JS must finish
6. **Set Status**: `data-block-status = "loaded"`

**Block Decoration (Custom Logic)**:

Each block's `decorate()` function transforms the initial HTML:

**Example: Cards Block**:
```javascript
export default function decorate(block) {
  // Transform table-like structure to semantic list
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    
    // Classify children
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  
  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => 
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    )
  );
  
  block.replaceChildren(ul);
}
```

**After Block Decoration**:
```html
<div class="cards block" data-block-name="cards" data-block-status="loaded">
  <ul>
    <li>
      <div class="cards-card-image"><picture>...</picture></div>
      <div class="cards-card-body"><h3>Title</h3><p>Text</p></div>
    </li>
    <li>
      <div class="cards-card-image"><picture>...</picture></div>
      <div class="cards-card-body"><h3>Title</h3><p>Text</p></div>
    </li>
  </ul>
</div>
```

**Section Visibility**:
- After all blocks in section load, `loadSection()` completes
- Sets `data-section-status = "loaded"`
- Removes `display: none` → section becomes visible
- Calls optional callback (e.g., `waitForFirstImage` for LCP)

### 5. Lazy Loading Phase

**Executed by `loadLazy()` after LCP**:

1. **Load Header**:
   ```javascript
   loadHeader(doc.querySelector('header'))
   ```
   - Creates header block programmatically
   - Loads `/blocks/header/header.js` and `.css`
   - Header typically loads `/nav` fragment for navigation content

2. **Load Remaining Sections**:
   ```javascript
   await loadSections(main)
   ```
   - Iterates through all sections not yet loaded
   - Loads each section sequentially
   - After first section, enhances RUM monitoring

3. **Handle Hash Navigation**:
   - Checks for URL hash (`#section-id`)
   - Scrolls to element if found

4. **Load Footer**:
   ```javascript
   loadFooter(doc.querySelector('footer'))
   ```
   - Similar to header, creates footer block
   - Typically loads `/footer` fragment

5. **Load Lazy Styles**:
   ```javascript
   loadCSS('/styles/lazy-styles.css')
   ```
   - Additional global styles for below-the-fold content

6. **Load Fonts** (if not already loaded)

### 6. Delayed Loading Phase

**Executed by `loadDelayed()` 3 seconds after page load**:

```javascript
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}
```

- Loads marketing technology (analytics, tracking)
- Non-critical functionality
- Ensures no performance impact on user experience

### 7. Image Optimization

**`createOptimizedPicture()` Function**:

Transforms simple image URLs into responsive picture elements:

```javascript
createOptimizedPicture(
  '/media/image.jpg',
  'Alt text',
  false, // lazy loading
  [
    { media: '(min-width: 600px)', width: '2000' },
    { width: '750' }
  ]
)
```

**Generates**:
```html
<picture>
  <!-- WebP sources for modern browsers -->
  <source media="(min-width: 600px)" type="image/webp" 
          srcset="/media/image.jpg?width=2000&format=webply&optimize=medium">
  <source type="image/webp" 
          srcset="/media/image.jpg?width=750&format=webply&optimize=medium">
  
  <!-- Fallback sources -->
  <source media="(min-width: 600px)" 
          srcset="/media/image.jpg?width=2000&format=jpg&optimize=medium">
  
  <!-- Final img tag -->
  <img loading="lazy" alt="Alt text" 
       src="/media/image.jpg?width=750&format=jpg&optimize=medium">
</picture>
```

**Benefits**:
- Automatic WebP format for supported browsers
- Responsive images based on viewport
- Lazy loading by default
- Automatic optimization via query parameters

### 8. Fragment Loading

**Fragments enable content reuse**:

```javascript
// Auto-detected in buildAutoBlocks()
const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')];

// Or manually loaded
import { loadFragment } from '../blocks/fragment/fragment.js';
const fragment = await loadFragment('/fragments/nav');
```

**Process**:
1. Fetch fragment HTML from path
2. Parse into document fragment
3. Decorate content (sections, blocks, buttons, icons)
4. Return decorated fragment for insertion

**Used by**:
- Header block (loads `/nav`)
- Footer block (loads `/footer`)
- Any block needing reusable content

### 9. Complete Rendering Timeline

```
0ms:    HTML arrives, browser parses
        ├── aem.js loads and initializes
        └── scripts.js loads and starts loadPage()

~50ms:  Eager phase begins
        ├── decorateTemplateAndTheme()
        ├── decorateMain() - all decoration functions
        ├── body.classList.add('appear') - page visible
        └── loadSection(first section)
            ├── Load block CSS
            ├── Load block JS
            ├── Execute block decorate()
            └── Section becomes visible

~200ms: LCP achieved (first section visible)

~250ms: Lazy phase begins
        ├── loadHeader()
        ├── loadSections(remaining)
        ├── loadFooter()
        └── loadCSS(lazy-styles.css)

3000ms: Delayed phase
        └── import('./delayed.js')
```

### 10. Key Rendering Principles

1. **Progressive Enhancement**: Page is functional at each stage
2. **Performance First**: Only load what's needed when it's needed
3. **Separation of Concerns**: Content structure separate from presentation
4. **Graceful Degradation**: Blocks handle missing/extra content
5. **Semantic HTML**: Meaningful markup throughout
6. **Accessibility**: ARIA, keyboard nav, screen reader support
7. **Responsive**: Mobile-first with progressive enhancement
8. **Optimized Assets**: Automatic image optimization and lazy loading

### 11. Content-to-Code Contract

**Authors control**:
- Content structure (what goes in blocks)
- Block configuration (via table structure)
- Content order and hierarchy

**Developers control**:
- How blocks transform initial HTML
- Styling and interactivity
- Performance optimizations
- Accessibility implementation

**The "contract"** is the initial HTML structure that blocks expect. Changes to this structure require coordination between authors and developers.


---

## Content Fetching & Block Population - Detailed Flow

### How Content is Retrieved and Blocks are Populated

Understanding how content flows from the AEM backend to populated blocks is crucial for working with Edge Delivery Services.

### 1. Initial Page Request & Content Delivery

**Browser Request Flow**:
```
User navigates to page
    ↓
Browser requests: https://example.com/page
    ↓
AEM Edge Delivery backend processes request
    ↓
Backend returns HTML with:
    - Semantic HTML structure
    - Sections and blocks as nested divs
    - Content already embedded in HTML
    ↓
Browser receives complete HTML document
```

**Key Point**: Unlike traditional SPAs, **content is already in the HTML** when it arrives. There's no separate API call to fetch page content - it's server-side rendered by the AEM backend.

### 2. Content Formats Available

The AEM backend can serve content in multiple formats:

**HTML Format** (default):
```bash
GET /page
# Returns: Full HTML page with <html>, <head>, <body>
```

**Plain HTML Format** (for fragments):
```bash
GET /page.plain.html
# Returns: Just the <main> content without wrapper HTML
# Used by fragments, header, footer
```

**Markdown Format**:
```bash
GET /page.md
# Returns: Original markdown source
```

**JSON Format**:
```bash
GET /page.json
# Returns: Structured JSON representation of content
```

### 3. Block Content Structure in HTML

**How Blocks Arrive from Backend**:

When authors create a block in AEM (using a table), the backend converts it to nested divs:

**Author Creates (in document)**:
```
| Hero                    |
|-------------------------|
| ![image](image.jpg)     |
| # Welcome to Our Site   |
```

**Backend Delivers (HTML)**:
```html
<div>
  <div>
    <div><img src="./media_xxx/image.jpg" alt=""></div>
  </div>
  <div>
    <div><h1>Welcome to Our Site</h1></div>
  </div>
</div>
```

**After Decoration (by scripts.js)**:
```html
<div class="hero block" data-block-name="hero" data-block-status="initialized">
  <div>
    <div><picture>...</picture></div>
  </div>
  <div>
    <div><h1>Welcome to Our Site</h1></div>
  </div>
</div>
```

### 4. Fragment Loading Pattern

Fragments are reusable content pieces loaded dynamically. This is the primary way additional content is fetched after initial page load.

**Fragment Loading Process**:

```javascript
// 1. Fragment is requested (e.g., for header/footer)
const footerPath = '/footer';

// 2. Fetch the plain HTML version
const resp = await fetch(`${footerPath}.plain.html`);

// 3. Parse response into DOM
const main = document.createElement('main');
main.innerHTML = await resp.text();

// 4. Fix relative media paths
main.querySelectorAll('img[src^="./media_"]').forEach((img) => {
  img.src = new URL(img.getAttribute('src'), new URL(path, window.location)).href;
});

// 5. Decorate the fragment content
decorateMain(main);  // Applies all decoration (sections, blocks, buttons, icons)

// 6. Load all sections in the fragment
await loadSections(main);

// 7. Return decorated fragment
return main;
```

**Real Example - Header Block**:

```javascript
// blocks/header/header.js
export default async function decorate(block) {
  // 1. Get nav path from metadata or use default
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  
  // 2. Load fragment (fetches /nav.plain.html)
  const fragment = await loadFragment(navPath);
  
  // 3. Build nav structure
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }
  
  // 4. Apply nav-specific classes and behavior
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });
  
  // 5. Add interactivity (hamburger menu, dropdowns)
  // ... event listeners and behavior
  
  // 6. Append to block
  block.append(nav);
}
```

**What Happens**:
1. Header block decoration starts
2. Fetches `/nav.plain.html` from server
3. Receives HTML with navigation content
4. Decorates that content (sections, blocks, buttons)
5. Transforms it into interactive navigation
6. Inserts into header block

### 5. Block Population Patterns

**Pattern 1: Content Already in Block (Most Common)**

The block receives its content from the initial HTML:

```javascript
// blocks/cards/cards.js
export default function decorate(block) {
  // Content is already in block.children
  // Just transform the structure
  
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    // Each row is already populated with content
    const li = document.createElement('li');
    while (row.firstElementChild) {
      li.append(row.firstElementChild); // Move existing content
    }
    ul.append(li);
  });
  
  block.replaceChildren(ul);
}
```

**Pattern 2: Fetch External Content (Fragments)**

Block fetches additional content:

```javascript
// blocks/fragment/fragment.js
export default async function decorate(block) {
  // 1. Extract path from block content
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  
  // 2. Fetch fragment content
  const fragment = await loadFragment(path);
  
  // 3. Replace block content with fetched content
  if (fragment) {
    block.replaceChildren(...fragment.childNodes);
  }
}
```

**Pattern 3: Programmatic Content Generation**

Block generates content from configuration:

```javascript
export default function decorate(block) {
  // 1. Extract configuration from block
  const config = readBlockConfig(block);
  
  // 2. Generate content based on config
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>${config.title}</h2>
    <p>${config.description}</p>
  `;
  
  // 3. Replace block content
  block.replaceChildren(container);
}
```

### 6. Content Fetching Methods

**Method 1: Fetch API (for fragments)**

```javascript
const resp = await fetch('/path/to/content.plain.html');
if (resp.ok) {
  const html = await resp.text();
  // Process HTML
}
```

**Method 2: Dynamic Import (for JavaScript modules)**

```javascript
const mod = await import(`/blocks/${blockName}/${blockName}.js`);
await mod.default(block);
```

**Method 3: loadCSS (for stylesheets)**

```javascript
await loadCSS(`/blocks/${blockName}/${blockName}.css`);
```

**Method 4: loadScript (for non-module scripts)**

```javascript
await loadScript('/path/to/script.js', { async: true });
```

### 7. Block Configuration Extraction

Blocks can have configuration embedded in their content structure:

**Configuration Block Structure**:
```html
<div class="my-block">
  <div>
    <div>Title</div>
    <div>My Page Title</div>
  </div>
  <div>
    <div>Background Color</div>
    <div>blue</div>
  </div>
  <div>
    <div>Show Date</div>
    <div>true</div>
  </div>
</div>
```

**Extracting Configuration**:
```javascript
import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  // Returns: {
  //   title: "My Page Title",
  //   'background-color': "blue",
  //   'show-date': "true"
  // }
  
  // Use configuration
  if (config['background-color']) {
    block.style.backgroundColor = config['background-color'];
  }
}
```

**`readBlockConfig()` Logic**:
- Iterates through block rows
- First column = key (converted to kebab-case)
- Second column = value
- Handles links, images, paragraphs specially
- Returns object with key-value pairs

### 8. Media Path Resolution

**Problem**: Fragment content has relative media paths that need resolution.

**Solution**: Path rewriting during fragment load:

```javascript
// Fragment at /fragments/hero
// Contains: <img src="./media_abc123/image.jpg">

// After loading:
const resetAttributeBase = (tag, attr) => {
  main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
    // Resolve relative to fragment path
    elem[attr] = new URL(
      elem.getAttribute(attr),
      new URL(path, window.location)
    ).href;
  });
};

resetAttributeBase('img', 'src');
resetAttributeBase('source', 'srcset');

// Result: <img src="/fragments/media_abc123/image.jpg">
```

### 9. Complete Block Population Flow

**Example: Cards Block on Page Load**

```
1. Browser receives HTML:
   <div>
     <div><div>Card 1 Image</div><div>Card 1 Text</div></div>
     <div><div>Card 2 Image</div><div>Card 2 Text</div></div>
   </div>

2. decorateBlocks() identifies it as a block:
   - Adds class="cards block"
   - Sets data-block-name="cards"
   - Wraps text nodes in <p> tags

3. loadBlock() is called:
   - Fetches /blocks/cards/cards.css
   - Imports /blocks/cards/cards.js
   - Calls cards.js default function

4. cards.js decorate() executes:
   - Reads block.children (content already there)
   - Transforms structure to <ul>/<li>
   - Classifies elements (image vs body)
   - Optimizes images with createOptimizedPicture()
   - Replaces block content with new structure

5. Block is marked as loaded:
   - data-block-status="loaded"
   - CSS applied
   - Content visible
```

### 10. Async Content Loading Patterns

**Sequential Loading** (default for sections):
```javascript
async function loadSections(element) {
  const sections = [...element.querySelectorAll('div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    await loadSection(sections[i]); // Wait for each
  }
}
```

**Parallel Loading** (for blocks in a section):
```javascript
async function loadSection(section) {
  const blocks = [...section.querySelectorAll('div.block')];
  // Load all blocks in parallel
  await Promise.all(blocks.map(block => loadBlock(block)));
}
```

**Lazy Loading** (on-demand):
```javascript
// Load content when user scrolls near it
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadBlock(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

blocks.forEach(block => observer.observe(block));
```

### 11. Content Caching Strategy

**Browser Caching**:
- Static assets (CSS, JS, images) cached by browser
- HTML content can be cached with appropriate headers
- Service workers can provide offline support

**Fragment Caching**:
- Fragments loaded once per page load
- Multiple blocks can reference same fragment
- Fragment content cached in memory during page session

**No Client-Side Data Store**:
- No Redux, Vuex, or similar state management
- Content lives in DOM
- Re-fetching happens via page navigation or fragment reload

### 12. Error Handling in Content Fetching

**Fragment Loading Errors**:
```javascript
export async function loadFragment(path) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      // Success path
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null; // Failed to load
}

// In block:
const fragment = await loadFragment(path);
if (fragment) {
  block.replaceChildren(...fragment.childNodes);
} else {
  // Handle error - show fallback or error message
  block.innerHTML = '<p>Content could not be loaded</p>';
}
```

**Block Loading Errors**:
```javascript
async function loadBlock(block) {
  try {
    const mod = await import(`/blocks/${blockName}/${blockName}.js`);
    if (mod.default) {
      await mod.default(block);
    }
  } catch (error) {
    console.error(`failed to load module for ${blockName}`, error);
    // Block remains in initialized state
    // Content still visible but not enhanced
  }
}
```

### 13. Content Update Patterns

**Static Content** (most common):
- Content delivered in initial HTML
- No updates after page load
- New content requires page navigation

**Dynamic Content** (via fragments):
- Load new fragment content
- Replace existing block content
- Useful for modals, overlays, dynamic sections

**Example - Dynamic Content Loading**:
```javascript
async function updateBlockContent(block, newPath) {
  // Show loading state
  block.classList.add('loading');
  
  // Fetch new content
  const fragment = await loadFragment(newPath);
  
  // Update block
  if (fragment) {
    block.replaceChildren(...fragment.childNodes);
  }
  
  // Remove loading state
  block.classList.remove('loading');
}
```

### 14. Summary: Content Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Author creates content in AEM                            │
│    - Uses documents (Google Docs, Word, SharePoint)         │
│    - Structures content with tables for blocks              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AEM Backend processes and serves                         │
│    - Converts to semantic HTML                              │
│    - Embeds content in nested div structure                 │
│    - Serves as /page, /page.plain.html, /page.json         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Browser receives HTML                                    │
│    - Full page HTML with content already embedded           │
│    - No separate API calls needed for page content          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. JavaScript decorates content                             │
│    - Identifies sections and blocks                         │
│    - Adds classes and attributes                            │
│    - Wraps text nodes                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Blocks load and transform                                │
│    - Load block CSS and JS                                  │
│    - Execute block decorate() function                      │
│    - Transform existing content in place                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Additional content fetched (if needed)                   │
│    - Fragments for header/footer                            │
│    - Fragment blocks for reusable content                   │
│    - Fetched as .plain.html and decorated                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Fully rendered, interactive page                         │
│    - All content visible and styled                         │
│    - Event listeners attached                               │
│    - Images optimized and lazy loaded                       │
└─────────────────────────────────────────────────────────────┘
```

**Key Takeaways**:
1. **Content is pre-rendered**: Arrives in HTML, not fetched via API
2. **Blocks transform in-place**: Content already in DOM, just restructured
3. **Fragments are the exception**: Only additional content fetched after load
4. **No client-side routing**: Navigation loads new pages from server
5. **Progressive enhancement**: Page works without JavaScript, enhanced with it


---

## HTML Component Layering and Positioning

### Understanding the DOM Structure and CSS Layout

AEM Edge Delivery Services uses a specific HTML layering structure with CSS positioning strategies to create the final page layout. Understanding this hierarchy is crucial for proper styling and component placement.

### 1. Overall Page Structure

```
<html>
  <head>
    <!-- Meta tags, scripts, styles from head.html -->
  </head>
  <body class="appear">
    <header>
      <div class="header block">
        <div class="nav-wrapper">
          <nav>...</nav>
        </div>
      </div>
    </header>
    
    <main>
      <div class="section">
        <div class="block-wrapper">
          <div class="block">...</div>
        </div>
      </div>
      <!-- More sections -->
    </main>
    
    <footer>
      <div class="footer block">...</div>
    </footer>
  </body>
</html>
```

### 2. CSS Layering Hierarchy

**Z-Index Stacking Context**:

```
Layer 10: Fixed/Sticky Navigation (z-index: 2)
Layer 5:  Modals and Overlays (if implemented)
Layer 3:  Dropdown Menus (positioned absolute)
Layer 1:  Main Content (default stacking)
Layer 0:  Background Images (z-index: -1)
```

### 3. Header Component Layering

**HTML Structure**:
```html
<header>                                    <!-- Fixed height: 64px -->
  <div class="header block">                <!-- Block wrapper -->
    <div class="nav-wrapper">               <!-- Position: fixed (mobile), relative (desktop) -->
      <nav id="nav">                        <!-- Grid/Flex layout -->
        <div class="nav-hamburger">...</div> <!-- Grid area: hamburger -->
        <div class="nav-brand">...</div>     <!-- Grid area: brand -->
        <div class="nav-sections">...</div>  <!-- Grid area: sections -->
        <div class="nav-tools">...</div>     <!-- Grid area: tools -->
      </nav>
    </div>
  </div>
</header>
```

**CSS Positioning Strategy**:

```css
/* Mobile Layout (< 900px) */
header .nav-wrapper {
  position: fixed;           /* Stays at top during scroll */
  width: 100%;
  z-index: 2;               /* Above main content */
  background-color: white;
}

header nav {
  display: grid;
  grid-template:
    'hamburger brand tools' 64px
    'sections sections sections' 1fr / auto 1fr auto;
  height: 64px;
}

/* When menu is open */
header nav[aria-expanded='true'] {
  grid-template:
    'hamburger brand' 64px
    'sections sections' 1fr
    'tools tools' 64px / auto 1fr;
  min-height: 100dvh;        /* Full viewport height */
  overflow-y: auto;
}

/* Desktop Layout (>= 900px) */
@media (width >= 900px) {
  header .nav-wrapper {
    position: relative;      /* Normal flow */
  }
  
  header nav {
    display: flex;           /* Horizontal layout */
    justify-content: space-between;
  }
  
  /* Dropdown menus */
  header nav .nav-sections .default-content-wrapper > ul > li > ul {
    position: absolute;      /* Float above content */
    top: 150%;
    left: -24px;
    background-color: #f8f8f8;
    z-index: 1;             /* Above other nav items */
  }
}
```

**Key Positioning Concepts**:
- **Mobile**: Fixed positioning keeps nav visible during scroll
- **Desktop**: Relative positioning allows normal document flow
- **Dropdowns**: Absolute positioning creates floating menus
- **Z-index**: Ensures nav stays above main content

### 4. Main Content Layering

**HTML Structure**:
```html
<main>
  <div class="section hero-container">           <!-- Section with block-specific class -->
    <div class="hero-wrapper">                    <!-- Block wrapper -->
      <div class="hero block">                    <!-- The block itself -->
        <div>                                     <!-- Block row -->
          <div>                                   <!-- Block cell -->
            <picture>...</picture>                <!-- Content -->
          </div>
        </div>
        <div>
          <div>
            <h1>Heading</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="section cards-container">
    <div class="default-content-wrapper">        <!-- Default content wrapper -->
      <p>Regular content</p>
    </div>
    <div class="cards-wrapper">
      <div class="cards block">...</div>
    </div>
  </div>
</main>
```

**CSS Positioning Strategy**:

```css
/* Section Layout */
main > .section {
  margin: 40px 0;           /* Vertical spacing between sections */
}

main > .section > div {
  max-width: 1200px;        /* Content width constraint */
  margin: auto;             /* Center horizontally */
  padding: 0 24px;          /* Horizontal padding */
}

/* Section Variants */
main .section.light,
main .section.highlight {
  background-color: #f8f8f8;
  margin: 0;                /* Full-width background */
  padding: 40px 0;          /* Vertical padding instead of margin */
}
```

### 5. Hero Block Layering (Background Image Pattern)

**HTML Structure**:
```html
<div class="hero block">
  <div>
    <div>
      <picture>...</picture>  <!-- Background image -->
    </div>
  </div>
  <div>
    <div>
      <h1>Heading</h1>        <!-- Foreground content -->
    </div>
  </div>
</div>
```

**CSS Positioning Strategy**:

```css
.hero {
  position: relative;        /* Establishes positioning context */
  padding: 40px 24px;
  min-height: 300px;
}

.hero picture {
  position: absolute;        /* Remove from normal flow */
  z-index: -1;              /* Behind text content */
  inset: 0;                 /* Fill entire hero block */
  object-fit: cover;
}

.hero img {
  object-fit: cover;        /* Fill container, crop if needed */
  width: 100%;
  height: 100%;
}

.hero h1 {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  color: white;             /* Contrast with background */
  position: relative;       /* Above background (default z-index: 0) */
}
```

**Layering Breakdown**:
```
Layer 0:  Hero heading (relative, z-index: auto/0)
Layer -1: Hero background image (absolute, z-index: -1)
```

### 6. Cards Block Layering (Grid Layout)

**HTML Structure**:
```html
<div class="cards block">
  <ul>
    <li>
      <div class="cards-card-image">
        <picture>...</picture>
      </div>
      <div class="cards-card-body">
        <h3>Title</h3>
        <p>Description</p>
      </div>
    </li>
    <!-- More cards -->
  </ul>
</div>
```

**CSS Positioning Strategy**:

```css
.cards > ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(257px, 1fr));
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cards > ul > li {
  border: 1px solid #dadada;
  background-color: white;
  /* No explicit positioning - normal flow */
}

.cards .cards-card-image {
  line-height: 0;           /* Remove extra space below image */
}

.cards > ul > li img {
  width: 100%;
  aspect-ratio: 4 / 3;      /* Maintain consistent proportions */
  object-fit: cover;        /* Fill area, crop if needed */
}

.cards .cards-card-body {
  margin: 16px;             /* Internal spacing */
}
```

**Layout Characteristics**:
- **Grid**: Responsive columns that adjust to container width
- **Auto-fill**: Creates as many columns as fit
- **Minmax**: Minimum 257px, maximum equal distribution
- **Normal flow**: Cards stack naturally, no absolute positioning

### 7. Columns Block Layering (Flexbox Layout)

**HTML Structure**:
```html
<div class="columns block">
  <div>                              <!-- Row -->
    <div>                            <!-- Column 1 (text) -->
      <h2>Heading</h2>
      <p>Content</p>
    </div>
    <div class="columns-img-col">    <!-- Column 2 (image) -->
      <picture>...</picture>
    </div>
  </div>
</div>
```

**CSS Positioning Strategy**:

```css
/* Mobile Layout (< 900px) */
.columns > div {
  display: flex;
  flex-direction: column;    /* Stack vertically */
}

.columns > div > div {
  order: 1;                  /* Text columns default order */
}

.columns > div > .columns-img-col {
  order: 0;                  /* Image column first */
}

.columns img {
  width: 100%;
}

/* Desktop Layout (>= 900px) */
@media (width >= 900px) {
  .columns > div {
    flex-direction: unset;   /* Horizontal (row) */
    align-items: center;     /* Vertical centering */
    gap: 24px;
  }
  
  .columns > div > div {
    flex: 1;                 /* Equal width distribution */
    order: unset;            /* Natural order */
  }
}
```

**Layout Characteristics**:
- **Mobile**: Vertical stack with image first (order: 0)
- **Desktop**: Horizontal layout with equal column widths
- **Flexbox**: Flexible sizing and alignment
- **Order property**: Controls visual order without changing HTML

### 8. Positioning Patterns Summary

**Pattern 1: Fixed Positioning (Navigation)**
```css
.element {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
}
```
- **Use**: Sticky headers, persistent UI elements
- **Behavior**: Removed from document flow, stays in viewport
- **Considerations**: Requires z-index management

**Pattern 2: Absolute Positioning (Background Images, Dropdowns)**
```css
.container {
  position: relative;        /* Positioning context */
}

.element {
  position: absolute;
  inset: 0;                 /* Fill container */
  z-index: -1;              /* Behind content */
}
```
- **Use**: Background images, overlays, floating menus
- **Behavior**: Positioned relative to nearest positioned ancestor
- **Considerations**: Requires parent with position: relative

**Pattern 3: Relative Positioning (Default Flow)**
```css
.element {
  position: relative;       /* Or default static */
  /* Normal document flow */
}
```
- **Use**: Most content blocks
- **Behavior**: Normal flow with optional offset
- **Considerations**: Establishes positioning context for children

**Pattern 4: Grid Layout (Cards, Navigation)**
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(257px, 1fr));
  gap: 24px;
}
```
- **Use**: Card grids, responsive layouts
- **Behavior**: Two-dimensional layout system
- **Considerations**: Responsive by default with auto-fill

**Pattern 5: Flexbox Layout (Columns, Navigation)**
```css
.container {
  display: flex;
  flex-direction: column;   /* or row */
  gap: 24px;
}

.item {
  flex: 1;                  /* Equal distribution */
}
```
- **Use**: One-dimensional layouts, alignment
- **Behavior**: Flexible sizing and distribution
- **Considerations**: Direction changes for responsive design

### 9. Responsive Positioning Strategy

**Mobile-First Approach**:

```css
/* Base styles (mobile) */
.element {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* Tablet (>= 600px) */
@media (width >= 600px) {
  .element {
    padding: 24px;
  }
}

/* Desktop (>= 900px) */
@media (width >= 900px) {
  .element {
    flex-direction: row;
    padding: 32px;
  }
}

/* Large Desktop (>= 1200px) */
@media (width >= 1200px) {
  .element {
    max-width: 1200px;
    margin: auto;
  }
}
```

**Breakpoint Strategy**:
- **< 600px**: Mobile (single column, stacked)
- **600px - 899px**: Tablet (may use 2 columns)
- **900px - 1199px**: Desktop (multi-column, horizontal nav)
- **>= 1200px**: Large desktop (max-width constraints)

### 10. Common Layout Patterns

**Full-Width Background with Constrained Content**:
```css
.section.highlight {
  background-color: #f8f8f8;  /* Full width */
  margin: 0;
  padding: 40px 0;
}

.section.highlight > div {
  max-width: 1200px;          /* Constrained content */
  margin: auto;
  padding: 0 24px;
}
```

**Centered Content Container**:
```css
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 24px;
}
```

**Aspect Ratio Images**:
```css
.image-container img {
  width: 100%;
  aspect-ratio: 4 / 3;        /* Maintain proportions */
  object-fit: cover;          /* Fill area, crop if needed */
}
```

**Overlay Pattern**:
```css
.container {
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;                 /* Above overlay */
}
```

### 11. Block Wrapper Classes

Every block gets automatic wrapper classes for styling:

```html
<div class="section {blockname}-container">    <!-- Section level -->
  <div class="{blockname}-wrapper">            <!-- Wrapper level -->
    <div class="{blockname} block">            <!-- Block level -->
      <!-- Block content -->
    </div>
  </div>
</div>
```

**Styling Hierarchy**:

```css
/* Section-level styling (affects section background/spacing) */
.hero-container {
  /* Full-width background, special spacing */
}

/* Wrapper-level styling (affects block container) */
.hero-wrapper {
  max-width: unset;          /* Override default max-width */
  padding: 0;                /* Override default padding */
}

/* Block-level styling (affects block itself) */
.hero {
  position: relative;
  padding: 40px 24px;
  min-height: 300px;
}
```

### 12. Visibility and Display Control

**Initial State (Hidden)**:
```css
body {
  display: none;             /* Hidden until decorated */
}

main > .section {
  display: none;             /* Hidden until loaded */
}

header .header,
footer .footer {
  visibility: hidden;        /* Hidden until loaded */
}
```

**Loaded State (Visible)**:
```css
body.appear {
  display: block;            /* Visible after decoration */
}

main > .section[data-section-status="loaded"] {
  display: block;            /* Visible after loading */
}

header .header[data-block-status="loaded"],
footer .footer[data-block-status="loaded"] {
  visibility: visible;       /* Visible after loading */
}
```

**Why Different Properties?**:
- **display: none**: Completely removes from layout (sections)
- **visibility: hidden**: Reserves space but hides content (header/footer)

### 13. Key Positioning Principles

1. **Establish Positioning Context**: Use `position: relative` on containers for absolute children
2. **Z-Index Management**: Only works on positioned elements (not static)
3. **Stacking Order**: Higher z-index appears above lower (within same stacking context)
4. **Mobile-First**: Start with mobile layout, enhance for larger screens
5. **Flexbox for 1D**: Use for rows or columns with flexible sizing
6. **Grid for 2D**: Use for complex layouts with rows and columns
7. **Absolute for Overlays**: Use for backgrounds, dropdowns, modals
8. **Fixed for Persistence**: Use for sticky headers, floating buttons
9. **Normal Flow Default**: Most content should use normal document flow
10. **Responsive Breakpoints**: 600px, 900px, 1200px for tablet, desktop, large desktop

### 14. Performance Considerations

**Layout Thrashing Prevention**:
- Avoid frequent position changes
- Use `transform` for animations instead of `top/left`
- Batch DOM reads and writes
- Use `will-change` sparingly for animated elements

**Reflow Optimization**:
- Fixed/absolute positioning removes elements from reflow calculations
- Grid/flexbox are more performant than float-based layouts
- Minimize nested positioning contexts

**Paint Optimization**:
- Separate layers for animated elements (z-index, transform)
- Use `contain` property for isolated components
- Avoid expensive properties (box-shadow, gradients) on large areas
