import { config } from 'dotenv';
import { getConnection, createConnection } from 'typeorm';



async function createDbIfNotExists() {
    const connection = await createConnection(
        {
            name: 'appdb',
            type: process.env.TYPEORM_CONNECTION,
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT || ''),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            logging: false,
            synchronize: true,

        } as any
    )

    try {
        const queryRunner = connection.createQueryRunner();
        await queryRunner.query(`CREATE DATABASE IF NOT EXISTS ${process.env.TYPEORM_DATABASE} CHARACTER SET utf8 COLLATE utf8_unicode_ci;`)
    }
    finally {
        await connection.close();
    }
}


if (require.main === module) {
    config();
    createDbIfNotExists().catch(e => {
        console.error(e);
        process.exit(1)
    });
}

