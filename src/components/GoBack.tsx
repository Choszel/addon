import { HStack, Text } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";

interface Props {
  goBack: () => void;
  margin?: string;
  width?: string;
}

const GoBack = ({ goBack, margin, width }: Props) => {
  return (
    <HStack marginY={margin} width={width} onClick={goBack} cursor="pointer">
      <LuArrowLeft size={32} />
      <Text
        textTransform="uppercase"
        className="product_list_text_main"
        marginX="5%"
      >
        Powrót
      </Text>
    </HStack>
  );
};

export default GoBack;
