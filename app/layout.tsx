import type { Metadata } from 'next';
import { Geist, Unbounded } from 'next/font/google';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin'],
  weight: ['300'],
});

export const metadata: Metadata = {
  title: 'Spotify.fm',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${unbounded.variable}`}>{children}</body>
    </html>
  );
};

export default RootLayout;
