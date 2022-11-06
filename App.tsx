import {NativeBaseProvider, StatusBar} from 'native-base'
import {THEME} from './src/styles/theme'
import { Loading } from './src/components/Loading';
import {useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_500Medium} from '@expo-google-fonts/roboto'
import { SingIn } from './src/screens/SingIn';
export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium
  })
 
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
      barStyle='light-content'
      backgroundColor='transparent'
      translucent
      />
      {
        fontsLoaded ? <SingIn/>: <Loading/> 
      }
      
     
    </NativeBaseProvider>
  );
}

