import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';

import { SingIn } from '../screens/SingIn';
import { useAuth } from './../hooks/useAuth';
import { AppRoutes } from './app.routes';
export const Routes = () => {
  const { user } = useAuth();
  return (
    <Box flex={1} bgColor="gray.900">
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <SingIn />}
      </NavigationContainer>
    </Box>
  );
};
