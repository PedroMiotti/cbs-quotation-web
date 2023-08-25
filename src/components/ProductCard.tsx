import { EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AiOutlineDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";

const ProductCard = ({
  id,
  title,
  index,
  parent,
}: {
  id: number;
  title: string;
  index: number;
  parent: number;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      title,
      index,
      parent,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

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
          {title}
        </Text>
        {/* Todo: fix menu (not showing) */}
        <Menu >
          <MenuButton
            as={IconButton}
            
            icon={<BsThreeDots />}
            bg="transparent"
          />
            
          <MenuList>
            <MenuItem icon={<EditIcon />}>Editar</MenuItem>
            <MenuItem icon={<AiOutlineDelete fontSize="15px" />}>
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Flex gap={2}>
        <Tag>Solito</Tag>
        <Tag>500gr</Tag>
      </Flex>

      <Flex justify="space-between" align="center" px={1}>
        <Text fontSize="sm" fontWeight="600">
          R$ 2,50
        </Text>
        <Text fontSize="sm" color="#9D9D9D">
          10 un
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProductCard;
