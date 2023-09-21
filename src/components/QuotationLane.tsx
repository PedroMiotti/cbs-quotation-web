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
import {
  DragOverlay,
  useDroppable,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import ProductCard from "./ProductCard";
import { EditIcon } from "@chakra-ui/icons";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { Composition, CompositionItem } from "../types/Composition";
import { formatToBrlCurrency } from "../utils/formatCurrency";
import { useEffect } from "react";
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface QuotationLaneProps {
  id: string;
  title: string;
  composition: Composition;
  items: CompositionItem[];
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAddItem: (id: number) => void;

  setData: (data: any) => void;
}

const QuotationLane = ({
  id,
  title,
  items,
  composition,
  handleDelete,
  handleEdit,
  handleAddItem,
  setData,
}: QuotationLaneProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const subtotal = items.reduce((acc, item) => {
    const currentPrice =
      item?.Product?.ProductPrice?.find((price) => price.is_current)?.price ??
      0;

    return acc + currentPrice * item.quantity;
  }, 0);


  const compositionId = parseInt(id.split(":")[1]);

  return (
    <>
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <Flex
        flex="3"
        padding="5"
        flexDirection="column"
        minW="450px"
        ref={setNodeRef}
      >
        <Flex
          backgroundColor="#f8f8f8"
          borderRadius="8"
          flex="1"
          padding="6"
          flexDirection="column"
          overflow={"scroll"}
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
                onClick={() => handleAddItem(compositionId)}
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
                  <MenuItem onClick={() => handleEdit(compositionId)} icon={<EditIcon />}>
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDelete(compositionId)}
                    icon={<AiOutlineDelete fontSize="15px" />}
                  >
                    Excluir
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          <Flex overflowX="hidden" direction="column">
            <ul style={{ listStyle: "none" }} role="application">
              {items.map(({ Product, id: itemId, quantity }, key) => (
                <ProductCard
                  setData={setData}
                  id={itemId}
                  product={Product}
                  quantity={quantity}
                  key={key}
                  index={key}
                  parent={id}
                />
              ))}
              <Flex
                onClick={() => handleAddItem(compositionId)}
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
                  <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" />{" "}
                  Adicionar produto
                </Text>
              </Flex>
            </ul>
          </Flex>
        </Flex>

        <Divider />

        <Flex backgroundColor="#f8f8f8" borderRadius="8" px={6} py={3}>
          <Text fontSize="lg" fontWeight="600" mt={4}>
            Total
          </Text>

          <Text fontSize="lg" fontWeight="600" mt={4} ml="auto">
            {formatToBrlCurrency(
              subtotal * (composition.margin / 100) + subtotal
            )}
          </Text>
        </Flex>
      </Flex>
    </SortableContext>
    </>
  );
};

export default QuotationLane;
