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
  A web component which load static svg file form uri to inline svg
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
autoScroll("#scroll-container-id");
```

## script

```html
<script src="https://cdn.jsdelivr.net/npm/@yrobot/auto-scroll"></script>
<script>
  autoScroll("#scroll-container-id");
</script>
```

# Why

## Handle Several Situations

- [✓] The subtree children list length increase
- [✓] The direct child element height increase