import React, { useState, useMemo, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import SearchTable from "../../components/SearchTable";
import { Card, CardBody } from "@chakra-ui/card";
import {
  Button,
  Flex,
  useColorModeValue,
  useToast,
  Text,
  useDisclosure,
  Stack,
  Icon,
  Box,
  Input,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../../components/Modal";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
  name: string;
}

interface Brands {
  id: number;
  name: string;
  createdAt: string;
  action?: React.ReactElement;
}

const Actions = ({ item }: { item: Brands }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Stack cursor={"pointer"} onClick={onOpen} direction={"row"}>
        <Button bg={"#83B735"} color={"#FFFFFF"}>
          Editar
        </Button>
      </Stack>
    </>
  );
};

const data: Brands[] = [
  {
    id: 1,
    name: "Solito",
    createdAt: "10/08/2022",
  },
  {
    id: 2,
    name: "Bauducco",
    createdAt: "10/08/2022",
  },
  {
    id: 3,
    name: "Milka",
    createdAt: "10/08/2022",
  },
];

const columnHelper = createColumnHelper<Brands>();

const Brands = () => {
  const [pageCount, setPageCount] = useState(0);
  const [isUsersRequestPending, setIsUsersRequestPending] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const toast = useToast();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info: any) => info.getValue(),
        header: "ID",
      }),
      columnHelper.accessor("name", {
        cell: (info: any) => info.getValue(),
        header: "NOME",
      }),
      columnHelper.accessor("createdAt", {
        cell: (info: any) => info.getValue(),
        header: "CRIADO EM",
      }),
      columnHelper.accessor("action", {
        cell: (info: any) => {
          const item = info.row.original;
          return <Actions item={item} />;
        },
        header: "AÇÃO",
      }),
    ],
    []
  );

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    onClose();
    reset();
  };

  return (
    <Flex direction="column">
      <Flex
        direction={{ sm: "column", md: "row" }}
        justify="space-between"
        align="center"
        w="100%"
        mb="20px"
        px={5}
      >
        <Text fontSize={"2xl"} fontWeight={"semibold"}>
          Marcas
        </Text>
        <Button
          variant="outline"
          fontSize="sm"
          bg={"#83B735"}
          color={"#FFFFFF"}
          _hover={{ bg: "#96c255" }}
          onClick={onOpen}
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova Marca
        </Button>
      </Flex>
      <SearchTable
        loading={isUsersRequestPending}
        columns={columns}
        data={data}
        totalCount={data.length}
        fetchPaginatedData={async () => console.log("teste")}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Criar marca"
        textButton="Criar"
        onSubmit={handleSubmit(onSubmit)}
      >
        <form>
          <Box>
            <Text mb="8px">Nome</Text>
            <Input
              {...register("name", { required: true })}
              placeholder="Ex: Solito"
              focusBorderColor="#83B735"
            />
            {errors.name && (
              <p style={{ color: "red", marginTop: "3px" }}>
                Nome da marca é obrigatório
              </p>
            )}
          </Box>
        </form>
      </Modal>
    </Flex>
  );
};

export default Brands;
