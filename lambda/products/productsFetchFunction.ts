import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

//Criado a função 'handler' de acordo com o informado no handler
export async function handler(event: APIGatewayProxyEvent,
    context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId  = context.awsRequestId // identificação da requisição feita pelo cliente
    const apiRequestId = event.requestContext.requestId // processo de tracing distribuido

    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`) // recebendo log do que esta vindo no meu event, irá aparecer no cloudWatch
        // geração de logs são cobradas, além de que consomem CPU, deve ser utilizado com parcimônia
    const method = event.httpMethod
    if (event.resource === '/products') {
        if (method === 'GET') {
            console.log('GET')

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'GET Products - OK'
                })
            }
        }
    } else if (event.resource === "/products/{id}"){
        const productId = event.pathParameters!.id as string
        console.log(`GET /products/${productId}`)
        return {
            statusCode: 200,
            body: `GET /products/${productId}`
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Bad request'
        }
        )
    }
}
