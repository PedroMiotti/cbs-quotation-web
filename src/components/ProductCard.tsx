import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "../types/Product";
import { formatToBrlCurrency } from "../utils/formatCurrency";
import { useSortable } from "@dnd-kit/sortable";
import { updateItemQuantityInComposition } from "../api/Composition";
import { useState } from "react";

const ProductCard = ({
  id,
  product,
  index,
  parent,
  quantity,
  setData,
}: {
  id: number;
  product: Product;
  index: number;
  parent: string;
  quantity: number;
  setData: (data: any) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      product,
      index,
      parent,
    },
  });
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [updatedQuantity, setUpdatedQuantity] = useState(quantity);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const currentPrice =
    product?.ProductPrice?.find((price) => price.is_current)?.price ?? 0;

  const handleItemQuantityUpdate = async () => {
    if(updatedQuantity === quantity || !updatedQuantity) return;

    await updateItemQuantityInComposition(id, updatedQuantity);

    setData((prev: any) => {
      const newComposition = prev.map((composition: any) => {
        if(composition.id === parent) {
          const newCompositionItems = composition.CompositionItems.map((item: any) => {
            if(item.id === id) {
              return {
                ...item,
                quantity: updatedQuantity
              }
            }
          
            return item;
          })

          return {
            ...composition,
            CompositionItems: newCompositionItems
          }
        }

        return composition;
      })

      return newComposition;
    })

    onClose();
  }

  return (
    <Flex
      padding="4"
      backgroundColor="white"
      margin="2"
      borderRadius="8"
      direction="row"
      justify="space-between"
      overflow={"hidden"}
      gap={3}
      transform={style.transform}
      transition={style.transition}
      ref={setNodeRef}
      zIndex={isDragging ? "100" : "auto"}
      opacity={isDragging ? "0.3" : "1"}
      userSelect={"none"}
    >
      <Flex direction="column" gap={3} {...listeners} {...attributes}>
        <Flex align="center" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="600">
            {id} {product.name} {product?.Brand?.name} {product.weight}
          </Text>
        </Flex>
        <Text fontSize="sm" fontWeight="600">
          {formatToBrlCurrency(currentPrice)}
        </Text>
      </Flex>

      <Flex direction="column" justify="space-between" align="center" px={1}>
        <Popover
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
        >
          <PopoverTrigger>
            <IconButton
              size="sm"
              icon={<EditIcon />}
              aria-label={""}
              bg="transparent"
              mt="-1"
            />
          </PopoverTrigger>
          <PopoverContent p={5}>
            <PopoverArrow />

            <Flex direction="column" gap={4}>
              <Text fontSize="18px" fontWeight="600">Editar item</Text>
              <FormControl>
                <FormLabel htmlFor="product-quantity">Quantidade</FormLabel>
                <Input
                  id="product-quantity"
                  value={updatedQuantity}
                  onChange={(e: any) => setUpdatedQuantity(e.target.value)}
                />
              </FormControl>

              <Button onClick={handleItemQuantityUpdate} size="sm" w='100px' alignSelf="flex-end" bg="#83B735" color="white">
                Salvar
              </Button>
            </Flex>
          </PopoverContent>
        </Popover>
        <Text fontSize="sm" color="#9D9D9D">
          {quantity} un
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProductCard;
