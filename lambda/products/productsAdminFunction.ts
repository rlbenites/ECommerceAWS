import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

//Criado a função 'handler' de acordo com o informado no handler
export async function handler(event: APIGatewayProxyEvent,
    context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId  = context.awsRequestId // identificação da requisição feita pelo cliente
    const apiRequestId = event.requestContext.requestId // processo de tracing distribuido

    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`) // recebendo log do que esta vindo no meu event, irá aparecer no cloudWatch

    if (event.resource === "/product"){
        console.log("POST /products")
        return {
            statusCode: 201,
            body: "POST /products"
        }
    } else if (event.resource === "/product/M {id}") {
        const productId = event.pathParameters!.id as string
        if (event.httpMethod === "PUT") {
            console.log(`PUT /products/ ${productId}`)
            return {
                statusCode: 200,
            body: `PUT /products/ ${productId}`
            }
        } else if (event.httpMethod === "DELETE") {
            console.log(`DELETE /products/ ${productId}`)    
            return {statusCode: 200,
            body: `DELETE /products/ ${productId}`
            }
        }
    }

    return {
        statusCode: 400,
        body: "Bad request"
    }
}
