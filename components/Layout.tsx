// components/Layout.tsx
import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface HeaderLink {
  href: string;
  label: string;
}

interface LayoutProps {
  children: ReactNode;
  title: string;
  headerLinks?: HeaderLink[];
}

const Layout: FC<LayoutProps> = ({ children, title, headerLinks = [] }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-white font-bold text-xl">Solhaven</span>
          </Link>
          <div className="flex">
            {headerLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <span className="text-gray-300 hover:text-white px-4">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </>
  );
};

export default Layout;
