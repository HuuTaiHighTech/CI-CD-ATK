'use client';

import React from 'react';
import NextLink from 'next/link';
import { useLocale } from '~/context/locale-context';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const Link: React.FC<Props> = ({ href, className, children, ...props }) => {
  const { locale } = useLocale();

  return (
    <NextLink
      href={`/${locale}/${href.replace(/^\/+/, '')}`}
      className={className}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default Link;
