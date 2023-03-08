import axios from 'axios';
import { useToast, FlatList } from 'native-base';
import { useState, useEffect } from 'react';

import { api } from '../services/api';
import { Game, GameProps } from './../components/Game';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Loading } from './Loading';
interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondyTeamPoints, setSecondyTeamPoints] = useState('');
  const toast = useToast();
  async function fetchGames() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/pools/${poolId}/games`);
      console.log(data);
      setGames(data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondyTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite ',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      console.log(`/pools/${poolId}/games/${gameId}/guesses`);
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondyTeamPoints),
      });
      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.300',
      });
      fetchGames();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return toast.show({
          title: error.response?.data.message,
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      toast.show({
        title: 'Não foi possivel enviar o palpite ',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }
  useEffect(() => {
    fetchGames();
  }, [poolId]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondyTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
    />
  );
}
