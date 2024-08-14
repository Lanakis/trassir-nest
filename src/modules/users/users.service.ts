import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { UserNotFoundException } from './exceptions/users-not-found.exception';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users } from './entities/users.entity';
import { UsersExistsException } from './exceptions/users-exists.exception';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(readonly usersRepository: UsersRepository) {}
  async onModuleInit() {
    try {
      await this.usersRepository.findOneOrFail({ login: 'trueipuser' });
    } catch {
      const user = new CreateUsersDto();
      user.login = 'trueipuser';
      user.password = 'Root1337';
      await this.create(user);
    }
  }

  async create(createUsersDto: CreateUsersDto) {
    createUsersDto.login = createUsersDto.login.toLowerCase();
    const exists = await this.usersRepository.findOne({
      login: createUsersDto.login,
    });
    if (exists) {
      throw new UsersExistsException();
    }
    const hashedPassword = await argon2.hash(createUsersDto.password); // хэшируем пароль библиотекой argon2
    const user = this.usersRepository.create({
      ...createUsersDto,
      password: hashedPassword, // Использование хешированного пароля
    });
    await this.usersRepository.create(user);
    await this.usersRepository.upsert(user);
    return user;
  }

  async findAll(): Promise<[Users[], number]> {
    return await this.usersRepository.findAndCount({});
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({ id: id }, {});
    } catch (e) {
      console.log(e);
      throw new UserNotFoundException();
    }
  }

  async findBySessionId(data: string) {
    try {
      return await this.usersRepository.findOneOrFail({ session: data }, {});
    } catch (e) {
      console.log(e);
      throw new UserNotFoundException();
    }
  }

  async findByLogin(data: string) {
    try {
      return await this.usersRepository.findOneOrFail({ login: data }, {});
    } catch (e) {
      console.log(e);
      throw new UserNotFoundException();
    }
  }

  async update(id: string, updateUsersDto: UpdateUsersDto) {
    if (updateUsersDto.password) {
      // Если предоставлен новый пароль, хешировать его перед обновлением
      updateUsersDto.password = await argon2.hash(updateUsersDto.password);
    }

    const user = await this.usersRepository.update(id, updateUsersDto);

    await this.usersRepository.flush();
    return user;
  }

  async remove(id: string) {
    const user = await this.usersRepository.find({ id: id }, {});
    await this.usersRepository.removeAndFlush(user);
    return user;
  }
}
