import { ComponentType } from "react";
import Products from "../pages/Products";

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
];

export default routes;
