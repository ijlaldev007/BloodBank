import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


interface AuthContextProps {
    user: any;
    role: string | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextProps>({
    user: null,
    role: null,
    loading: true
});


// Custom hook for easy access

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setRole(userSnap.data().role);
                }
                else {
                    setRole(null);
                }
            }
            else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);

        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user, role, loading}}>
            {children}
        </AuthContext.Provider>
    )

};