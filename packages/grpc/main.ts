import { Client, ServiceDefinition, ChannelCredentials, ChannelOptions } from "@grpc/grpc-js"



export type ClientDefinition = {
    new (
        address: string,
        credentials: ChannelCredentials,
        options?: Partial<ChannelOptions>
    ): Client;
}

export type MicroserviceConfiguration = {
    location: () => string
    client: ClientDefinition
    service: ServiceDefinition
}


export interface MicroserviceConstructor {
    implementation: { new (): unknown }
    configuration: MicroserviceConfiguration
}

export default function Microservice(configuration: MicroserviceConfiguration): ClassDecorator {
    // @ts-ignore
    return (constructor: { new (): unknown }): MicroserviceConstructor => {
        return class Microservice {
            public static implementation = constructor
            public static configuration = configuration

            constructor() {
                return new Client(
                    configuration.location(),
                    require("/home/mzpkjs/Hobby Projects/generic-mmo/server/node_modules/@grpc/grpc-js")
                        .ChannelCredentials.createInsecure()
                )
            }
        }
    }
}