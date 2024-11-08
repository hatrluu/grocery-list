'use client';
import { Toaster } from 'sonner';
import SessionQRPage from './components/SessionQRPage';

export default function Home() {
  return (
    <div className="page">
      <main className="main">
        <SessionQRPage></SessionQRPage>
        <Toaster richColors />
      </main>
    </div>
  );
}
