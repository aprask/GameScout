import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import axios from 'axios';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [validSession, setValidSession] = useState(true);

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;


  useEffect(() => {
    const verifySession = async () => {
      try {
        await axios.get(`${baseUrl}/api/v1/auth/me`, { // pinging to see if we can access the /me endpoint, else we are unauthorized (401)
          withCredentials: true
        });
        setValidSession(true);
      } catch (err) {
        console.log(err);
        console.warn("Stale or invalid session. Redirecting to login.");
        setValidSession(false);
        logout?.();
      } finally {
        setSessionChecked(true);
      }
    };

    verifySession();
  }, []);

  if (!sessionChecked) return null;

  if (!isAuthenticated || !validSession) return <Navigate to="/login" replace />;
  return (
    <>
      {children}
    </>
  );
}
