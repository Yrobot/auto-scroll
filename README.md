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
 This is a tool which makes scroll-container auto scroll to the bottom easy.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@yrobot/auto-scroll"><img src="https://img.shields.io/npm/v/@yrobot/auto-scroll.svg" alt="npm package"></a>
</p>
<br/>

# How to use

## npm

```bash
yarn add @yrobot/auto-scroll
```

```ts
import autoScroll from "@yrobot/auto-scroll";
autoScroll({ selector: "#scroll-container-id" });
```

## script - iife

```html
<script src="https://cdn.jsdelivr.net/npm/@yrobot/auto-scroll/build/index.iife.js"></script>
<script>
  autoScroll.default({ selector: "#scroll-container-id" });
</script>
```

# Why

## Handle Several Situations

- [✓] The subtree children list length increase
- [✓] The direct child element height increase

## Pack Up Useful Utilities Logic

### Stop auto scroll when user scroll up

> es

```ts
import autoScroll, { escapeWhenUpPlugin } from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  plugins: [escapeWhenUpPlugin()],
});
```

> iife

```ts
autoScroll.default({
  selector: "#scroll-container-id",
  plugins: [autoScroll.escapeWhenUpPlugin()],
});
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
