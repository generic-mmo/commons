import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MicroserviceConstructor } from "./main";



export default function serve(microservice: MicroserviceConstructor) {
    const server = new Server()
    const implementation = new microservice.implementation()
    server.addService(microservice.configuration.service, implementation as any)
    server.bindAsync(microservice.configuration.location(), ServerCredentials.createInsecure(), () => {
        server.start()
    })
}