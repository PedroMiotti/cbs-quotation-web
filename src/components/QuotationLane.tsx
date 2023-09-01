import {
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import ProductCard from "./ProductCard";
import { EditIcon } from "@chakra-ui/icons";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { Composition, CompositionItem } from "../types/Composition";
import { formatToBrlCurrency } from "../utils/formatCurrency";

interface QuotationLaneProps {
  id: number;
  title: string;
  composition: Composition;
  items: CompositionItem[];
  activeItem?: CompositionItem;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAddItem: (id: number) => void;
}

const QuotationLane = ({
  id,
  title,
  items,
  composition,
  activeItem,
  handleDelete,
  handleEdit,
  handleAddItem,
}: QuotationLaneProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  // Todo - fix overflow on lane

  const subtotal = items.reduce((acc, item) => {
    const currentPrice =
      item?.Product?.ProductPrice?.find((price) => price.is_current)?.price ?? 0;

    return acc + currentPrice * item.quantity;
  }
  , 0);

  return (
    <Flex
      flex="3"
      padding="5"
      flexDirection="column"
      maxHeight="600px"
      minH="80%"
      minW="450px"
    >
      <Flex
        ref={setNodeRef}
        backgroundColor="#f8f8f8"
        borderRadius="8"
        flex="1"
        padding="6"
        flexDirection="column"
        // overflowY="auto"
        // gridAutoRows="max-content"
        // overflow="hidden"
      >
        <Flex align="center" justifyContent="space-between" mb={4}>
          <Flex align="baseline" gap={2}>
            <Text
              fontWeight="semibold"
              fontSize="20px"
              fontFamily="Inter, sans-serif"
            >
              {title}
            </Text>
            <Text
              fontWeight="normal"
              fontSize="sm"
              color="#9D9D9D"
              fontFamily="Inter, sans-serif"
            >
              {items.length}
            </Text>
          </Flex>
          <Flex>
            <IconButton
              aria-label="edit composition"
              bg="transparent"
              onClick={() => handleAddItem(id)}
              icon={<AiOutlinePlusCircle />}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots />}
                bg="transparent"
              />
              <MenuList>
                <MenuItem onClick={() => handleEdit(id)} icon={<EditIcon />}>
                  Editar
                </MenuItem>
                <MenuItem
                  onClick={() => handleDelete(id)}
                  icon={<AiOutlineDelete fontSize="15px" />}
                >
                  Excluir
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <ul role="application">
          {items.map(({ Product, product_id: itemId, quantity }, key) => (
            <ProductCard
              id={itemId}
              product={Product}
              quantity={quantity}
              key={key}
              index={key}
              parent={id}
            />
          ))}
          <Flex
            onClick={() => handleAddItem(id)}
            padding="4"
            backgroundColor="white"
            align="center"
            justifyContent="center"
            margin="2"
            gap={3}
            borderRadius={"13px"}
            _hover={{ cursor: "pointer", bg: "#f8f8f8" }}
          >
            <Text fontSize="lg" fontWeight="600" color="gray.500">
              <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Adicionar
              produto
            </Text>
          </Flex>
        </ul>
        {/* <DragOverlay>
          {activeItem ? (
            <ProductCard
              id={activeItem.id}
              title={activeItem.name}
              index={0}
              parent={id}
            />
          ) : null}
        </DragOverlay> */}
      </Flex>
      <Divider />
      <Flex backgroundColor="#f8f8f8" borderRadius="8" px={6} py={3}>
        <Text fontSize="lg" fontWeight="600" mt={4}>
          Total
        </Text>

        <Text fontSize="lg" fontWeight="600" mt={4} ml="auto">
          {formatToBrlCurrency((subtotal * (composition.margin / 100)) + subtotal )}
        </Text>
      </Flex>
    </Flex>
  );
};

export default QuotationLane;
