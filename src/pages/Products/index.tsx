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
  Icon,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Product } from "../../types/Product";

const Actions = ({ item }: { item: Product }) => {
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

const data: Product[] = [
  {
    id: 1,
    name: "Arroz Branco",
    brand_id: 1,
    brand: { id: 1, name: "Solito" },
    prices: [{ id: 1, price: 10.2, product_id: 1 }],
    created_at: "10/08/2022",
    weight: "500gr",
  },
  {
    id: 2,
    name: "Feijão Preto",
    brand_id: 1,
    brand: { id: 1, name: "Solito" },
    prices: [{ id: 1, price: 10.2, product_id: 1 }],
    created_at: "10/08/2022",
    weight: "1kg",
  },
  {
    id: 3,
    name: "Lentilha",
    brand_id: 1,
    brand: { id: 2, name: "Saint Paul" },
    prices: [{ id: 1, price: 10.2, product_id: 1 }],
    created_at: "10/08/2022",
    weight: "100gr",
  },
];

const columnHelper = createColumnHelper<Product>();

const Products = () => {
  const [pageCount, setPageCount] = useState(0);
  const [isUsersRequestPending, setIsUsersRequestPending] = useState(false);

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
      columnHelper.accessor("brand", {
        cell: (info: any) => info.getValue().name,
        header: "MARCA",
      }),
      columnHelper.accessor("prices", {
        // Todo: get current price and format
        cell: (info: any) => info.getValue()[0].price,
        header: "PREÇO",
      }),
      columnHelper.accessor("weight", {
        cell: (info: any) => info.getValue(),
        header: "PESO",
      }),
      columnHelper.accessor("created_at", {
        cell: (info: any) => info.getValue(),
        header: "CRIADO EM",
      }),
      columnHelper.display({
        id: "actions",
        header: "AÇÃO",
        cell: (info: any) => {
          const item = info.row.original;
          return <Actions item={item} />;
        },
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
        px={5}
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
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Novo Produto
        </Button>
      </Flex>
      <SearchTable
        loading={isUsersRequestPending}
        columns={columns}
        data={data}
        totalCount={data.length}
        fetchPaginatedData={async () => console.log("teste")}
      />
    </Flex>
  );
};

export default Products;
