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
                    message: 'GET Produsts - OK'
                })
            }
        }
    } else if (event.resource === "/products/{id}"){
        event.pathParameters!
        console.log("GET /products/{id}")
        return {
            statusCode: 200,
            body: "GET /products/{id}"
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
