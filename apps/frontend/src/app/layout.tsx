import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
