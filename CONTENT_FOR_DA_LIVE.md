# Content Blocks for DA.Live - Context Studio Lab Homepage

## Instructions
Copy and paste these content blocks into your DA.Live document editor to create the Context Studio Lab homepage.

---

## Block 1: Hero Banner

**How to create in DA.Live:**
1. Type the heading text
2. Press Enter
3. Type the description text
4. The auto-blocking will automatically create the hero-banner block

**Content to paste:**

```
Context Studio Lab

Advanced EDS Development Platform with Live Editing, Autonomous Block Generation, and Intelligent Orchestration
```

---

## Block 2: Stats Metrics

**How to create in DA.Live:**
1. Insert a table with 2 columns and 3 rows
2. Fill in the values and labels as shown below

**Table content:**

| Value | Label |
|-------|-------|
| <500ms | BUILD TIME |
| 85%+ | AUTONOMOUS |
| <1s | HMR LATENCY |

**Visual representation:**
```
┌──────────┬─────────────┐
│ <500ms   │ BUILD TIME  │
├──────────┼─────────────┤
│ 85%+     │ AUTONOMOUS  │
├──────────┼─────────────┤
│ <1s      │ HMR LATENCY │
└──────────┴─────────────┘
```

---

## Block 3: CTA Buttons

**How to create in DA.Live:**
1. Insert a table with 2 columns and 3 rows
2. Format the first button text as **bold** (Ctrl+B or Cmd+B)
3. Format the second button text as *italic* (Ctrl+I or Cmd+I)
4. Add links in the second column
5. Add plain text in the third row

**Table content:**

| Button Text | Link |
|-------------|------|
| **Explore Features** | https://example.com/features |
| *View Documentation* | https://example.com/docs |
| Scroll to explore | |

**Visual representation:**
```
┌──────────────────────────┬────────────────────────────────┐
│ **Explore Features**     │ https://example.com/features   │
├──────────────────────────┼────────────────────────────────┤
│ *View Documentation*     │ https://example.com/docs       │
├──────────────────────────┼────────────────────────────────┤
│ Scroll to explore        │                                │
└──────────────────────────┴────────────────────────────────┘
```

---

## Complete Page Structure

Here's how your DA.Live document should look:

```
Context Studio Lab

Advanced EDS Development Platform with Live Editing, Autonomous Block Generation, and Intelligent Orchestration

---

[TABLE: Stats Metrics]
| <500ms | BUILD TIME  |
| 85%+   | AUTONOMOUS  |
| <1s    | HMR LATENCY |

---

[TABLE: CTA Buttons]
| **Explore Features**  | https://example.com/features |
| *View Documentation*  | https://example.com/docs     |
| Scroll to explore     |                              |
```

---

## Navigation Content (for /nav page)

**How to create in DA.Live:**
1. Create a new page called "nav"
2. Add the brand text
3. Insert an unordered list with navigation links

**Content to paste:**

```
⚡ Context Studio Lab

- [Home](/)
- [Features](/features)
- [Architecture](/architecture)
- [Demo](/demo)
- [Documentation](/documentation)
```

---

## Alternative: Using Block Names Explicitly

If auto-blocking doesn't work, you can explicitly name the blocks:

### Hero Banner Block
```
| Hero Banner |
|-------------|
| Context Studio Lab |
| Advanced EDS Development Platform with Live Editing, Autonomous Block Generation, and Intelligent Orchestration |
```

### Stats Metrics Block
```
| Stats Metrics |
|---------------|
| <500ms | BUILD TIME |
| 85%+ | AUTONOMOUS |
| <1s | HMR LATENCY |
```

### CTA Buttons Block
```
| CTA Buttons |
|-------------|
| **Explore Features** | https://example.com/features |
| *View Documentation* | https://example.com/docs |
| Scroll to explore | |
```

---

## Tips for DA.Live Authoring

1. **Bold text** = Primary button (solid background)
2. **Italic text** = Secondary button (outline style)
3. **Tables** = Structured blocks
4. **Horizontal rules (---)** = Section separators
5. **Links** = Add in table cells or inline

---

## Expected Visual Result

After publishing, you should see:

1. **Hero Section**: Large gradient purple-blue heading with description on light background
2. **Stats Section**: Three columns showing metrics with large gradient numbers
3. **CTA Section**: Two styled buttons (gradient primary, outline secondary) with "Scroll to explore" text below

---

## Troubleshooting

**If blocks don't appear:**
- Make sure you've committed and pushed the block code to your repository
- Check that AEM Code Sync has processed your changes
- Verify the block names match exactly (hero-banner, stats-metrics, cta-buttons)
- Try using explicit block names in tables (first row, first cell)

**If styling doesn't apply:**
- Clear browser cache
- Check browser console for CSS loading errors
- Verify CSS files are in the correct block directories

**If auto-blocking doesn't work:**
- Use the explicit block name format shown above
- Check scripts.js has been deployed
- Verify the content structure matches the auto-blocking patterns

---

## Quick Copy-Paste Version

For fastest setup, copy everything below into your DA.Live document:

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
| Scroll to explore | |
```

Save, preview, and publish!