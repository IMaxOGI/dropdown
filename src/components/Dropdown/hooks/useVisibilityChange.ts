import { useEffect } from 'react';

const useVisibilityChange = (callback: () => void) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        callback();
      }
    };

    const handleWindowBlur = () => {
      callback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [callback]);
};

export default useVisibilityChange;
