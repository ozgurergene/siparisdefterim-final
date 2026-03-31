'use client';

import { Suspense } from 'react';

export function SearchParamsProvider({ children }) {
  return <Suspense fallback={<div>Yükleniyor...</div>}>{children}</Suspense>;
}