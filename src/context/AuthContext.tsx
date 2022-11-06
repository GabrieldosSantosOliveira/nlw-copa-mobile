import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, {
  createContext,
  useState,
  useEffect
} from 'react';
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
export const AuthContext = createContext(
  {} as AuthContextDataProps
);
export const AuthContextProvider = ({
  children
}: AuthProviderProps) => {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps>(
    {} as UserProps
  );
  const [request, response, promptAsync] =
    Google.useAuthRequest({
      clientId:
        '288331783256-vj9ga45t4otb3b7fdirhab406ccojo6f.apps.googleusercontent.com',
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true
      }),
      scopes: ['profile', 'email']
    });
  const singInWithGoogle = async (access_token: string) => {
    console.log('\n\n\n\n\n\n' + access_token);
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
    if (
      response?.type === 'success' &&
      response.authentication?.accessToken
    ) {
      singInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);
  return (
    <AuthContext.Provider
      value={{
        singIn,
        isUserLoading,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
