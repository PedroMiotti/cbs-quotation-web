import { EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  FocusLock,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AiOutlineDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { Product } from "../types/Product";
import { formatToBrlCurrency } from "../utils/formatCurrency";
import { useRef } from "react";
import { Form } from "react-router-dom";
import React from "react";

const ProductCard = ({
  id,
  product,
  index,
  parent,
  quantity,
}: {
  id: number;
  product: Product;
  index: number;
  parent: number;
  quantity: number;
}) => {
  const [name, setName] = React.useState("")
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      product,
      index,
      parent,
    },
  });
  const { onOpen, onClose, isOpen } = useDisclosure();

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const currentPrice =
    product?.ProductPrice?.find((price) => price.is_current)?.price ?? 0;

  return (
    <Flex
      padding="4"
      backgroundColor="white"
      margin="2"
      borderRadius="8"
      direction="column"
      gap={3}
      transform={style.transform}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <Flex align="center" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="600">
          {product.name} {product?.Brand?.name} {product.weight}
        </Text>

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
            />
          </PopoverTrigger>
          <PopoverContent p={5}>
              <PopoverArrow />
              <PopoverCloseButton />
              <EditProductPopover props={{ value: name, onChange: (e) => setName(e.target.value) }}/>
          </PopoverContent>
        </Popover>
      </Flex>

      <Flex justify="space-between" align="center" px={1}>
        <Text fontSize="sm" fontWeight="600">
          {formatToBrlCurrency(currentPrice)}
        </Text>
        <Text fontSize="sm" color="#9D9D9D">
          {quantity} un
        </Text>
      </Flex>
    </Flex>
  );
};

interface EditProductPopoverProps {
  ref: HTMLInputElement;
  props: InputProps;
}

const EditProductPopover = React.forwardRef(({props, ref}: EditProductPopoverProps) => {
  return (
    <FormControl>
      <FormLabel htmlFor="product-name">Nome</FormLabel>
      <Input ref={ref} id="product-name" {...props} />
    </FormControl>
  )
})

export default ProductCard;
