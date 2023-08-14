import {createClient} from 'redis';
import {DatabaseConfig, getDatabaseConfig} from "@/config/server/database";
import {logError, logInfo} from "@/log";
import {hash} from "@/helper/server/string-server-library";

const config: DatabaseConfig = getDatabaseConfig()

const redisClient = createClient({
    url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}/${config.redis.db}`,
});

redisClient.on('error', (error) => logError(error));

redisClient.connect().then(() => logInfo("Redis connected"))

const buildKey = (key: string, salt: string = "", prefix: string | null = null): string => {
    if (prefix === null) {
        return hash(key, salt)
    } else {
        return `${prefix}:${hash(key, salt)}`
    }
}

export const get =
    async (
        key: string,
        salt: string = "",
        prefix: string | null = null,
        _default = null
    ): Promise<any> => (
        await (redisClient).get(buildKey(key, salt, prefix) as any)
    ) ?? _default

export const set =
    async (
        key: string,
        salt: string,
        prefix: string | null = null,
        value: string,
        ttl: number | null = null
    ): Promise<any> => await (redisClient.set(buildKey(key, salt, prefix) as any, value as any)
        .then(async () => {
            if (ttl !== null) {
                return await (redisClient).expire(buildKey(key, salt, prefix) as any, ttl as any)
            }
            return true
        })
    )

export const del =
    async (
        key: string,
        salt: string,
        prefix: string | null = null
    ): Promise<any> => await (redisClient).del(buildKey(key, salt, prefix) as any)
