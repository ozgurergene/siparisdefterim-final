'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LegalModal from '../components/LegalModal';

export default function LegalConfirmPage() {
  const router = useRouter();

  const handleLegalComplete = (consent) => {
    console.log('Legal Consent:', consent);
    
    // Hukuki onay tamamlandı → /pricing'e git
    setTimeout(() => {
      router.push('/pricing');
    }, 500);
  };

  return (
    <LegalModal onComplete={handleLegalComplete} />
  );
}