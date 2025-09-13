import { useEffect, useState } from 'react';

export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return isHydrated;
};
