import { useNavigation } from '@react-navigation/native';
import { Heading, VStack, useToast } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/api';
import Logo from './../assets/logo.svg';
export const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const { navigate } = useNavigation();
  const toast = useToast();
  const handleJoinPool = async () => {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        return toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      await api.post('/pools/join', { code });
      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.300'
      });
      navigate('pools');
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (
        error.response?.data?.message === 'Pool not found'
      ) {
        return toast.show({
          title: 'Bolão não encontrado',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      if (
        error.response?.data?.message ===
        'Already joined this pool'
      ) {
        return toast.show({
          title: 'Você já está neste bolão',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      toast.show({
        title: 'Não foi possivel encontrar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  };
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {'\n'} seu código
          único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
};
