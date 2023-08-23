import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import QuotationBoard from "./components/QuotationBoard";
import SidebarWithHeader from "./components/HeaderWithSidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import routes from "./navigation/routes";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        backgroundColor: "#f8f8f8",
        height: "100vh",
      }}
    >
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute hasDefaultLayout />}>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App;
