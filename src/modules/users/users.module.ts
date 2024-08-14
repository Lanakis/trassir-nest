import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';

@Global()
@Module({
  controllers: [UsersController],
  imports: [MikroOrmModule.forFeature({ entities: [Users] })],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
