import { Module, Global } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';
import { configService } from '../../config/config.service';

@Global()
@Module({
  providers: [
    {
      provide: 'MYSQL_CONNECTION',
      useFactory: async () => {
        const { host, username, password, db_name, port } = configService.getExternalDbConfig();
        console.log('Attempting to connect to MySQL with:', { host, port, username, db_name });

        try {
          const connection = await createConnection({
            host,
            port: Number(port),
            user: username,
            password,
            database: db_name,
          });
          console.log(connection);
          console.log('MySQL connection established successfully');
          return connection;
        } catch (error) {
          console.error('Error establishing MySQL connection:', error);
          throw error;
        }
      },
    },
  ],
  exports: ['MYSQL_CONNECTION'],
})
export class MySQLModule {}
