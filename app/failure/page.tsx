import React from 'react';

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thanh toán thất bại!</h1>
        <p className="text-gray-600 mb-6">
          Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </p>
        <a href="/" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mr-4">
          Thử lại
        </a>
        <a href="/contact" className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
          Liên hệ hỗ trợ
        </a>
      </div>
    </div>
  );
}