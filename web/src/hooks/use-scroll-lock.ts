import { useEffect } from 'react';

type Options = {
  locked: boolean;
  target?: 'body' | HTMLElement | null;
};

function useScrollLock({ locked, target = 'body' }: Options) {
  useEffect(() => {
    if (!locked) return;

    let el: HTMLElement | null = null;

    if (target === 'body') {
      el = document.body;
    } else if (target instanceof HTMLElement) {
      el = target;
    }

    if (!el) return;

    const original = el.style.overflow;

    el.style.overflow = 'hidden';

    return () => {
      el.style.overflow = original;
    };
  }, [locked, target]);
}

export default useScrollLock;
