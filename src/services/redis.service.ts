import { createClient } from "redis"

class RedisService {
    public client = createClient();
    constructor() {
        this.init().then(() => {
            console.log('redis connected');
        })
    }

    public init = async () => {
        await this.client.connect();
    }
}

export const redisClient = new RedisService().client