import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, HStack, Box, useTheme } from 'native-base';

import { ButtonIcon } from './ButtonIcon';

interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  onShare?: () => void;
}

export function Header({
  title,
  showBackButton = false,
  showShareButton = false,
  onShare,
}: Props) {
  const { colors, sizes } = useTheme();
  const { navigate } = useNavigation();
  const EmptyBoxSpace = () => <Box w={6} h={6} />;

  return (
    <HStack
      w="full"
      h={24}
      bgColor="gray.800"
      alignItems="flex-end"
      pb={5}
      px={5}
    >
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {showBackButton ? (
          <ButtonIcon
            icon={
              <AntDesign
                name="caretleft"
                color={colors.gray[300]}
                size={sizes[6]}
              />
            }
            onPress={() => navigate('pools')}
          />
        ) : (
          <EmptyBoxSpace />
        )}

        <Text
          color="white"
          fontFamily="medium"
          fontSize="md"
          textAlign="center"
        >
          {title}
        </Text>

        {showShareButton ? (
          <ButtonIcon
            icon={
              <MaterialCommunityIcons
                name="export-variant"
                color={colors.gray[300]}
                size={sizes[6]}
              />
            }
            onPress={onShare}
          />
        ) : (
          <EmptyBoxSpace />
        )}
      </HStack>
    </HStack>
  );
}
