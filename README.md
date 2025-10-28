<p align="center">
  <a href="https://github.com/Yrobot/auto-scroll" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://images.yrobot.top/2024-01-04/auto-scroll-09-59-45.svg" alt="auto-scroll logo">
  </a>
</p>
<br/>
<h2 align="center">
  <a href="https://github.com/Yrobot/auto-scroll">@yrobot/auto-scroll</a>
</h2>
<p align="center">
 A lightweight tool to auto-scroll content on your website.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@yrobot/auto-scroll"><img src="https://img.shields.io/npm/v/@yrobot/auto-scroll.svg" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/@yrobot/auto-scroll"><img src="https://img.shields.io/npm/dm/@yrobot/auto-scroll.svg" alt="npm downloads"></a>
  <a href="https://bundlephobia.com/package/@yrobot/auto-scroll"><img src="https://img.shields.io/bundlephobia/minzip/@yrobot/auto-scroll" alt="bundle size"></a>
  <a href="https://github.com/Yrobot/auto-scroll/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@yrobot/auto-scroll.svg" alt="license"></a>
</p>
<p align="center">
  <a href="https://yrobot.github.io/auto-scroll">🚀 Live Demo</a>
</p>
<br/>

<br/>

## 📖 Table of Contents

- [Showcase](#showcase)
- [Installation](#installation)
  - [npm](#npm)
  - [CDN (IIFE)](#cdn-iife)
- [Features](#features)
- [Built-in Plugins](#built-in-plugins)
- [License](#license)
- [Changelog](#changelog)

---

# Showcase

## Auto-scroll for AI chat interfaces

Perfect for AI chat pages - automatically scrolls to bottom when new messages arrive.

[![demo](/readme/demo.gif)](https://yrobot.github.io/auto-scroll)

---

# Installation

## npm

```bash
npm install @yrobot/auto-scroll
```

**Usage:**

```ts
import autoScroll from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  // OR: pass the container element directly
  // container: document.getElementById("scroll-container-id")
});
```

## CDN (IIFE)

For usage without a build system:

```html
<script src="https://cdn.jsdelivr.net/npm/@yrobot/auto-scroll/build/index.iife.js"></script>
<script>
  autoScroll.default({
    selector: "#scroll-container-id",
    // OR: pass the container element directly
    // container: document.getElementById("scroll-container-id")
  });
</script>
```

---

# Features

## ✨ Handles Multiple Scroll Scenarios

- ✅ **Dynamic content additions** - Automatically scrolls when child elements are added to the container
- ✅ **Growing content** - Automatically scrolls when child element height increases (e.g., streaming text in chat interfaces)

---

# Built-in Plugins

> 🎁 Pre-built plugins are ready to use out of the box - no configuration needed!

## `escapeWhenUpPlugin`

**What it does:** Pauses auto-scrolling when the user manually scrolls up to read previous content.

**Perfect for:** Chat interfaces where users may want to review conversation history without constant interruption.

### ES Module

```ts
import autoScroll, { escapeWhenUpPlugin } from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  plugins: [escapeWhenUpPlugin()],
});
```

### IIFE

```html
<script>
  autoScroll.default({
    selector: "#scroll-container-id",
    plugins: [autoScroll.escapeWhenUpPlugin()],
  });
</script>
```

<!-- ## Customize plugins

```ts
import type { Plugin } from "@yrobot/auto-scroll";

const myPlugin: Plugin<{ name: string }> = ({ name }) => ({
  escapeHook: (elm) => true,
  onMount: (elm) => () => {},
  onUnmount: (elm) => {},
});
```

the plugin should return the an object includes `escapeHook`, `onMount`, `onUnmount` functions. -->

---

# License

[MIT](./LICENSE)

---

# Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
