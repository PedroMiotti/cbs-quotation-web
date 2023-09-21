import {
  Flex,
  Button,
  Icon,
  Text,
  Box,
  Spinner,
  useToast,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import QuotationBoard from "../../components/QuotationBoard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuotationLane from "../../components/QuotationLane";
import { Product } from "../../types/Product";
import { useParams } from "react-router-dom";
import { Quotation as QuotationType } from "../../types/Quotation";
import { exportQuotation, fetchQuotation } from "../../api/Quotation";
import { Composition, CompositionItem } from "../../types/Composition";
import {
  addItemToComposition,
  createComposition,
  deleteComposition,
  moveItem,
  updateComposition,
} from "../../api/Composition";
import Modal from "../../components/Modal";
import { useDebounce } from "../../hooks/useDebounce";
import { fetchAllProducts } from "../../api/Product";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "../../styles/global.css";
import { formatToBrlCurrency } from "../../utils/formatCurrency";

// export type QuotationLane = {
//   [key: string]: {
//     id: number;
//     title: string;
//     items: CompositionItem[];
//   };
// };

const Quotation = () => {
  let { id } = useParams();

  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingActionOnComposition, setIsLoadingActionOnComposition] =
    useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [quotation, setQuotation] = useState<QuotationType | undefined>();
  const [compositionForm, setCompositionForm] = useState<{
    id?: number;
    name: string;
    margin: number;
  }>({ name: "", margin: 0 });
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [products, setProducts] = useState<Product[]>([]);
  const [compositionId, setCompositionId] = useState<number | undefined>();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddItemModalOpen,
    onOpen: onOpenAddItemModal,
    onClose: onCloseAddItemModal,
  } = useDisclosure();

  const getProducts = useCallback(async () => {
    return fetchAllProducts().then((data) => data);
  }, []);

  const getQuotation = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    return fetchQuotation(+id)
      .then((data) => data)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCreateComposition = () => {
    if (!compositionForm.name || !compositionForm.margin) {
      toast({
        title: "Erro",
        description: `Por favor preencha todos os campos.`,
        status: "error",
        duration: 6000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    if (!quotation) return;

    setIsLoadingActionOnComposition(true);
    createComposition({
      quotation_id: quotation?.id,
      name: compositionForm.name,
      margin: compositionForm.margin,
    })
      .then((data) => {
        compositions.push(data);
        closeModal();
      })
      .catch((e: any) => {
        toast({
          title: "Erro",
          description: `Erro ao criar a composição, por favor contate o suporte. \n${e}`,
          status: "error",
          duration: 6000,
          position: "top-right",
          isClosable: true,
        });
      })
      .finally(() => setIsLoadingActionOnComposition(false));
  };

  const handleDeleteComposition = (id: number) => {
    deleteComposition(id).then(() => {
      setCompositions(
        compositions.filter((composition) => composition.id !== id)
      );
      toast({
        title: "Composição excluída com sucesso!",
        status: "success",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    });
  };

  const handleSaveComposition = () => {
    if (!compositionForm.id) return;

    setIsLoadingActionOnComposition(true);
    updateComposition(compositionForm.id, compositionForm)
      .then((data) => {
        const updatedCompositions = compositions.map((composition) => {
          if (composition.id === compositionForm.id) {
            return {
              ...composition,
              name: compositionForm.name,
              margin: compositionForm.margin,
            };
          }

          return composition;
        });

        setCompositions(updatedCompositions);

        closeModal();
      })
      .finally(() => setIsLoadingActionOnComposition(false));
  };

  const handleEditComposition = (id: number) => {
    const composition = compositions.find(
      (composition) => composition.id === id
    );
    if (!composition) return;

    setCompositionForm({
      id,
      name: composition.name,
      margin: composition.margin,
    });
    setActionType("edit");
    onOpen();
  };

  const handleAddItem = (id: number) => {
    onOpenAddItemModal();
    setCompositionId(id);
  };

  const handleSaveItem = (product: Product, quantity: number) => {
    if (!compositionId) return;

    const composition = compositions.find(
      (composition) => composition.id === compositionId
    );

    if (!composition) return;

    if (
      composition.CompositionItems.find(
        (compositionItem) => compositionItem.product_id === product.id
      )
    ) {
      toast({
        title: "Erro",
        description: `Este item já está na composição.`,
        status: "error",
        duration: 6000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    addItemToComposition(compositionId, product.id, quantity).then((data) => {
      const updatedCompositions = compositions.map((composition) => {
        if (composition.id === compositionId) {
          const compositionItem = {
            id: data.id,
            product_id: product.id,
            composition_id: compositionId,
            quantity: quantity,
            Product: product,
          };

          return {
            ...composition,
            CompositionItems: [
              ...composition.CompositionItems,
              compositionItem,
            ],
          };
        }

        return composition;
      });

      setCompositions(updatedCompositions);
    });

    onCloseAddItemModal();
  };

  const handleMoveItem = async (itemId: number, newCompositionId: number) => {
    if (!newCompositionId || !itemId) return;
    await moveItem(itemId, newCompositionId);
  };

  const closeModal = () => {
    setCompositionForm({ id: undefined, name: "", margin: 0 });
    onClose();
  };

  const handleExportQuotation = async () => {
    if (!quotation?.Composition.length) {
      toast({
        title: "Esta cotação não possui composições.",
        status: "warning",
        duration: 6000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    if (!quotation) return;

    setIsExporting(true);
    const response = await exportQuotation(quotation.id);

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cotacao-${quotation.name.toLowerCase()}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    setIsExporting(false);

    if (link.parentNode) link.parentNode.removeChild(link);
  };

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
    getQuotation().then((data) => {
      setQuotation(data);

      if (data && data?.Composition.length) {
        setCompositions(data.Composition);
      }
    });
  }, []);

  return (
    <Flex direction="column" h="full">
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={closeModal}
        title={actionType === "create" ? "Criar" : "Editar" + " composição"}
        textButton={actionType === "create" ? "Criar" : "Salvar"}
        onSubmit={
          actionType === "create"
            ? handleCreateComposition
            : handleSaveComposition
        }
        isLoading={isLoadingActionOnComposition}
      >
        <Flex direction="column" gap={4}>
          <FormControl>
            <FormLabel>Nome da composição</FormLabel>
            <Input
              value={compositionForm?.name}
              onChange={(e) =>
                setCompositionForm({
                  ...compositionForm,
                  name: e.target.value,
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Margem</FormLabel>
            <Input
              value={compositionForm?.margin}
              onChange={(e) =>
                setCompositionForm({
                  ...compositionForm,
                  margin: Number(e.target.value),
                })
              }
            />
          </FormControl>
        </Flex>
      </Modal>
      <Flex
        direction={{ sm: "column", md: "row" }}
        justify="space-between"
        align="center"
        w="100%"
        mb="20px"
        px={5}
      >
        <Text fontSize={"2xl"} fontWeight={"semibold"}>
          # {quotation?.name} <Badge>{quotation?.tag}</Badge>
        </Text>
        <Flex gap={2}>
          <Button
            variant="outline"
            fontSize="sm"
            isLoading={isExporting}
            loadingText="Exportando..."
            onClick={handleExportQuotation}
          >
            Exportar
          </Button>
          <Button
            variant="outline"
            fontSize="sm"
            bg={"#83B735"}
            color={"#FFFFFF"}
            onClick={onOpen}
            _hover={{ bg: "#96c255" }}
          >
            <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova
            composição
          </Button>
        </Flex>
      </Flex>

      <Box height="full" overflow="auto">
        {isLoading ? (
          <Flex align="center" justify="center" p={10}>
            <Spinner />
          </Flex>
        ) : (
          <QuotationBoard
            handleAddItem={handleAddItem}
            data={compositions}
            setData={setCompositions}
            handleDelete={handleDeleteComposition}
            handleEdit={handleEditComposition}
            handleMoveItem={handleMoveItem}
          />
        )}
      </Box>

      <AddItemModal
        products={products}
        isOpen={isAddItemModalOpen}
        onClose={onCloseAddItemModal}
        submit={handleSaveItem}
      />
    </Flex>
  );
};

interface AddItemModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  submit: (item: Product, quantity: number) => void;
}

type ProductWithCurrentPrice = Product & { currentPrice: number };

const AddItemModal = ({
  products,
  isOpen,
  onClose,
  submit,
}: AddItemModalProps) => {
  const [itemFormModal, setItemFormModal] = useState<{
    id?: number;
    quantity: number;
  } | null>({ quantity: 1 });
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithCurrentPrice | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);

  const handleOnSelect = (item: Product) => {
    const currentPrice =
      item?.ProductPrice?.find((price) => price.is_current)?.price ?? 0;

    setSelectedProduct({
      ...item,
      currentPrice,
    });

    const total = currentPrice * (itemFormModal?.quantity ?? 0);
    setTotalValue(total);
  };

  const closeModal = () => {
    setItemFormModal({ quantity: 1 });
    setSelectedProduct(null);
    setTotalValue(0);
    onClose();
  };

  const handleAdd = () => {
    if (!selectedProduct || !itemFormModal?.quantity) return;

    submit(selectedProduct, itemFormModal?.quantity);
  };

  useEffect(() => {
    const total =
      (selectedProduct?.currentPrice ?? 0) * (itemFormModal?.quantity ?? 0);
    setTotalValue(total);
  }, [itemFormModal?.quantity]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={closeModal}
      title="Adicionar Produto"
      textButton={"Adicionar"}
      onSubmit={handleAdd}
      footerText={formatToBrlCurrency(totalValue)}
      // isLoading={}
    >
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>Nome</FormLabel>
          <ReactSearchAutocomplete
            items={products}
            styling={{ zIndex: 4, borderRadius: "0.365rem" }}
            onSelect={handleOnSelect}
            autoFocus
            formatResult={formatSearchResult}
            showNoResultsText="Nenhum produto encontrado"
          />
        </FormControl>

        <Stack direction={{ sm: "column", md: "row" }} spacing="30px">
          <FormControl>
            <FormLabel>Marca</FormLabel>
            <Input disabled={true} value={selectedProduct?.Brand?.name} />
          </FormControl>
          <FormControl>
            <FormLabel>Preço</FormLabel>
            <Input
              value={formatToBrlCurrency(selectedProduct?.currentPrice)}
              disabled={true}
            />
          </FormControl>
        </Stack>

        <Stack direction={{ sm: "column", md: "row" }} spacing="30px">
          <FormControl>
            <FormLabel>Peso</FormLabel>
            <Input disabled={true} value={selectedProduct?.weight} />
          </FormControl>
          <FormControl>
            <FormLabel>Quantidade</FormLabel>
            <Input
              value={itemFormModal?.quantity}
              onChange={(e) =>
                setItemFormModal({
                  ...itemFormModal,
                  quantity: Number(e.target.value),
                })
              }
            />
          </FormControl>
        </Stack>
      </Flex>
    </Modal>
  );
};

const formatSearchResult = (item: Product) => {
  return (
    <Flex align="center" justify="space-between">
      <Text>
        {item.name} {item?.Brand?.name} {item.weight}
      </Text>
    </Flex>
  );
};

export default Quotation;
