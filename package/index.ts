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

/**
 * @description auto scroll the selector dom to the bottom, when the size of the selector dom has been updated.
 * @author Yrobot <https://yrobot.top>
 * @date 12/01/2024
 *
 * @param {Object} options - The config options for the autoScroll function.
 * @param {string} [options.selector] - The selector for the container element. (example: '#container')
 * @param {EscapeHook} [options.escapeHook] - A function that determines whether scrolling should be escaped.
 * @param {number} [options.throttleTime] - The throttle time in milliseconds.
 * @param {number} [options.offset] - The offset for the scroll position based on the container.scrollHeight.
 *
 * @return {function} The unObserverCallback function.
 */
function autoScroll({
  selector,
  escapeHook = (elm) => false,
  throttleTime = 100,
  offset = 0,
}: {
  selector: string;
  escapeHook?: (elm: Element) => boolean;
  throttleTime?: number;
  offset?: number;
}): unObserverCallback {
  const container = document.querySelector(selector);

  if (container === null)
    throw new Error(`Element not found with selector [${selector}]`);

  const [scrollHook] = throttle(() => {
    if (escapeHook(container)) return false;
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
  };
}

export default autoScroll;
