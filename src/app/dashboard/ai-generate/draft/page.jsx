import React, { Suspense } from 'react';
import Artikel from '../../../../../components/Artikel';

export default function DraftPage() {
  return (
    <Suspense fallback={<div>Memuat daftar artikel...</div>}>
      <Artikel />
    </Suspense>
  );
}