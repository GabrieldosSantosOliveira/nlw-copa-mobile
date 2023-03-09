import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';

import { Loading } from '../components/Loading';
import { SingIn } from '../screens/SingIn';
import { useAuth } from './../hooks/useAuth';
import { AppRoutes } from './app.routes';
export const Routes = () => {
  const { user, isLoadingUserInStorage } = useAuth();
  if (isLoadingUserInStorage) return <Loading />;
  return (
    <Box flex={1} bgColor="gray.900">
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <SingIn />}
      </NavigationContainer>
    </Box>
  );
};
