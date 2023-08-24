import { ComponentType } from "react";
import Products from "./pages/Products";
import Brands from "./pages/Brands";

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
];

export default routes;
