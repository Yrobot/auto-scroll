type unObserverCallback = () => void;

const throttle = <R, A extends any[]>(
  fn: (...args: A) => R,
  delay: number
): [(...args: A) => R | null, () => void] => {
  let wait = false;
  let timeout: undefined | number;
  let cancelled = false;
  return [
    (...args: A) => {
      if (cancelled) return null;
      if (wait) return null;
      const val = fn(...args);
      wait = true;
      timeout = window.setTimeout(() => {
        wait = false;
      }, delay);
      return val;
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
  const [onScroll] = throttle((evt: Event) => {
    const target = evt.target as Element;
    const scrollUpDistance =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    isEscape = scrollUpDistance > threshold;
  }, throttleTime);
  context.onMount = (elm) => {
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
 * @param {number} [options.throttleTime=100] - The throttle time in milliseconds.
 * @param {number} [options.offset=0] - The offset for the scroll position based on the container.scrollHeight.
 *
 * @return {function} The unObserverCallback function.
 *
 * @example autoScroll({ selector: "#scroll-container-id" })
 * @example autoScroll({ selector: "#scroll-container-id", plugins: [escapeWhenUpPlugin()] })
 */
export default function autoScroll({
  selector,
  throttleTime = 100,
  plugins = [],
  offset = 0,
}: {
  selector: string;
  throttleTime?: number;
  plugins?: ReturnType<Plugin>[];
  offset?: number;
}): unObserverCallback {
  const container = document.querySelector(selector);

  if (container === null)
    throw new Error(`Element not found with selector [${selector}]`);

  // plugins onMount
  const mountReturnFuncList = plugins
    .map((plugin) => plugin?.onMount?.(container))
    .filter((result) => typeof result === "function") as OnUnmount[];

  // main auto down scroll hook
  const [scrollHook] = throttle(() => {
    if (!!plugins.find((plugin) => plugin?.escapeHook?.(container) === true))
      return false;
    // use requestAnimationFrame for escape ResizeObserver loop
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight + offset;
    });
    return true;
  }, throttleTime);

  // observers
  const resizeObserver = new ResizeObserver(() => {
    scrollHook();
  });
  const mutationObserver = new MutationObserver(() => {
    scrollHook();
  });

  // observe the children size change
  for (const child of container.children) {
    resizeObserver.observe(child);
  }

  // observe the subtree child list length change
  mutationObserver.observe(container, {
    subtree: true,
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
