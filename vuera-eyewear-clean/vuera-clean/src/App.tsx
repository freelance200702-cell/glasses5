import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthProvider, CartProvider, WishlistProvider, CompareProvider, RecentlyViewedProvider } from '@/context';

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <RecentlyViewedProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </RecentlyViewedProvider>
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
