import { Flex, Button, Icon, Text, Container, Box } from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import QuotationBoard from "../../../components/QuotationBoard";

const Quotation = () => {
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
          # Natal 2022
        </Text>
        <Button
          variant="outline"
          fontSize="sm"
          bg={"#83B735"}
          color={"#FFFFFF"}
          _hover={{ bg: "#96c255" }}
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova Cotação
        </Button>
      </Flex>

      <Box h="full" w="full">
        <QuotationBoard />
      </Box>
    </Flex>
  );
};

export default Quotation;
