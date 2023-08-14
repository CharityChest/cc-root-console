const yargs = require('yargs');
const crypto = require('crypto');

const argv = yargs
    .option('username', {
        alias: 'u',
        type: 'string',
        description: 'Provide username',
        demandOption: true
    })
    .help()
    .alias('help', 'h')
    .argv;

const hash = (password, salt , encoding = 'hex') => {
    return crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        'sha512'
    ).toString(encoding);
}

const randomUnsafe = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}

const clearPassword = randomUnsafe(16);

console.log(`hashed: "${hash(clearPassword, argv.username)}"`, `unhashed: ${clearPassword}`)