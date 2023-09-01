"use client";

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const handleAuthentication = () => {
    console.log({env: process.env.REACT_APP_PASSWORD})
    console.log(password)
    if (password === process.env.REACT_APP_PASSWORD) {
      const token = Math.random().toString(36).substr(2);
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha está incorreta, tente novamente",
        status: "error",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Bem-vindo ao Cbs Cotação
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          Se autentique para continuar
        </Text>
        <FormControl id="password">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6}>
          <Button bg={"#83B735"} color={"white"} onClick={handleAuthentication}>
            Entrar
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default Authentication;