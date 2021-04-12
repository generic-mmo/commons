import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MicroserviceConstructor } from "./main";
import { createServerUnaryOperation } from "./__internal/common"



export default function serve(microservice: unknown): Promise<Server> {
    const { implementation, configuration } = microservice as MicroserviceConstructor
    const server = new Server()
    return new Promise((resolve, reject) => {
        const instance = new implementation() as Record<string, (payload: unknown) => Promise<unknown>>

        const operations: Parameters<typeof server.addService>[1] = { }
        for (const propertyKey of Object.keys(instance.prototype)) {
            operations[propertyKey] = createServerUnaryOperation(instance, propertyKey)
        }

        server.addService(configuration.service, operations)
        server.bindAsync(configuration.location(), ServerCredentials.createInsecure(), (error) => {
            if (error) {
                reject(error)
            } else {
                server.start()
                resolve(server)
            }
        })
    })
}