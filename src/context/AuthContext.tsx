import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useState, useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();
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
  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
      scheme: 'nlwcopamobile',
    }),
    scopes: ['profile', 'email'],
  });
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
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  };
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      singInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);
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
