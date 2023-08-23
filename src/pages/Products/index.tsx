import React, { useState, useMemo } from "react";
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
} from "@chakra-ui/react";

interface Products {
  id: number;
  name: string;
  brand: string;
  price: string;
  status: string;
  createdAt: string;
  action?: React.ReactElement;
}

const Actions = ({ item }: { item: Products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Stack cursor={"pointer"} onClick={onOpen} direction={"row"}>
        <Button bg={"#83B735"} color={"#FFFFFF"}>
          Editar
        </Button>
        <Button bg={"#B9B9B9"} color={"#FFFFFF"}>
          Inativar
        </Button>
      </Stack>
    </>
  );
};

const data: Products[] = [
  {
    id: 1,
    name: "Arroz Branco",
    brand: "Solito",
    price: "R$10,20",
    status: "Ativo",
    createdAt: "10/08/2022",
  },
  {
    id: 2,
    name: "Feijão Preto",
    brand: "Solito",
    price: "R$10,20",
    status: "Ativo",
    createdAt: "10/08/2022",
  },
  {
    id: 3,
    name: "Lentilha",
    brand: "Saint Paul",
    price: "R$10,20",
    status: "Ativo",
    createdAt: "10/08/2022",
  },
];

const columnHelper = createColumnHelper<Products>();

const Products = () => {
  const [pageCount, setPageCount] = useState(0);
  const [isUsersRequestPending, setIsUsersRequestPending] = useState(false);

  const toast = useToast();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "ID",
      }),
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: "NOME",
      }),
      columnHelper.accessor("brand", {
        cell: (info) => info.getValue(),
        header: "MARCA",
      }),
      columnHelper.accessor("price", {
        cell: (info) => info.getValue(),
        header: "PREÇO",
      }),
      columnHelper.accessor("status", {
        cell: (info) => info.getValue(),
        header: "STATUS",
      }),
      columnHelper.accessor("createdAt", {
        cell: (info) => info.getValue(),
        header: "CRIADO EM",
      }),
      columnHelper.accessor("action", {
        cell: (info) => {
          const item = info.row.original;
          return <Actions item={item} />;
        },
        header: "AÇÃO",
      }),
    ],
    []
  );

  return (
    <Flex direction="column">
      <Flex
        direction={{ sm: "column", md: "row" }}
        justify="space-between"
        align="center"
        w="100%"
        mb="20px"
      >
        <Text fontSize={"2xl"} fontWeight={"semibold"}>
          Produtos
        </Text>
        <Button
          variant="outline"
          fontSize="sm"
          bg={"#83B735"}
          color={"#FFFFFF"}
          _hover={{ bg: "#96c255" }}
        >
          + Novo Produto
        </Button>
      </Flex>
      <Card px="0px">
        <CardBody>
          <SearchTable
            loading={isUsersRequestPending}
            columns={columns}
            data={data}
            totalCount={data.length}
            fetchPaginatedData={async () => console.log("teste")}
          />
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Products;
