'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from '../footer/Footer';


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hiddenPaths = ['/provider-login', '/provider-register'];
  const hideLayout = hiddenPaths.includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
