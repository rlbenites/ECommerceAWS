import * as lambda from "aws-cdk-lib/aws-lambda";
//import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

// classe que representa a
export class ProductsAppStack extends cdk.Stack {
  readonly productsFecthHandler: lambdaNodeJS.NodejsFunction;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    
    this.productsFecthHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsFecthFunction",
      {
        functionName: "ProdctusFecthFunction",
        entry: "lambda/products/productsFetchFunction.ts", // arquivo onde estará armazenada a função
        handler: "handler", // metodo de invocação
        runtime: lambda.Runtime.NODEJS_20_X, // tempo máximo para execução
        memorySize: 512, // tamanho da memoria da função para execução
        timeout: cdk.Duration.seconds(10), // tempo máximo para execução
        bundling: {
          minify: true, // deixa o código de forma mais eficaz e anxuta
          sourceMap: false, // geração de mapas para deploy
        },
        environment: {
          //PRODUCTS_DDB: this.productsDdb.tableName,
        },
      }
    );
  }
}


// Criando código para função Lambida