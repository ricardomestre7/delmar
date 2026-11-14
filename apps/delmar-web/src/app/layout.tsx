import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { AmhMenu } from '@/components/amh/AmhMenu';
import { AmhFooter } from '@/components/amh/AmhFooter';
import { STORE_PROFILE } from '@/lib/store-data';

export const metadata: Metadata = {
  title: {
    default: `${STORE_PROFILE.name} — ${STORE_PROFILE.brand}`,
    template: `%s | ${STORE_PROFILE.name}`,
  },
  description: STORE_PROFILE.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <AmhMenu />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <AmhFooter />
        </CartProvider>
      </body>
    </html>
  );
}

