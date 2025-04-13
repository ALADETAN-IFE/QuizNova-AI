"use client";

import dynamic from 'next/dynamic';

const UploadClient = dynamic(() => import('./client'), { ssr: false });

export default function UploadWrapper() {
  return <UploadClient />;
} 