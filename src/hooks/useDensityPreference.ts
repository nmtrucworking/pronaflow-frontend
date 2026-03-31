import { useEffect, useState } from 'react';

export type UxDensity = 'comfortable' | 'compact';

function readDensityFromStorage(): UxDensity {
  if (typeof window === 'undefined') {
    return 'comfortable';
  }

  const attrValue = document.documentElement.getAttribute('data-density');
  if (attrValue === 'compact' || attrValue === 'comfortable') {
    return attrValue;
  }

  const rawPreferences = localStorage.getItem('pronaflow-preferences');
  if (!rawPreferences) {
    return 'comfortable';
  }

  try {
    const parsed = JSON.parse(rawPreferences) as { density?: string };
    return parsed.density === 'compact' ? 'compact' : 'comfortable';
  } catch {
    return 'comfortable';
  }
}

export function useDensityPreference(): UxDensity {
  const [density, setDensity] = useState<UxDensity>(() => readDensityFromStorage());

  useEffect(() => {
    const syncDensity = () => {
      setDensity(readDensityFromStorage());
    };

    syncDensity();
    window.addEventListener('pronaflow-preferences-updated', syncDensity as EventListener);
    window.addEventListener('storage', syncDensity);

    return () => {
      window.removeEventListener('pronaflow-preferences-updated', syncDensity as EventListener);
      window.removeEventListener('storage', syncDensity);
    };
  }, []);

  return density;
}
