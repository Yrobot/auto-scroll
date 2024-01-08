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
 * @description
 * @author Yrobot
 * @date 08/01/2024
 * @param {{
 *   selector: string;
 *   escapeHook?: (elm: Element) => boolean;
 *   throttleTime?: number;
 *   offset?: number;
 * }} {
 *   selector,
 *   escapeHook = (elm) => false,
 *   throttleTime = 100,
 *   offset = 0,
 * }
 * @return {*}  {unObserverCallback}
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
    console.log("scrollHook is triggered");
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
