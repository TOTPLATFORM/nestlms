'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function LanguageSelector() {
  const { currentLanguage, languages, setLanguage } = useLanguage();

  if (!currentLanguage || languages.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 px-0">
          {currentLanguage.flag_icon && (
            <Image
              src={`/images/flags/${currentLanguage.flag_icon}`}
              alt={currentLanguage.name}
              width={24}
              height={24}
              className="rounded-sm"
            />
          )}
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language)}
            className={`flex items-center gap-2 ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            {language.flag_icon && (
              <Image
                src={`/images/flags/${language.flag_icon}`}
                alt={language.name}
                width={20}
                height={20}
                className="rounded-sm"
              />
            )}
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
