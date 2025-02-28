#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { EcommerceApiStack } from "../lib/ecommerceApi-stack";

const app = new cdk.App();
const env: cdk.Environment = {
  account: "31a2e939c746e01ecc86139606f5b477ef43a1b673034afb140acf773e412ae7",
  region: "us-east-1",
}

const tags = {
  cost: "Ecommerce",
  team: "Student"
}

const productsAppStack = new ProductsAppStack(app, "ProductApp", {
  tags: tags,
  env: env
})

const eCommerceApiStack = new EcommerceApiStack(app, "ECommerApi", {
  productsFecthHandler: productsAppStack.productsFecthHandler 
})
eCommerceApiStack.addDependency(productsAppStack)