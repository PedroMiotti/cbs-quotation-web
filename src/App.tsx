import * as React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  BrowserRouter,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import routes from "./routes";
import Authentication from "./pages/Authentication";
import { QuotationProvider } from "./context/Quotation";
import { useEffect } from "react";
import Brands from "./pages/Brands";
import Products from "./pages/Products";
import EditQuotation from "./pages/Quotation/edit";
import Quotations from "./pages/Quotation";

function App() {
  useEffect(() => {
    const initialValue = document.body.style.zoom;

    document.body.style.zoom = "100%";

    return () => {
      document.body.style.zoom = initialValue;
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Authentication />,
    },
    {
      path: "/",
      element: (
        <PrivateRoute hasDefaultLayout>
          <Products />
        </PrivateRoute>
      ),
    },
    {
      path: "/marcas",
      element: (
        <PrivateRoute hasDefaultLayout>
          <Brands />
        </PrivateRoute>
      ),
    },
    {
      path: "/quotation/edit/:id",
      element: (
        <PrivateRoute hasDefaultLayout>
          <EditQuotation />
        </PrivateRoute>
      ),
    },
    {
      path: "/quotation",
      element: (
        <PrivateRoute hasDefaultLayout>
          <Quotations />
        </PrivateRoute>
      ),
    },
  ]);

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
          <RouterProvider router={router} />
        </QuotationProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
