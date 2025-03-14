import * as cdk from 'aws-cdk-lib';
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from 'constructs';
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import { PROVIDER_ERROR_KEY } from 'aws-cdk-lib/cx-api';

interface ECommerceApiStackProps extends cdk.StackProps {
    productsFecthHandler: lambdaNodeJS.NodejsFunction
    productsAdminHandler: lambdaNodeJS.NodejsFunction
}

export class EcommerceApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
        super(scope, id, props);

        const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            deployOptions :{
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup), // criando o geração de logs no APIGateway
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true, // mostrar o metodo
                    ip: true, // mostrar IP
                    protocol: true, // protoco
                    requestTime: true, // mostrar o tempo de execução
                    resourcePath: true, // mostrar o caminho
                    status: true, // mostar status
                    caller: true, // mostrar recurso que invocou
                    user: true // mostrar usuário
                    ,
                    responseLength: false
                })
            }
        })
        
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFecthHandler) // integração de invocação do recurso Lambda

        //"/products"
        const productsResource = api.root.addResource("products")
        productsResource.addMethod("GET", productsFetchIntegration)

        // GET /product/{id}
        const productsIdResource = productsResource.addResource("{id}") // acessando o produto pelo Id
        productsIdResource.addMethod("GET", productsFetchIntegration)

        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)

        // POST /products
        productsResource.addMethod("POST", productsAdminIntegration)

        // PUT  /products/{id}
        productsIdResource.addMethod("PUT", productsAdminIntegration)

        // DELETE /
        productsIdResource.addMethod("DELETE", productsAdminIntegration)
    }
}