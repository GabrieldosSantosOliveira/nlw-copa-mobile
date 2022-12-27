import { useRoute } from '@react-navigation/native';
import { VStack, useToast, HStack } from 'native-base';
import { useState, useEffect } from 'react';
import { Share } from 'react-native';

import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolHeader } from '../components/PoolHeader';
import { api } from '../services/api';
import { EmptyMyPoolList } from './../components/EmptyMyPoolList';
import { PoolCardProps } from './../components/PoolCard';
interface RouteParams {
  id: string;
}
export const Details = () => {
  const [optionSelected, setOptionSelected] = useState<
    'guesses' | 'ranking'
  >('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] =
    useState<PoolCardProps>({} as PoolCardProps);
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  async function fetchPoolsDetails() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/pools/${id}`);
      setPoolDetails(data.pool);
    } catch (error) {
      toast.show({
        title:
          'Não foi possivel carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'green.300'
      });
    } finally {
      setIsLoading(false);
    }
  }
  function handleCodeShare() {
    Share.share({
      message: poolDetails.code
    });
  }
  useEffect(() => {
    fetchPoolsDetails();
  }, [id]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />
          <HStack
            p={1}
            bgColor="gray.800"
            rounded="sm"
            mb={5}
          >
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses
            poolId={poolDetails.id}
            code={poolDetails.code}
          />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
};
