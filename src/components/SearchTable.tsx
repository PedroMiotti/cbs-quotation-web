import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Stack,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Image,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  PaginationState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import { SearchBar } from "../components/SearchBar";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export type SearchTableProps<Data extends object> = {
  loading: boolean;
  fetchPaginatedData: (pageIndex: number, pageSize: number) => Promise<void>;
  totalCount: number;
  data: Data[];
  columns: ColumnDef<Data, any>[];
  emptyStateText?: string;
};

export default function SearchTable<Data extends object>({
  data,
  columns,
  loading,
  totalCount,
  fetchPaginatedData,
  emptyStateText,
}: SearchTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: totalCount / 10,
    state: {
      sorting,
    },
  });

  const createPages = (count: number) => {
    let arrPageCount = [];

    if (count < table.getState().pagination.pageSize) return [1];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  useEffect(() => {
    fetchPaginatedData(
      table.getState().pagination.pageIndex,
      table.getState().pagination.pageSize
    );
  }, [
    fetchPaginatedData,
    table.getState().pagination.pageSize,
    table.getState().pagination.pageIndex,
  ]);

  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex
        align={{ sm: "flex-start", lg: "flex-end" }}
        justify={{ sm: "flex-start", lg: "flex-end" }}
        w="100%"
        px="22px"
        mb="36px"
      >
        <SearchBar
          border="1px solid "
          borderColor={useColorModeValue("gray.200", "gray.600")}
          // onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </Flex>
      {loading ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          direction="column"
          p="75px"
        >
          <Spinner size="lg" color="blue.500" />
        </Flex>
      ) : totalCount === 0 ? (
        <Flex direction="column" w="full" alignItems="center" gap="10">
          <Text fontSize="md">
            {emptyStateText ?? "Ops, parece que não existe nenhum dado ainda."}
          </Text>
        </Flex>
      ) : (
        <>
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, innerIndex, row) => {
                    // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                    const meta: any = header.column.columnDef.meta;
                    return (
                      <Th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        isNumeric={meta?.isNumeric}
                        pe="0px"
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          fontSize={{ sm: "10px", lg: "12px" }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <Icon
                            w={{ sm: "10px", md: "14px" }}
                            h={{ sm: "10px", md: "14px" }}
                            marginRight={
                              innerIndex + 1 === row.length ? "24px" : 0
                            }
                            color={
                              header.column.getIsSorted()
                                ? "gray.500"
                                : "gray.400"
                            }
                            float="right"
                            as={
                              header.column.getIsSorted()
                                ? header.column.getIsSorted() === "desc"
                                  ? TiArrowSortedDown
                                  : TiArrowSortedUp
                                : TiArrowUnsorted
                            }
                          />
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td key={cell.id} isNumeric={meta?.isNumeric}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex
            direction={{ sm: "column", md: "row" }}
            justify="space-between"
            align="center"
            w="100%"
            px={{ md: "22px" }}
          >
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="normal"
              mb={{ sm: "24px", md: "0px" }}
            >
              Mostrando{" "}
              {table.getState().pagination.pageSize *
                table.getState().pagination.pageIndex +
                1}{" "}
              a{" "}
              {table.getState().pagination.pageSize *
                (table.getState().pagination.pageIndex + 1) <=
              totalCount
                ? table.getState().pagination.pageSize *
                  (table.getState().pagination.pageIndex + 1)
                : totalCount}{" "}
              de {totalCount} entradas
            </Text>
            <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
              <Button
                variant="no-effects"
                onClick={() => table.previousPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="8px"
                bg="#fff"
                border="1px solid lightgray"
                display={
                  table.getState().pagination.pageSize === 5
                    ? "none"
                    : table.getCanPreviousPage()
                    ? "flex"
                    : "none"
                }
                _hover={{
                  opacity: "0.7",
                  borderColor: "gray.500",
                }}
              >
                <Icon as={GrFormPrevious} w="16px" h="16px" color="gray.400" />
              </Button>
              {table.getState().pagination.pageSize === 5 ? (
                <NumberInput
                  max={table.getPageCount() - 1}
                  min={1}
                  w="75px"
                  mx="6px"
                  defaultValue="1"
                  onChange={(e) => table.setPageIndex(+e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper onClick={() => table.nextPage()} />
                    <NumberDecrementStepper
                      onClick={() => table.previousPage()}
                    />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                createPages(table.getPageCount()).map((pageNumber, index) => {
                  return (
                    <Button
                      variant="no-effects"
                      transition="all .5s ease"
                      onClick={() => table.setPageIndex(pageNumber - 1)}
                      w="40px"
                      h="40px"
                      borderRadius="8px"
                      bg={
                        pageNumber === table.getState().pagination.pageIndex + 1
                          ? "#83B735"
                          : "#fff"
                      }
                      border={
                        pageNumber === table.getState().pagination.pageIndex + 1
                          ? "none"
                          : "1px solid lightgray"
                      }
                      _hover={{
                        opacity: "0.7",
                        borderColor: "gray.500",
                      }}
                      key={index}
                    >
                      <Text
                        fontSize="sm"
                        color={
                          pageNumber ===
                          table.getState().pagination.pageIndex + 1
                            ? "#fff"
                            : "gray.600"
                        }
                      >
                        {pageNumber}
                      </Text>
                    </Button>
                  );
                })
              )}
              <Button
                variant="no-effects"
                onClick={() => table.nextPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="8px"
                bg="#fff"
                border="1px solid lightgray"
                display={
                  table.getState().pagination.pageSize === 5
                    ? "none"
                    : table.getCanNextPage()
                    ? "flex"
                    : "none"
                }
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500",
                }}
              >
                <Icon as={GrFormNext} w="16px" h="16px" color="gray.400" />
              </Button>
            </Stack>
          </Flex>
        </>
      )}
    </Flex>
  );
}
