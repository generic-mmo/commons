import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MicroserviceConstructor } from "./main";



export default function serve(microservice: unknown) {
    const { implementation, configuration } = microservice as MicroserviceConstructor
    const server = new Server()
    server.addService(configuration.service, new implementation() as Parameters<typeof server.addService>[1])
    server.bindAsync(configuration.location(), ServerCredentials.createInsecure(), () => {
        server.start()
    })
}