import { createContext, useContext, useState, JSX } from 'react';
import axios from "axios";

interface AuthContextType {
    userId: string | null;
    profileId: string | null;
    userEmail: string | null;
    isAdmin: boolean;
    adminId: string | null;
    isAuthenticated: boolean;
    login: (email: string, userId: string, profileId: string, isAdmin: boolean, adminId: string) => void;
    logout: () => void;
}

const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
? `${import.meta.env.VITE_PROD_URL}`
: `${import.meta.env.VITE_DEV_URL}`;
  
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider( { children }: { children: React.ReactNode } ): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const stored = localStorage.getItem('isAuthenticated');
        return stored === 'true'; 
    });
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
    const [profileId, setProfileId] = useState(() => localStorage.getItem('profileId'));
    const [adminId, setAdminId] = useState(() => localStorage.getItem('adminId'));
    const [isAdmin, setIsAdmin] = useState(false);
    
    function login(email: string, userId: string, profileId: string, isAdmin: boolean, adminId: string) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('profileId', profileId);
        localStorage.setItem('adminId', adminId);
        localStorage.setItem('isAuthenticated', 'true');
        setUserEmail(email);
        setUserId(userId);
        setProfileId(profileId);
        setIsAdmin(isAdmin);
        setAdminId(adminId);
        setIsAuthenticated(true);
    }
    
    async function logout() {
        const res = await axios.post(
        `${baseUrl}/api/v1/auth/logout`,
            null,
            {
                withCredentials: true
            }
        );
        if (res.status !== 204) {
            console.log("Failed to logout");
            return;
        }
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('profileId');
        localStorage.removeItem("adminId");
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('profileName');
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserId(null);
        setProfileId(null);
        setIsAdmin(false);
        setAdminId(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, profileId, isAdmin, adminId, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}