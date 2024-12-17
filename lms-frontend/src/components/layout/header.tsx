'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import LanguageSelector from '../language-selector/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { useRTL, getFlexDirection, getMargin } from '@/utils/rtl';

export default function Header() {
  const { settings } = useSelector((state: IRootState) => state.common.data);
  const { t } = useTranslation();
  const isRTL = useRTL();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className={`mr-4 flex ${getFlexDirection(isRTL)}`}>
          <Link href="/" className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            {settings?.site_logo && (
              <Image
                src={settings.site_logo}
                alt={settings?.site_name || 'Logo'}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            )}
            <span className="hidden font-bold sm:inline-block">
              {settings?.site_name}
            </span>
          </Link>
        </div>

        <div className={`flex flex-1 items-center justify-between space-x-2 ${isRTL ? 'space-x-reverse' : ''} md:justify-end`}>
          <nav className={`flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
              style={getMargin(isRTL, 0, 24)}
            >
              {t('common.courses')}
            </Link>
            <Link
              href="/instructors"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
              style={getMargin(isRTL, 0, 24)}
            >
              {t('common.instructors')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
              style={getMargin(isRTL, 0, 24)}
            >
              {t('common.about')}
            </Link>
          </nav>

          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
