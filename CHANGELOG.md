# [3.1.0](https://github.com/Yrobot/auto-scroll/compare/v3.0.1...v3.1.0) (2025-07-30)


### Features

* support pass container element directly ([6b45424](https://github.com/Yrobot/auto-scroll/commit/6b45424ae440ce68d6980ae19a2ea33efe9451a5))

## [3.0.1](https://github.com/Yrobot/auto-scroll/compare/v3.0.0...v3.0.1) (2024-04-10)


### Bug Fixes

* escapeWhenUpPlugin only escape when scroll up but based on the distance to bottom ([58ffd31](https://github.com/Yrobot/auto-scroll/commit/58ffd312ff8c14acdeac452e1e18de086751f643))
* new add item should be observed ([6d7869c](https://github.com/Yrobot/auto-scroll/commit/6d7869c6602d594b77f4dea3e8ae51ec662c4d01))
* throttle lost the last callback ([7f66ec7](https://github.com/Yrobot/auto-scroll/commit/7f66ec79996b83816cc00d2d8964f00cc5b5da0c))

# [3.0.0](https://github.com/Yrobot/auto-scroll/compare/v2.0.1...v3.0.0) (2024-04-08)


### Code Refactoring

* use plugins for custom logic ([26ebd24](https://github.com/Yrobot/auto-scroll/commit/26ebd2448c3f78a893054f8e081b6115eef9dae6))


### BREAKING CHANGES

* use escapeWhenUpPlugin instand of generateEscapeScrollUpContext to handle Stop auto scroll when user scroll up.

## [2.0.1](https://github.com/Yrobot/auto-scroll/compare/v2.0.0...v2.0.1) (2024-04-08)


### Bug Fixes

* ResizeObserver loop completed with undelivered notifications. ([93354f0](https://github.com/Yrobot/auto-scroll/commit/93354f0b15b7574cb62d9914d6480abbb14dded6))

# [2.0.0](https://github.com/Yrobot/auto-scroll/compare/v1.0.1...v2.0.0) (2024-01-15)


### Features

* add generateEscapeScrollUpContext, for disbale auto scroll when user scroll up. ([72b553d](https://github.com/Yrobot/auto-scroll/commit/72b553d7d6caf4ccaa639998e00fc919f0554c60))


### BREAKING CHANGES

* 1. remove escapeHook, use context.escapeHook instead. 2. iife usage update: autoScroll.default, autoScroll.generateEscapeScrollUpContext

## [1.0.1](https://github.com/Yrobot/auto-scroll/compare/v1.0.0...v1.0.1) (2024-01-12)


### Bug Fixes

* remove useless log ([4aeb7ff](https://github.com/Yrobot/auto-scroll/commit/4aeb7ff29a47f0ddc4c6a9fd32015383361b64e6))

# 1.0.0 (2024-01-12)


### Features

* finish autoScroll and pipe logic ([647d87f](https://github.com/Yrobot/auto-scroll/commit/647d87f66d6e20d6c8cebcad703ddd4ac03d15c9))
