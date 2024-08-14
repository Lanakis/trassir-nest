import { Injectable } from '@nestjs/common';
import { ExternalUsersRepository } from './repository/external-users.repository';
import { UpdateExternalUsersDto } from './dto/update-external-users.dto';
import { CreateExternalUsersDto } from './dto/create-external-users.dto';
import { ExternalUsers } from './entities/external-users.entity';
import { HttpRequestService } from '../http-request/http-request.service';
import { UserListResponse } from './interfaces/user-external.interface';
import { PanelsService } from '../panels/panels.service';

@Injectable()
export class ExternalUsersService {
  constructor(
    readonly externalUsersRepository: ExternalUsersRepository,
    private readonly httpRequestService: HttpRequestService,
    private readonly panelsService: PanelsService,
  ) {}

  async create(createExternalUsersDto: CreateExternalUsersDto): Promise<ExternalUsers> {
    const externalUser = this.externalUsersRepository.create(createExternalUsersDto);
    const foundedPanel = await this.panelsService.findOne(createExternalUsersDto.panel_id);
    externalUser.panel = foundedPanel;
    await this.externalUsersRepository.persistAndFlush(externalUser);
    const userListResponse: UserListResponse = {
      UserList: [
        {
          UserID: externalUser.user_id,
          UserName: externalUser.user_name,
          UserType: externalUser.user_type,
          UseTime: externalUser.use_time,
          IsFirstEnter: externalUser.is_first_enter,
          UserStatus: externalUser.user_status,
          Authority: externalUser.authority,
          CitizenIDNo: externalUser.citizen_id_no,
          Password: externalUser.password,
          Doors: externalUser.doors,
          ValidFrom: externalUser.valid_from,
          ValidTo: externalUser.valid_to,
          VTOPosition: externalUser.vto_position,
          RoomNo: externalUser.room_no,
          IsSubscribed: externalUser.is_subscribed,
          MobileInfo: externalUser.mobile_info,
          Account: externalUser.account,
        },
      ],
    };

    const dahuaApi = this.httpRequestService.createDahuaApi(foundedPanel.ip, foundedPanel.login, foundedPanel.password);
    await this.httpRequestService.insertMultiUsers(dahuaApi, userListResponse);
    return externalUser;
  }

  async findAll(): Promise<[ExternalUsers[], number]> {
    return await this.externalUsersRepository.findAndCount({});
  }

  async findOne(id: string): Promise<ExternalUsers> {
    return await this.externalUsersRepository.findOneOrFail({ id }, { populate: ['panel'] });
  }

  async update(id: string, externalUsersDto: UpdateExternalUsersDto): Promise<ExternalUsers> {
    const externalUser = await this.externalUsersRepository.update(id, externalUsersDto);
    await this.externalUsersRepository.flush();
    return externalUser;
  }

  async remove(id: string): Promise<ExternalUsers> {
    const externalUser = await this.externalUsersRepository.findOneOrFail({ id });
    await this.externalUsersRepository.removeAndFlush(externalUser);
    return externalUser;
  }
}
