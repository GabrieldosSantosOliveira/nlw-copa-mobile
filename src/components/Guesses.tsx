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
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const toast = useToast();
  async function fetchGames() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/pools/${poolId}/games`);
      setGames(data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite ',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.300',
      });
      fetchGames();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response.data.message ===
          'You cannot send guesses after the game date.'
        ) {
          return toast.show({
            title: 'Você não pode enviar palpites após a data do jogo.',
            placement: 'top',
            bgColor: 'red.500',
          });
        }
      }
      toast.show({
        title: 'Não foi possível enviar o palpite ',
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
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          defaultFirstTeamPoints={item?.guess?.firstTeamPoints?.toString()}
          defaultSecondTeamPoints={item?.guess?.secondTeamPoints?.toString()}
        />
      )}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
    />
  );
}
