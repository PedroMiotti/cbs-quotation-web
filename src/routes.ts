import { ComponentType } from "react";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Quotations from "./pages/Quotation";
import Quotation from "./pages/Quotation/[id]";

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
    path: "/quotation",
    component: Quotations,
  },
  {
    name: "Cotações",
    path: "/quotation/:id",
    component: Quotation,
  },
];

export default routes;
