// import { Inter } from 'next/font/google';
import { Providers } from '@/lib/components/ui/Providers';
import NavBar from '../lib/components/NavBar';
import './globals.css'; 

export const metadata = {
  title: 'Welcome to personal-blog',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
