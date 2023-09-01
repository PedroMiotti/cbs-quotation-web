import { ComponentType } from "react";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import EditQuotation from "./pages/Quotation/edit";

interface Route {
  name: string;
  path: string;
  component: ComponentType;
}

const routes: Route[] = [
  {
    name: "Products",
    path: "/",
    component: Products,
  },
  {
    name: "Brands",
    path: "/marcas",
    component: Brands,
  },
  {
    name: "Cotações",
    path: "/quotation/edit/:id",
    component: EditQuotation,
  },
];

export default routes;
