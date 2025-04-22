import { createContext, useContext, useState, JSX } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    profileId: string | null;
    token: string | null;
    userEmail: string | null;
    isAdmin: boolean;
    adminId: string | null;
    login: (token: string, email: string, userId: string, profileId: string, isAdmin: boolean, adminId: string) => void;
    logout: () => void;
}
  
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider( { children }: { children: React.ReactNode } ): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
    const [profileId, setProfileId] = useState(() => localStorage.getItem('profileId'));
    const [adminId, setAdminId] = useState(() => localStorage.getItem('adminId'));
    const [isAdmin, setIsAdmin] = useState(false);
    
    function login(token: string, email: string, userId: string, profileId: string, isAdmin: boolean, adminId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem("profileId", profileId);
        localStorage.setItem("adminId", adminId);
        setToken(token);
        setUserEmail(email);
        setUserId(userId);
        setProfileId(profileId);
        setIsAuthenticated(true);
        setIsAdmin(isAdmin);
        setAdminId(adminId);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('profileId');
        localStorage.removeItem("adminId");
        setToken(null);
        setUserEmail(null);
        setUserId(null);
        setProfileId(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAdminId("");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, profileId, token, isAdmin, adminId, userEmail, login, logout }}>
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