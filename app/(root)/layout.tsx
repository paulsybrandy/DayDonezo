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
        url: `https://github-production-user-asset-6210df.s3.amazonaws.com/65119631/400134050-5126b529-6803-4afe-adda-8737a6fd20d4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250104T105228Z&X-Amz-Expires=300&X-Amz-Signature=835e53192f2be6b2ecc4320abeaa24e045fea707c991353aa4f292ab0b3c7cb5&X-Amz-SignedHeaders=host`,
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
        url: 'https://github-production-user-asset-6210df.s3.amazonaws.com/65119631/400134050-5126b529-6803-4afe-adda-8737a6fd20d4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250104T105228Z&X-Amz-Expires=300&X-Amz-Signature=835e53192f2be6b2ecc4320abeaa24e045fea707c991353aa4f292ab0b3c7cb5&X-Amz-SignedHeaders=host',
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
