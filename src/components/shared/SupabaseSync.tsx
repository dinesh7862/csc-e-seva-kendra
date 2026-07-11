'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export default function SupabaseSync() {
  const syncWithSupabase = useAppStore((state) => state.syncWithSupabase);

  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  return null;
}
