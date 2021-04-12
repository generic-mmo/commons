import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MicroserviceConstructor } from "./main";



export default function serve(microservice: unknown): Promise<Server> {
    const { implementation, configuration } = microservice as MicroserviceConstructor
    const server = new Server()
    return new Promise((resolve, reject) => {
        server.addService(configuration.service, new implementation() as Parameters<typeof server.addService>[1])
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