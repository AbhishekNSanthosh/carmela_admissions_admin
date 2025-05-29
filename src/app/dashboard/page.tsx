"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/home');
  }, [router]);

  return (
    <div className='w-full h-full flex items-center justify-center'>Redirecting...</div> 
  );
}
