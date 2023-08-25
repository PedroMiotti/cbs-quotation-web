import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import './styles/global.css'
import App from "./App";

const RootComponent = () => (
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RootComponent />
);
