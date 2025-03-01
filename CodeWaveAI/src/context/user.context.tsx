// UserContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';


const UserContext = createContext<{ }>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(''); // Initialize with null

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);