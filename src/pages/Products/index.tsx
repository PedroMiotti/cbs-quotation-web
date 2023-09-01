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
  Select,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  CreateProductRequest,
  Product,
  ProductPrice,
} from "../../types/Product";
import Modal from "../../components/Modal";
import { useForm } from "react-hook-form";
import { fetchAllBrands } from "../../api/Brand";
import { createProduct, fetchAllProducts } from "../../api/Product";

interface FormData {
  name: string;
  brand: number;
  weight: string;
  price: number;
}

interface Brand {
  id: number;
  name: string;
}

const Actions = ({ item }: { item: Product }) => {
  const { onOpen } = useDisclosure();

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

const columnHelper = createColumnHelper<Product>();

const Products = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageCount, setPageCount] = useState(0);
  const [isUsersRequestPending, setIsUsersRequestPending] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      columnHelper.accessor("Brand", {
        cell: (info: any) => info.getValue().name,
        header: "MARCA",
      }),
      columnHelper.accessor("ProductPrice", {
        cell: (info: any) => {
          const currentPrice = info
            .getValue()
            ?.find((price: ProductPrice) => price.is_current);
          if (!currentPrice) return "R$ 0";

          const formattedPrice = Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(currentPrice.price);

          return formattedPrice;
        },
        header: "PREÇO",
      }),

      columnHelper.accessor("weight", {
        cell: (info: any) => info.getValue(),
        header: "PESO",
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
          return <Actions item={item} />;
        },
      }),
    ],
    []
  );

  const fetchProducts = useCallback(
    async (pageIndex: number, pageSize: number) => {
      setIsLoading(true);
      fetchAllProducts()
        .then((data) => {
          setProducts(data);
        })
        .finally(() => setIsLoading(false));
    },
    []
  );

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await fetchAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const onSubmit = async (formData: FormData) => {
    try {
      const productData: CreateProductRequest = {
        name: formData.name,
        brand_id: formData.brand,
        weight: formData.weight,
        price: {
          price: +formData.price,
          is_current: true,
        },
      };

      const createdProduct = await createProduct(productData);
      const updatedProducts = await fetchAllProducts();
      setProducts(updatedProducts);
      onClose();
      reset();
      toast({
        title: "Produto criado com sucesso",
        description: "Produto criado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Erro ao criar produto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" >
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
          onClick={() => {
            onOpen();
          }}
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Novo Produto
        </Button>
      </Flex>
      <SearchTable
        loading={isLoading}
        columns={columns}
        data={products}
        totalCount={products.length}
        fetchPaginatedData={fetchProducts}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={"Criar Produto"}
        textButton={"Criar"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <form>
          <Box>
            <Text mb="8px">Nome</Text>
            <Input
              {...register("name", { required: true })}
              placeholder="Ex: Arroz"
              focusBorderColor="#83B735"
            />
            {errors.name && (
              <p style={{ color: "red", marginTop: "3px" }}>
                Nome da marca é obrigatório
              </p>
            )}
          </Box>
          <Stack mt={4} direction={"row"}>
            <Box>
              <Text mb="8px">Marca</Text>
              <Select
                {...register("brand", { required: true })}
                focusBorderColor="#83B735"
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text mb="8px">Gramagem</Text>
              <Input
                {...register("weight", { required: true })}
                placeholder="Ex: 100gr"
                focusBorderColor="#83B735"
              />
            </Box>
          </Stack>
          <Box mt={"4"}>
            <Text mb="8px">Preço</Text>

            <Input
              {...register("price", { required: true })}
              placeholder="Ex: 15.50"
              focusBorderColor="#83B735"
            />
          </Box>
        </form>
      </Modal>
    </Flex>
  );
};

export default Products;
