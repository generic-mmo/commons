import { Client, ServiceDefinition, ChannelCredentials, ChannelOptions } from "@grpc/grpc-js"
import { createClientUnaryOperation } from "./__internal/common";


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


const x = new WeakMap()


export function Unary(): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        descriptor.enumerable = true
        x.set(target, new WeakSet())
    }
}



export default function Microservice(configuration: MicroserviceConfiguration): ClassDecorator {
    // @ts-ignore
    return (implementation: { new (): unknown }): MicroserviceConstructor => {
        return class Microservice {
            public static implementation = implementation
            public static configuration = configuration

            constructor() {
                const instance = new implementation() as Record<string, (payload: unknown) => Promise<unknown>>
                const client = new configuration.client(configuration.location(), ChannelCredentials.createInsecure())
                for (const propertyKey of Object.keys(Object.getPrototypeOf(instance))) {
                    const method = Reflect.get(client, propertyKey)
                    Object.defineProperty(client, propertyKey, {
                        value: createClientUnaryOperation(client, method)
                    })
                }

                return client
            }
        }
    }
}