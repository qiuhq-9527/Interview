'use client';

import React from 'react';
import Calculator from '../components/Calculator';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <Calculator />
      </div>
    </main>
  );
}
