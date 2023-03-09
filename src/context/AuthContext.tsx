import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { createContext, useState, useEffect } from 'react';

import { api } from '../services/api';
interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  singIn: () => Promise<void>;
}
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthContext = createContext({} as AuthContextDataProps);
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const singInWithGoogle = async (access_token: string) => {
    try {
      setIsUserLoading(true);
      const tokenResponse = await api.post('/users', {
        access_token,
      });
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${tokenResponse.data.token}`;
      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data.user);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  };
  const singIn = async () => {
    try {
      setIsUserLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      singInWithGoogle(accessToken);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.CLIENT_ID_IOS,
      offlineAccess: true,
      webClientId: process.env.CLIENT_ID,
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        singIn,
        isUserLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
