import { Suspense } from 'react';
import UserFormPage from './UserFormPage';

// UserFormPage reads the query string with useSearchParams(), so it needs a Suspense
// boundary for the route to be prerendered.
export default function ManageUsersTabPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserFormPage />
    </Suspense>
  );
}
