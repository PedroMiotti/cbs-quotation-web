import { ComponentType } from "react";
import Products from "./pages/Products";
import Quotation from "./pages/Quotation";

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
    name: "Cotações",
    path: "/quotation/:id",
    component: Quotation,
  },
];

export default routes;
