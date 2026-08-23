import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'),
  title: {
    default: "Mike's Auto Garage | Canadian Auto Repair Tips & Parts",
    template: '%s | Mike\'s Auto Garage'
  },
  description: '20+ years of Toronto auto repair experience. Honest car part reviews, DIY guides, and local lead generation for Canadian drivers.',
  openGraph: {
    type: 'website',
    siteName: "Mike's Auto Garage",
    locale: 'en_CA'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
