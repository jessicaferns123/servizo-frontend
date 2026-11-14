'use client';

import { useCart } from '@/context/CartContext'; // adjust path if needed
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export const CartButton = () => {
  const { totalItems } = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push('/cart'); // adjust path if you use a different route
  };

  return (
    <Button
      variant="ghost"
      className="relative p-2 hover:bg-muted rounded-full cursor-pointer"
      onClick={handleClick}
    >
      <ShoppingCart className="h-6 w-6 text-primary" />
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};
