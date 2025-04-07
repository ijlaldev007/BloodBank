import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextProps {
    user: any;
    role: string | null;
    name: string | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextProps>({
    user: null,
    role: null,
    name: null,
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = doc(db, "users", currentUser.uid);
                
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setRole(userData.role || null);
                        setName(userData.name || null);
                    } else {
                        setRole(null);
                        setName(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setRole(null);
                    setName(null);
                }
            } else {
                setUser(null);
                setRole(null);
                setName(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, name, loading }}>
            {children}
        </AuthContext.Provider>
    );
};