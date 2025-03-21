import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import  * as ssm from "aws-cdk-lib/aws-ssm"

// classe que representa a
export class ProductsAppStack extends cdk.Stack {
  readonly productsFecthHandler: lambdaNodeJS.NodejsFunction;
  readonly productsAdminHandler: lambdaNodeJS.NodejsFunction;
  readonly productsDdb: dynamodb.Table;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
      tableName: "products", // nome da tabela
      removalPolicy: cdk.RemovalPolicy.DESTROY, // tipo de remoção da tabela caso precise destruir toa infraestrutura. Normalmente usamos 'Retail'
      partitionKey: {
        // atributos da tabela
        name: "id", // chave primaria
        type: dynamodb.AttributeType.STRING, // tipagem
      },
      billingMode: dynamodb.BillingMode.PROVISIONED, // definição de cobrança
      readCapacity: 1, // capacidade de leitura
      writeCapacity: 1, // capacidade de escrita
    });
    this.productsFecthHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsFecthFunction",
      {
        functionName: "ProductsFecthFunction",
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
          PRODUCTS_DDB: this.productsDdb.tableName,
        },
      }
    );
    this.productsDdb.grantReadData(this.productsFecthHandler); // Somente leitura da tabela

    this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsAdminFunction",
      {
        functionName: "ProductsAdminFunction",
        entry: "lambda/products/productsAdminFunction.ts", // arquivo onde estará armazenada a função
        handler: "handler", // metodo de invocação
        runtime: lambda.Runtime.NODEJS_20_X, // tempo máximo para execução
        memorySize: 512, // tamanho da memoria da função para execução
        timeout: cdk.Duration.seconds(10), // tempo máximo para execução
        bundling: {
          minify: true, // deixa o código de forma mais eficaz e anxuta
          sourceMap: false, // geração de mapas para deploy
        },
        environment: {
          PRODUCTS_DDB: this.productsDdb.tableName,
        },
      }
    )
    this.productsDdb.grantWriteData(this.productsAdminHandler); // Somente escrita na tabela
  }
};