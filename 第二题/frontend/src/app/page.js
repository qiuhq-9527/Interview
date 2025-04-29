'use client';

import React from 'react';
import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">计算器应用</h1>
      <Calculator />
      <footer className="mt-8 text-sm text-gray-400">
        <p>基于 Connect RPC 的计算器应用</p>
        <p className="mt-1">使用键盘也可以进行计算（数字键、+、-、*、/、Enter）</p>
      </footer>
    </main>
  );
}
