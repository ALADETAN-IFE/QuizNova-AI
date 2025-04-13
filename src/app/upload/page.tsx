import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const UploadClient = dynamic(() => import('./client'), { ssr: false });

export default function UploadPage() {
  return <UploadClient />;
}
