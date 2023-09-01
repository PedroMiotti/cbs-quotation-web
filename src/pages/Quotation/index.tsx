import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import SearchTable from "../../components/SearchTable";
import {
  Button,
  Flex,
  useToast,
  Text,
  useDisclosure,
  Stack,
  Icon,
  Box,
  Input,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../../components/Modal";
import { useForm } from "react-hook-form";
import { CreateQuotationRequest, QuotationTable } from "../../types/Quotation";
import {
  createQuotation,
  deleteQuotation,
  fetchAllQuotations,
} from "../../api/Quotation";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";

interface Brand {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  type: string;
  tag?: string;
}

enum QuotationType {
  CHRISTMAS = "CHRISTMAS",
  CUSTOM = "CUSTOM",
}

const mapQuotationType = (type: QuotationType) => {
  const map = {
    CHRISTMAS: "Natal",
    CUSTOM: "Personalizado",
  };

  return map[type] || "Personalizado";
};

const Actions = ({
  item,
  onDelete,
}: {
  item: QuotationTable;
  onDelete: () => void;
}) => {
  const { onOpen } = useDisclosure();

  return (
    <>
      <Stack cursor={"pointer"} onClick={onOpen} direction={"row"}>
        <Button bg={"#83B735"} color={"#FFFFFF"}>
          Editar
        </Button>
        +
        <Button bg={"#B9B9B9"} color={"#FFFFFF"} onClick={onDelete}>
          Deletar
        </Button>
      </Stack>
    </>
  );
};

const columnHelper = createColumnHelper<QuotationTable>();

const Quotation = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quotations, setQuotations] = useState<QuotationTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<QuotationType | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<QuotationTable>();

  const toast = useToast();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info: any) => info.getValue(),
        header: "ID",
      }),
      columnHelper.accessor("name", {
        cell: (info: any) => {
          const tag = info.row.original.tag;
          return `${info.getValue()} ${tag}`;
        },
        header: "NOME",
      }),
      columnHelper.accessor("type", {
        cell: (info: any) => (
          <Tag
            variant="subtle"
            colorScheme={
              info.getValue() === QuotationType.CHRISTMAS ? "red" : "blue"
            }
          >
            {mapQuotationType(info.getValue())}
          </Tag>
        ),
        header: "TIPO",
      }),
      columnHelper.accessor("compositions", {
        cell: (info: any) => 5,
        header: "COMPOSIÇÕES",
      }),
      columnHelper.accessor("created_at", {
        cell: (info: any) => (
          <Text>{new Date(info.getValue()).toLocaleDateString("pt-br")}</Text>
        ),
        header: "CRIADO EM",
      }),
      columnHelper.display({
        id: "actions",
        header: "AÇÃO",
        cell: (info: any) => {
          const item = info.row.original;
          return <Actions item={item} onDelete={() => handleDelete(item.id)} />;
        },
      }),
    ],
    []
  );

  const fetchQuotations = useCallback(
    async (pageIndex: number, pageSize: number) => {
      setIsLoading(true);
      fetchAllQuotations()
        .then((data) => {
          setQuotations(data);
          console.log(data);
        })
        .finally(() => setIsLoading(false));
    },
    []
  );

  const handleDelete = async (quotationId: number) => {
    try {
      await deleteQuotation(quotationId);

      const updatedQuotations = quotations.filter((q) => q.id !== quotationId);
      setQuotations(updatedQuotations);

      toast({
        title: "Cotação deletada com sucesso",
        description: "A cotação foi excluída com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast({
        title: "Erro ao deletar cotação",
        description: "Ocorreu um erro ao deletar a cotação",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const quotationData: CreateQuotationRequest = {
        name: formData.name,
        type: selectedType ? mapQuotationType(selectedType) : "",
        tag: formData.tag,
      };

      await createQuotation(quotationData);
      const updatedProducts = await fetchAllQuotations();
      setQuotations(updatedProducts);

      handleCloseModal();
      setSelectedType(null);
      reset();

      toast({
        title: "Cotação criada com sucesso",
        description: "Cotação criada com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Erro ao criar Cotação.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTagClick = (type: QuotationType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  useEffect(() => {
    if (searchParams.get("action")) onOpen();
  }, [searchParams]);

  const handleCloseModal = () => {
    if(searchParams.get("action") === "create") setSearchParams("");
    onClose();
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
          Cotações
        </Text>
        <Button
          variant="outline"
          fontSize="sm"
          bg={"#83B735"}
          color={"#FFFFFF"}
          _hover={{ bg: "#96c255" }}
          onClick={() => {
            onOpen();
          }}
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova Cotação
        </Button>
      </Flex>
      <SearchTable
        loading={isLoading}
        columns={columns}
        data={quotations}
        totalCount={quotations.length}
        fetchPaginatedData={fetchQuotations}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={"Criar Cotação"}
        textButton={"Criar"}
        onSubmit={handleSubmit(onSubmit)}
        size="lg"
      >
        <form>
          <Box>
            <Text mb="8px">Nome</Text>
            <Input
              {...register("name", { required: true })}
              placeholder="Ex: Ambev"
              focusBorderColor="#83B735"
            />
            {errors.name && (
              <p style={{ color: "red", marginTop: "3px" }}>
                Nome da cotação é obrigatória
              </p>
            )}
          </Box>
          <Stack mt={4} direction={"row"}>
            <Box w="full">
              <Text mb="8px">Tipo</Text>
              <Stack direction={"row"} justify={"center"} align={"center"}>
                <Tag
                  display="flex"
                  justifyContent="center"
                  w="full"
                  h="40px"
                  onClick={() => handleTagClick(QuotationType.CHRISTMAS)}
                  variant="subtle"
                  colorScheme={
                    selectedType === QuotationType.CHRISTMAS ? "green" : "gray"
                  }
                  cursor="pointer"
                  mr={2}
                >
                  Natal
                </Tag>
                <Tag
                  display="flex"
                  justifyContent="center"
                  w="full"
                  h="40px"
                  onClick={() => handleTagClick(QuotationType.CUSTOM)}
                  variant="subtle"
                  colorScheme={
                    selectedType === QuotationType.CUSTOM ? "green" : "gray"
                  }
                  cursor="pointer"
                >
                  Personalizada
                </Tag>
              </Stack>
            </Box>
            <Box w="full">
              <Stack spacing={"2"} direction={"row"}>
                <Text mb="8px">Tag</Text>
                <Tooltip
                  label="Se há uma composição com esse nome, adicione uma tag"
                  hasArrow
                  placement="top"
                >
                  <span>
                    <InfoOutlineIcon w={4} h={4} color="gray.500" />
                  </span>
                </Tooltip>
              </Stack>
              <Input
                {...register("tag")}
                placeholder="Ex. Alternativa"
                focusBorderColor="#83B735"
              />
            </Box>
          </Stack>
        </form>
      </Modal>
    </Flex>
  );
};

export default Quotation;
