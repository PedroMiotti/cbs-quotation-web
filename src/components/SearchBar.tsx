import React from "react";
import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

export function SearchBar(props: InputGroupProps) {
  const { ...rest } = props;

  const searchIconColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "navy.800");

  return (
    <InputGroup borderRadius="8px" w="250px" {...rest}>
      <InputLeftElement>
        <IconButton
          bg="inherit"
          borderRadius="inherit"
          _hover={{}}
          _active={{
            bg: "inherit",
            transform: "none",
            borderColor: "transparent",
          }}
          _focus={{
            boxShadow: "none",
          }}
          icon={
            <Icon as={AiOutlineSearch} color={"#83B735"} w="15px" h="15px" />
          }
          aria-label=""
        ></IconButton>
      </InputLeftElement>
      <Input
        variant="search"
        fontSize="md"
        bg={inputBg}
        placeholder="Pesquisa..."
      />
    </InputGroup>
  );
}
