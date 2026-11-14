'use client';

import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" aria-label="Servizo home" className="flex items-center gap-2 text-xl font-bold text-primary">
        <div className="flex shrink-0 items-center">
            <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F15A29] text-white shadow-sm"
            >
                <Wrench className="h-6 w-6" strokeWidth={2.25} />
            </span>
            <div className="ml-2 text-3xl font-medium">Servizo</div>
        </div>
    </Link>
  );
}
