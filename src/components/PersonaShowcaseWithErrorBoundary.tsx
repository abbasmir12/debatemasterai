/**
 * PersonaShowcaseWithErrorBoundary - Wrapped version of PersonaShowcase with error handling
 * Use this component in App.tsx to ensure errors are caught gracefully
 */

import { PersonaErrorBoundary } from './PersonaErrorBoundary';
import PersonaShowcase from './PersonaShowcase';

interface PersonaShowcaseWithErrorBoundaryProps {
  onBack: () => void;
}

/**
 * PersonaShowcase wrapped with error boundary
 * This is the component that should be imported in App.tsx
 */
export default function PersonaShowcaseWithErrorBoundary({ onBack }: PersonaShowcaseWithErrorBoundaryProps) {
  return (
    <PersonaErrorBoundary onReset={onBack}>
      <PersonaShowcase onBack={onBack} />
    </PersonaErrorBoundary>
  );
}
