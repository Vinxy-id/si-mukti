'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PENGRAJIN_PROFILE } from './api-client';

export type UserRole = 'guest' | 'pengrajin' | 'offtaker' | 'regulator_pemkab';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string;
  workshop?: {
    id: string;
    name: string;
    paguyubanId: string;
    subdistrict: string;
    village: string;
    sniStatus: string;
  };
  offtaker?: {
    id: string;
    name: string;
    industryType: string;
    subdistrict: string;
  };
  wallet?: {
    currentBalance: number;
    bankName: string;
    bankAccountNumber: string;
  };
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  role: UserRole;
  loginAs: (role: 'pengrajin' | 'offtaker' | 'regulator_pemkab') => void;
  loginWithPhone: (phoneNumber: string, otpCode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
}

const DEMO_PROFILES: Record<'pengrajin' | 'offtaker' | 'regulator_pemkab', UserProfile> = {
  pengrajin: {
    id: DEFAULT_PENGRAJIN_PROFILE.userId,
    fullName: DEFAULT_PENGRAJIN_PROFILE.fullName,
    phoneNumber: DEFAULT_PENGRAJIN_PROFILE.phoneNumber,
    role: 'pengrajin',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    workshop: {
      id: DEFAULT_PENGRAJIN_PROFILE.workshop.id,
      name: DEFAULT_PENGRAJIN_PROFILE.workshop.name,
      paguyubanId: DEFAULT_PENGRAJIN_PROFILE.workshop.paguyubanId,
      subdistrict: DEFAULT_PENGRAJIN_PROFILE.workshop.subdistrict,
      village: DEFAULT_PENGRAJIN_PROFILE.workshop.village,
      sniStatus: DEFAULT_PENGRAJIN_PROFILE.workshop.sniStatus,
    },
    wallet: {
      currentBalance: DEFAULT_PENGRAJIN_PROFILE.wallet.currentBalance,
      bankName: DEFAULT_PENGRAJIN_PROFILE.wallet.bankName,
      bankAccountNumber: DEFAULT_PENGRAJIN_PROFILE.wallet.bankAccountNumber,
    },
  },
  offtaker: {
    id: '22222222-2222-2222-2222-222222222222',
    fullName: 'Ir. Hendro Wijaya',
    phoneNumber: '081234567802',
    role: 'offtaker',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    offtaker: {
      id: 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'PT Sentosa Teraso & Paving',
      industryType: 'Paving Block & Tegel Karst',
      subdistrict: 'Campurdarat',
    },
  },
  regulator_pemkab: {
    id: '33333333-3333-3333-3333-333333333333',
    fullName: 'Drs. Tri Wahyudi, M.Si',
    phoneNumber: '081234567803',
    role: 'regulator_pemkab',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'si_mukti_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Ambil state session dari localStorage saat client-side mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      }
    } catch {
      // Abaikan jika localStorage tidak dapat diakses
    }
  }, []);

  const loginAs = (role: 'pengrajin' | 'offtaker' | 'regulator_pemkab') => {
    const selectedProfile = DEMO_PROFILES[role];
    setUser(selectedProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProfile));
    } catch {}
    setIsLoginModalOpen(false);
  };

  const loginWithPhone = async (phoneNumber: string, otpCode: string): Promise<{ success: boolean; message?: string }> => {
    // Verifikasi standar PRD v1.0 (OTP '123456' untuk bypass simulasi atau nomor terdaftar)
    if (otpCode !== '123456' && otpCode !== '000000') {
      return { success: false, message: 'Kode OTP tidak valid (Gunakan kode demo: 123456)' };
    }

    // Default ke pengrajin jika nomor cocok atau umum
    const profile: UserProfile = {
      ...DEMO_PROFILES.pengrajin,
      phoneNumber,
    };
    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {}
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const value: AuthContextType = {
    user: isMounted ? user : null,
    isLoggedIn: isMounted ? Boolean(user) : false,
    role: (isMounted && user ? user.role : 'guest'),
    loginAs,
    loginWithPhone,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
