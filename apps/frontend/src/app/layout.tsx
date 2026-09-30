import { Bricolage_Grotesque, Dela_Gothic_One, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import './global.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';

const delaGothic = Dela_Gothic_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dela-gothic',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PdA Talentos — Programadores do Amanhã',
  description:
    'Encontre desenvolvedores formados pela Programadores do Amanhã, com projetos reais e código que você pode avaliar antes da entrevista.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html
        lang="pt-BR"
        suppressHydrationWarning
        className={`${delaGothic.variable} ${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        <body>
          <ThemeProvider>
            <div aria-hidden className="ambient-layer pointer-events-none fixed inset-0 -z-10" />
            <Nav />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
