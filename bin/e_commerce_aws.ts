#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { EcommerceApiStack } from "../lib/ecommerceApi-stack";
import { ProductsAppLayersStack } from "../lib/productsAppLayers-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: "058264209135",
  region: "us-east-1",
}

const tags = {
  cost: "Ecommerce",
  team: "Student"
}

const productsAppLayersStack = new ProductsAppLayersStack (app, "ProductsLayers", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, "ProductApp", {
  tags: tags,
  env: env
})

const eCommerceApiStack = new EcommerceApiStack(app, "ECommerceApi", {
  productsFecthHandler: productsAppStack.productsFecthHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)