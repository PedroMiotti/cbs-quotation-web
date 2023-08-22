import { Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import ProductCard from "./ProductCard";

interface Card {
    id: number;
    title: string
}

interface QuotationLaneProps {
  id: number;
  title: string;
  items: Card[];
}

const QuotationLane = ({ id, title, items }: QuotationLaneProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Flex flex="3" padding="5" flexDirection="column" minH="10rem">
      <Text fontWeight="bold">{title}</Text>
      <Flex
        ref={setNodeRef}
        backgroundColor="gray.200"
        borderRadius="8"
        flex="1"
        padding="2"
        flexDirection="column"
      >
        {items.map(({ title: cardTitle, id }, key) => (
          <ProductCard id={id} title={cardTitle} key={key} index={key} parent={title} />
        ))}
      </Flex>
    </Flex>
  );
}

export default QuotationLane;