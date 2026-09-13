"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { ensureUserProfile, getUserProfile } from "@/lib/data/users";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Modo demonstração (sem Firebase configurado): não há sessão para
  // resolver, então já nasce "não carregando" — evita setState síncrono
  // dentro do efeito abaixo.
  const [loading, setLoading] = useState(() => Boolean(getFirebaseAuth()));

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await getUserProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    setProfile(p);
  };

  const requireAuth = () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error(
        "Autenticação indisponível: configure as variáveis NEXT_PUBLIC_FIREBASE_* para habilitar login."
      );
    }
    return auth;
  };

  const login = async (email: string, password: string) => {
    const auth = requireAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const auth = requireAuth();
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await ensureUserProfile({
      uid: credential.user.uid,
      name: credential.user.displayName ?? "",
      email: credential.user.email ?? "",
    });
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const auth = requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await ensureUserProfile({ uid: credential.user.uid, name, email, phone });
    await refreshProfile();
  };

  const logout = async () => {
    const auth = requireAuth();
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    const auth = requireAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isDemoMode: !isFirebaseConfigured,
      login,
      loginWithGoogle,
      signup,
      logout,
      resetPassword,
      refreshProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
