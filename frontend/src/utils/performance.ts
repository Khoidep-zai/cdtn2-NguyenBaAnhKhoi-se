/**
 * performance.ts - Core Web Vitals (INP & LCP) Performance Optimization Utilities
 */

/**
 * Yields execution back to the browser's main thread to prevent long tasks (>50ms)
 * and optimize Interaction to Next Paint (INP).
 * Uses native `scheduler.yield()` when available, falling back to micro-task/timeout yielding.
 */
export async function yieldToMain(): Promise<void> {
  // Modern Chromium scheduler.yield() API
  // @ts-ignore
  if (typeof window !== 'undefined' && window.scheduler && typeof window.scheduler.yield === 'function') {
    try {
      // @ts-ignore
      return await window.scheduler.yield();
    } catch {
      // Fallback if rejected
    }
  }

  // Fallback: MessageChannel / setTimeout yielding
  return new Promise((resolve) => {
    if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => resolve();
      channel.port2.postMessage(null);
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Iterates through a large list in chunks, yielding control to main thread between chunks.
 */
export async function processInChunks<T, R>(
  items: T[],
  chunkSize: number,
  processor: (item: T) => R
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    for (const item of chunk) {
      results.push(processor(item));
    }
    // Yield to let browser handle user clicks/paints
    if (i + chunkSize < items.length) {
      await yieldToMain();
    }
  }
  return results;
}

/**
 * Wraps heavy task execution with Performance API mark/measure for INP auditing
 */
export function measureInteraction(name: string, task: () => void): void {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(startMark);
  }

  try {
    task();
  } finally {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(endMark);
      try {
        const measure = performance.measure(name, startMark, endMark);
        if (measure && measure.duration > 50) {
          console.warn(`[INP Warning] Long task detected in "${name}": ${measure.duration.toFixed(1)}ms (>50ms)`);
        }
      } catch {
        // Measurement error safe ignore
      }
    }
  }
}

