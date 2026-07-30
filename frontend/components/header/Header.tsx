"use client";

import { MenuIcon } from "lucide-react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/header/LanguageSwitcher";
import SearchBar from "@/components/header/SearchBar";
import TechnologyTabs from "@/components/header/TechnologyTabs";
import type { Technology } from "@/types/technology";

interface HeaderProps {
  technologies: Technology[];
  currentTechnology: string | null;
  showSearch?: boolean;
}

export default function Header({
  technologies,
  currentTechnology,
  showSearch = true,
}: HeaderProps) {
  return (
    <header className='sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4'>
      <SheetTrigger render={<Button variant='ghost' size='icon-sm' className='md:hidden' />}>
        <MenuIcon />
        <span className='sr-only'>Toggle navigation menu</span>
      </SheetTrigger>

      <Link href='/' className='text-sm font-semibold whitespace-nowrap'>
        Interview Knowledge Base
      </Link>

      <Separator orientation='vertical' className='hidden h-6 md:block' />

      <div className='hidden md:block'>
        <TechnologyTabs technologies={technologies} currentTechnology={currentTechnology} />
      </div>

      <div className='hidden flex-1 justify-center px-2 md:flex'>
        {showSearch && <SearchBar />}
      </div>

      <div className='hidden md:block'>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
