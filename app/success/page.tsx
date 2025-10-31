import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã thực hiện thanh toán. Đơn hàng của bạn đã được xử lý thành công.
        </p>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}