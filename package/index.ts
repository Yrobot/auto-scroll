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

/**
 * Generates the context for escaping auto scroll down when user scroll up.
 *
 * @param {Object} config - The configs.
 * @param {number} [config.threshold=24] - The threshold value for scroll up distance (default: 24).
 * @param {number} [config.throttleTime=100] - The throttle time for scroll event (default: 100).
 *
 * @returns {Context} The generated context object. For autoScroll.param.context
 */
export function generateEscapeScrollUpContext({
  threshold = 24,
  throttleTime = 100,
}: { threshold?: number; throttleTime?: number } = {}) {
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
}

/**
 * @description auto scroll the selector dom to the bottom, when the size of the selector dom has been updated.
 *
 * @param {Object} options - The config options for the autoScroll function.
 * @param {string} options.selector - The selector for the container element. (example: '#container')
 * @param {Context} [options.context] - The context for the life cycle hooks of the autoScroll function. [escapeHook,onMount,onUnmount]
 * @param {number} [options.throttleTime=100] - The throttle time in milliseconds.
 * @param {number} [options.offset=0] - The offset for the scroll position based on the container.scrollHeight.
 *
 * @return {function} The unObserverCallback function.
 *
 * @example autoScroll({ selector: "#scroll-container-id" })
 * @example autoScroll({ selector: "#scroll-container-id", context: generateEscapeScrollUpContext() })
 */
export default function autoScroll({
  selector,
  throttleTime = 100,
  context,
  offset = 0,
}: {
  selector: string;
  throttleTime?: number;
  context?: Context;
  offset?: number;
}): unObserverCallback {
  const container = document.querySelector(selector);

  if (container === null)
    throw new Error(`Element not found with selector [${selector}]`);

  const returnOnUnmount = context?.onMount?.(container);

  const [scrollHook] = throttle(() => {
    if (
      typeof context?.escapeHook === "function" &&
      context.escapeHook(container)
    )
      return false;
    container.scrollTop = container.scrollHeight + offset;
    return true;
  }, throttleTime);

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
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    // unmount
    returnOnUnmount?.(container);
    context?.onUnmount?.(container);
  };
}
