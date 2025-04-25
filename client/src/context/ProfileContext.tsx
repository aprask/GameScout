import { createContext, useContext, useState, useEffect, JSX } from 'react';

interface ProfileContextType {
    profileName: string | null;
    profileImage: string | null;
    profileBannerImage: string | null;
    setProfileName: (name: string | null) => void;
    setProfileImage: (name: string | null) => void;
    setProfileBannerImage: (name: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName'));
    const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profileImage'));
    const [profileBannerImage, setProfileBannerImage] = useState(() => localStorage.getItem('profileBanner'));

    useEffect(() => {
        localStorage.setItem('profileName', profileName ?? '');
    }, [profileName]);

    useEffect(() => {
        localStorage.setItem('profileImage', profileImage ?? '')
    }, [profileImage]);
    
    useEffect(() => {
        localStorage.setItem('profileBannerImage', profileBannerImage ?? '')
    }, [profileBannerImage]);
    

    return (
        <ProfileContext.Provider value={{ profileName, setProfileName, profileImage, setProfileImage, setProfileBannerImage, profileBannerImage}}>
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
