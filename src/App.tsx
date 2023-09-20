import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import routes from "./routes";
import Authentication from "./pages/Authentication";
import { QuotationProvider } from "./context/Quotation";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const initialValue = document.body.style.zoom;

    document.body.style.zoom = '100%';

    return () => {
      document.body.style.zoom = initialValue;
    };
  }, []);
  
  return (
    <div
      style={{
        width: "100vw",
        backgroundColor: "#f8f8f8",
        height: "100vh",
      }}
    >
      <ChakraProvider>
        <QuotationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Authentication />} />
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
        </QuotationProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
