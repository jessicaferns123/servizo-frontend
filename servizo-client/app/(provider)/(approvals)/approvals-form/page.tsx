import { Suspense } from 'react';
import ApprovalsForm from './ApprovalsForm';

// ApprovalsForm reads the query string with useSearchParams(), so it needs a Suspense
// boundary for the route to be prerendered.
export default function ApprovalsFormPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ApprovalsForm />
    </Suspense>
  );
}
