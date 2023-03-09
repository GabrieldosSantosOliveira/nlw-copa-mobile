import AsyncStorage from '@react-native-async-storage/async-storage';
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
  isLoadingUserInStorage: boolean;
  singIn: () => Promise<void>;
}
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthContext = createContext({} as AuthContextDataProps);
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isLoadingUserInStorage, setIsLoadingUserInStorage] = useState(true);
  const loadingUserInStorage = async () => {
    try {
      const tokenInStorage = await AsyncStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(
        tokenInStorage,
      )}`;
      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data.user);
    } catch (error) {
      await AsyncStorage.removeItem('token');
    } finally {
      setIsLoadingUserInStorage(false);
    }
  };
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
      await AsyncStorage.setItem(
        'token',
        JSON.stringify(tokenResponse.data.token),
      );
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
    loadingUserInStorage();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoadingUserInStorage,
        singIn,
        isUserLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
