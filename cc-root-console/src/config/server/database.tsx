interface RedisConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    db: number;
}

export interface DatabaseConfig {
    redis: RedisConfig;
}

const buildRedisConfig = (): RedisConfig => {
    let redisHost : string|undefined = process.env.REDIS_HOST;
    let redisPort : string|undefined = process.env.REDIS_PORT;
    let redisUsername : string|undefined = process.env.REDIS_USER;
    let redisPassword : string|undefined = process.env.REDIS_PASSWORD;
    let redisDb : string|undefined = process.env.REDIS_DB;

    if (!redisHost) throw new Error("REDIS_HOST is not defined");
    if (!redisPort) throw new Error("REDIS_PORT is not defined");
    if (!redisUsername) throw new Error("REDIS_USER is not defined");
    if (!redisPassword) throw new Error("REDIS_PASSWORD is not defined");
    if (!redisDb) throw new Error("REDIS_DB is not defined");

    return {
        host: redisHost,
        port: parseInt(redisPort),
        username: redisUsername,
        password: redisPassword,
        db: parseInt(redisDb)
    };
}

export const getDatabaseConfig = (): DatabaseConfig => {
    return {
        redis: buildRedisConfig()
    };
}