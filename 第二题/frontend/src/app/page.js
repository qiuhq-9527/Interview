'use client';

import React from 'react';
import Calculator from '../components/Calculator';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <Calculator />
        {/* <div className="mt-4 text-center">
          <Link href="/api-test" className="text-blue-500 hover:underline">
            API测试页面
          </Link>
        </div> */}
      </div>
      {/* <footer className="mt-8 text-sm text-gray-500">
        <p>基于 Connect RPC 的计算器应用</p>
        <p className="mt-1">使用键盘也可以进行计算（数字键、+、-、*、/、Enter）</p>
      </footer> */}
    </main>
  );
}
