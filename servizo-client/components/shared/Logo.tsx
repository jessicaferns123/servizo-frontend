'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
        <div className="flex shrink-0 items-center">
            <img className="h-12 rounded-md w-auto" src="/servizo_logo.png" alt="Servizo" />
            <div className="ml-1 text-3xl font-medium">Servizo</div>
        </div>
    </Link>
  );
}
