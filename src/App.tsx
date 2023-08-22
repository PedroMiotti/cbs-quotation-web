import * as React from "react"
import {
  Box, ChakraProvider,
} from "@chakra-ui/react"
import QuotationBoard from "./components/QuotationBoard"

export const App = () => (
  <ChakraProvider>
      <QuotationBoard />
  </ChakraProvider>
)
