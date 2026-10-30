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
import { ensureUserProfile, getUserProfile, recordLogin } from "@/lib/data/users";
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

/**
 * Garante que todo usuário autenticado tenha documento em `users`. Sem
 * isso, contas que entram por e-mail/senha sem perfil gravado (criadas no
 * console do Firebase ou cujo cadastro falhou no meio) nunca apareciam no
 * painel administrativo para aprovação.
 */
async function loadOrCreateProfile(firebaseUser: User) {
  const existing = await getUserProfile(firebaseUser.uid);
  if (existing) return existing;
  try {
    await ensureUserProfile({
      uid: firebaseUser.uid,
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
    });
  } catch (err) {
    console.error("Não foi possível criar o perfil do usuário", err);
  }
  return getUserProfile(firebaseUser.uid);
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
      if (firebaseUser) {
        const p = await loadOrCreateProfile(firebaseUser);
        // Usuário e perfil são publicados juntos para que as rotas
        // protegidas nunca vejam uma sessão sem perfil resolvido.
        setUser(firebaseUser);
        setProfile(p);
        recordLogin(firebaseUser.uid); // melhor esforço, não bloqueia a UI
      } else {
        setUser(null);
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
    // O perfil é criado pelo listener de sessão (loadOrCreateProfile).
    await signInWithPopup(auth, provider);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const auth = requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await ensureUserProfile({ uid: credential.user.uid, name, email, phone });
    setProfile(await getUserProfile(credential.user.uid));
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
