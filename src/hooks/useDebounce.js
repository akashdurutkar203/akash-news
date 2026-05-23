import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g., search text field inputs).
 * Helps prevent excessive API fetches and mitigates rate-limit thresholds.
 * 
 * @param {*} value The dynamic state value to debounce.
 * @param {number} delay The duration to wait (in milliseconds) before updating the debounced value.
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
