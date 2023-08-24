import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import { Brand } from "../../types/Brand";
import { createBrand, fetchAllBrands, updateBrand } from "../../api/Brand";

interface FormData {
  name: string;
}

const data: Brand[] = [
  {
    id: 1,
    name: "Solito",
    created_at: "10/08/2022",
  },
  {
    id: 2,
    name: "Bauducco",
    created_at: "10/08/2022",
  },
  {
    id: 3,
    name: "Milka",
    created_at: "10/08/2022",
  },
];

const columnHelper = createColumnHelper<Brand>();

const Brands = () => {
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [brandNameInputValue, setBrandNameInputValue] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

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
      columnHelper.accessor("created_at", {
        cell: (info: any) => (
          <Text>{new Date(info.getValue()).toLocaleDateString("pt-br")}</Text>
        ),
        header: "CRIADO EM",
      }),
      columnHelper.display({
        id: "action",
        cell: (info: any) => {
          const item = info.row.original;

          return (
            <Stack cursor={"pointer"} onClick={onOpen} direction={"row"}>
              <Button
                bg={"#83B735"}
                color={"#FFFFFF"}
                onClick={() => handleEditBrand(item.id)}
              >
                Editar
              </Button>
            </Stack>
          );
        },
        header: "AÇÃO",
      }),
    ],
    [brands]
  );

  const fetchBrands = useCallback(
    async (pageIndex: number, pageSize: number) => {
      setIsLoading(true);
      fetchAllBrands()
        .then((data) => {
          setBrands(data);
        })
        .finally(() => setIsLoading(false));
    },
    []
  );

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    createBrand(data)
      .then(async () => {
        toast({
          title: "Sucesso",
          description: "Marca criada com sucesso!",
          status: "success",
          position: "top-right",
        });

        await fetchBrands(0, 0);

        onClose();
        reset();
      })
      .catch((e: any) => {
        toast({
          title: "Erro",
          description: `Erro ao criar a marca, por favor contate o suporte. \n${e}`,
          status: "error",
          duration: 6000,
          position: "top-right",
          isClosable: true,
        });
      });
  };

  const handleEditBrand = (brandId: number) => {
    const brand = brands.find((b) => b.id === brandId);
    if (brand) {
      setSelectedBrandId(brandId);
      setBrandNameInputValue(brand.name);
      setActionType("edit");
      onOpen();
    }
  };

  const handleModalSubmit = async () => {
    if (actionType === "create") {
      handleSubmit(onSubmit)();
    } else if (selectedBrandId !== null) {
      try {
        await updateBrand(selectedBrandId, brandNameInputValue);
        toast({
          title: "Sucesso",
          description: "Marca atualizada com sucesso!",
          status: "success",
          position: "top-right",
        });
        await fetchBrands(0, 0);
        onClose();
        reset();
      } catch (error) {
        toast({
          title: "Erro",
          description: `Erro ao atualizar a marca, por favor contate o suporte. \n${error}`,
          status: "error",
          duration: 6000,
          position: "top-right",
          isClosable: true,
        });
      }
    }
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
          onClick={() => {
            setActionType("create");
            onOpen();
          }}
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova Marca
        </Button>
      </Flex>
      <SearchTable
        loading={isLoading}
        columns={columns}
        data={brands}
        totalCount={brands.length}
        fetchPaginatedData={fetchBrands}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={actionType === "create" ? "Criar marca" : "Editar marca"}
        textButton={actionType === "create" ? "Criar" : "Editar "}
        onSubmit={handleModalSubmit}
      >
        <form>
          <Box>
            <Text mb="8px">Nome</Text>

            {actionType === "create" ? (
              <Input
                {...register("name", { required: true })}
                placeholder="Ex: Solito"
                focusBorderColor="#83B735"
              />
            ) : (
              <Input
                value={brandNameInputValue}
                onChange={(e) => setBrandNameInputValue(e.target.value)}
              />
            )}

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
