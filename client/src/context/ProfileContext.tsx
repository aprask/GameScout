import { createContext, useContext, useState, useEffect, JSX } from 'react';

interface ProfileContextType {
    profileName: string | null;
    profilePicture: string | null;
    setProfileName: (name: string | null) => void;
    setProfilePicture: (pic: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName'));
    const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture'));

    useEffect(() => {
        localStorage.setItem('profileName', profileName ?? '');
    }, [profileName]);

    useEffect(() => {
        localStorage.setItem('profilePicture', profilePicture ?? '');
    }, [profilePicture]);


    return (
        <ProfileContext.Provider value={{ profileName, profilePicture, setProfileName, setProfilePicture }}>
            {children}
        </ProfileContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(): ProfileContextType {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
}
