type unObserverCallback = () => void;
const throttle = <R, A extends any[]>(
  fn: (...args: A) => R,
  delay: number
): [(...args: A) => null, () => void] => {
  let lastCall = -Infinity;
  let timeout: undefined | number;
  let cancelled = false;
  return [
    (...args: A) => {
      if (cancelled) return null;
      let wait = lastCall + delay - Date.now();
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, Math.max(0, wait));
      return null;
    },
    () => {
      cancelled = true;
      clearTimeout(timeout);
    },
  ];
};

type OnUnmount = (elm: Element) => void;

export type Context = {
  escapeHook?: (elm: Element) => boolean;
  onMount?: (elm: Element) => void | OnUnmount;
  onUnmount?: OnUnmount;
};

export type Plugin<T = unknown> = (config?: T) => Context;

/**
 * the auto-scroll plugin for escaping auto scroll down when user scroll up.
 *
 * @param {Object} config - The configs.
 * @param {number} [config.threshold=24] - The threshold value for scroll up distance (default: 24).
 * @param {number} [config.throttleTime=100] - The throttle time for scroll event (default: 100).
 *
 * @returns {Context} The generated state object. For autoScroll.param.plugins
 */
export const escapeWhenUpPlugin: Plugin<{
  threshold?: number;
  throttleTime?: number;
}> = ({ threshold = 24, throttleTime = 100 } = {}) => {
  const context: Context = {};
  let isEscape = false;
  let lastScrollTop = -Infinity;
  const [onScroll] = throttle((evt: Event) => {
    const target = evt.target as Element;
    // when isEscape=false and user scroll up, escape auto scroll
    if (!isEscape && target.scrollTop < lastScrollTop) {
      isEscape = true;
    }
    // when isEscape=true and user scroll down to $threshold, active auto scroll
    if (
      isEscape &&
      target.scrollHeight - target.scrollTop - target.clientHeight <= threshold
    ) {
      isEscape = false;
    }
    lastScrollTop = target.scrollTop;
  }, throttleTime);
  context.onMount = (elm) => {
    lastScrollTop = elm.scrollTop;
    elm.addEventListener("scroll", onScroll);
  };
  context.onUnmount = (elm) => {
    elm.removeEventListener("scroll", onScroll);
  };
  context.escapeHook = () => isEscape;
  return context;
};

/**
 * @description auto scroll the selector dom to the bottom, when the size of the selector dom has been updated.
 *
 * @param {Object} options - The config options for the autoScroll function.
 * @param {string} options.selector - The selector for the container element. (example: '#container')
 * @param {Context[]} [options.plugins] - The plugins for the life cycle hooks of the autoScroll function. [escapeHook,onMount,onUnmount]
 * @param {number} [options.throttleTime=100] - The throttle time in milliseconds. default is 100. 0 for no throttle.
 * @param {number} [options.offset=0] - The offset for the scroll position based on the container.scrollHeight.
 *
 * @return {function} The unObserverCallback function.
 *
 * @example autoScroll({ selector: "#scroll-container-id" })
 * @example autoScroll({ selector: "#scroll-container-id", plugins: [escapeWhenUpPlugin()] })
 */
export default function autoScroll({
  throttleTime = 100,
  plugins = [],
  offset = 0,
  ...res
}: (
  | {
      selector: string;
    }
  | {
      container: HTMLElement | null;
    }
) & {
  throttleTime?: number;
  plugins?: ReturnType<Plugin>[];
  offset?: number;
}): unObserverCallback {
  const container =
    "container" in res ? res.container : document.querySelector(res.selector);

  if (container === null) throw new Error(`Container element not found`);

  // plugins onMount
  const mountReturnFuncList = plugins
    .map((plugin) => plugin?.onMount?.(container))
    .filter((result) => typeof result === "function") as OnUnmount[];

  // main auto down scroll hook
  const onResize = () => {
    if (!!plugins.find((plugin) => plugin?.escapeHook?.(container) === true))
      return false;
    // use requestAnimationFrame for escape ResizeObserver loop
    requestAnimationFrame(() => {
      // console.log("scrollHook", container.scrollHeight - offset);
      container.scrollTo({
        top: container.scrollHeight - offset,
        // behavior: "smooth", // will effect escapeWhenUpPlugin user scroll up detection
      });
    });
    return true;
  };
  const [scrollHook] =
    throttleTime > 0 ? throttle(onResize, throttleTime) : [onResize];

  // observers
  const resizeObserver = new ResizeObserver(() => {
    // console.log("ResizeObserver");
    scrollHook();
  });

  const mutationObserver = new MutationObserver(() => {
    // console.log("MutationObserver");
    observeChildren(); // re-observe the children when the child is new added or removed
    scrollHook();
  });

  // observe the children size change
  const observeChildren = () => {
    resizeObserver.disconnect(); // clean the previous observer
    for (const child of container.children) {
      resizeObserver.observe(child);
    }
  };
  observeChildren();

  // observe the subtree child list length change
  mutationObserver.observe(container, {
    childList: true,
  });

  // unmount
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    mountReturnFuncList.forEach((func) => func(container));
    plugins.forEach((plugin) => plugin?.onUnmount?.(container));
  };
}
