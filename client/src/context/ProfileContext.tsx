import { createContext, useContext, useState, useEffect, JSX } from 'react';

export interface WishListType {
    wishlistId: string;
    gameId: string;
}

interface ProfileContextType {
    profileName: string | null;
    profilePicture: string | null;
    wishlist: WishListType[];
    setProfileName: (name: string | null) => void;
    setProfilePicture: (pic: string | null) => void;
    setWishlist: (wishlist: WishListType[]) => void;
}

const defaultWishlist: WishListType = {
    wishlistId: '',
    gameId: '',
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName'));
    const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture'));
    const [wishlist, setWishlist] = useState(() => {
        const stored = sessionStorage.getItem('wishlist');
        return stored ? JSON.parse(stored) : defaultWishlist;
    });

    useEffect(() => {
        localStorage.setItem('profileName', profileName ?? '');
    }, [profileName]);

    useEffect(() => {
        localStorage.setItem('profilePicture', profilePicture ?? '');
    }, [profilePicture]);

    useEffect(() => {
        sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    return (
        <ProfileContext.Provider value={{ profileName, profilePicture, wishlist, setProfileName, setProfilePicture, setWishlist }}>
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
