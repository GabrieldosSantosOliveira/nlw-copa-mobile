import React, { createContext } from 'react';

interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
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
  const singIn = async () => {
    console.log('Vamos Logar');
  };
  return (
    <AuthContext.Provider
      value={{
        singIn,
        user: {
          name: 'Gabriel',
          avatarUrl:
            'https://github.com/GabrieldosSantosOliveira.png'
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
