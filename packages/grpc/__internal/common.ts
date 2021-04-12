import { Client, ServerUnaryCall, ServiceError } from "@grpc/grpc-js";



export const createServerUnaryOperation = (instance: Record<string, (payload: unknown) => Promise<unknown>>, propertyKey: string) => {
    return (call: ServerUnaryCall<unknown, unknown>, callback: (error: ServiceError | null, response: unknown) => void) => {
        instance[propertyKey].call(instance, call.request)
            .then(returnValue => callback(null, returnValue))
            .catch(error => callback(error, null))
    }
}

export const createClientUnaryOperation = (client: Client, propertyKey: string) => {
    return (request: unknown): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            client[propertyKey].call(client, request, (error: ServiceError | null, response: unknown) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            })
        })
    }
}