import type { Metadata } from 'next';
import { Montserrat, Rubik } from 'next/font/google';
import '../globals.css';
import Header from '@/components/Layout/header';
import { Const } from '@/lib/contants';
import Footer from '@/components/Layout/footer';
import { Toaster } from 'sonner';
import Providers from '../_providers/provider';
import { cookies } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

const rubik = Rubik({
  variable: '--font-sans',
  weight: ['400'],
  subsets: ['latin-ext'],
});

const montserrat = Montserrat({
  variable: '--font-sans',
  weight: ['400'],
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  title: Const.APP_NAME,
  description: Const.APP_DESCRIPTION,
  icons: {
    icon: [{ url: 'public/icon.png', sizes: '32x32' }],
  },
  metadataBase: new URL(Const.APP_URL),
  openGraph: {
    images: [
      {
        url: `https://raw.githubusercontent.com/Jaimin25/DayDonezo/85c1b1559feb6d08d95b71b82e998c87143f87ca/public/Link%20Preview%20-%20DayDonezo.png`,
        width: 1200,
        height: 630,
        alt: 'DayDonezo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jaimin_chovatia',
    creator: '@jaimin_chovatia',
    title: Const.APP_NAME + ' - Journaling Wins, Designing Life',
    description: Const.APP_DESCRIPTION,
    images: [
      {
        url: 'https://raw.githubusercontent.com/Jaimin25/DayDonezo/85c1b1559feb6d08d95b71b82e998c87143f87ca/public/Link%20Preview%20-%20DayDonezo.png',
        width: 1200,
        height: 630,
        alt: 'DayDonezo',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const preferences = cookie.get('user.preferences');

  const parsedFont = preferences ? JSON.parse(preferences.value).font : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${parsedFont === 'montserrat' ? montserrat.variable : rubik.variable} min-h-svh bg-background font-sans antialiased`}
      >
        <GoogleAnalytics gaId={process.env.GOOGLE_TAG!} />
        <main className="flex h-screen min-h-svh flex-col overflow-y-auto">
          <Providers>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </Providers>
        </main>
      </body>
    </html>
  );
}
