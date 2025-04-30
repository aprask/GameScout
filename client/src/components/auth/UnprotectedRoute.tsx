import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';

export function UnprotectedRoute({ children }: { children: React.ReactNode }) {
  const {isAuthenticated} = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  else {
    return (
      <>
          {children}
      </>
    );
  }
}