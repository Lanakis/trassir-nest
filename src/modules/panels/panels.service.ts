import { Injectable, Inject } from '@nestjs/common';
import { PanelsRepository } from './repository/panels.repository';
import { Panels } from './entities/panels.entity';
import { Connection } from 'mysql2/promise';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UpdatePanelsDto } from './dto/update-panels.dto';
import { CreatePanelsDto } from './dto/create-panels.dto';
import { RowDataPacket } from 'mysql2';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpRequestService } from '../http-request/http-request.service';

@Injectable()
export class PanelsService {
  constructor(
    readonly panelsRepository: PanelsRepository,
    @Inject('MYSQL_CONNECTION') private readonly mysqlConnection: Connection,
    private readonly httpRequestService: HttpRequestService,
  ) {}

  async create(createPanelsDto: CreatePanelsDto): Promise<Panels> {
    const panel = this.panelsRepository.create(createPanelsDto);
    await this.panelsRepository.persistAndFlush(panel);
    return panel;
  }

  async findAll(): Promise<[Panels[], number]> {
    return await this.panelsRepository.findAndCount({});
  }

  async findOne(id: string): Promise<Panels> {
    return await this.panelsRepository.findOneOrFail({ id });
  }

  find(ip: string): Observable<Panels> {
    return from(this.panelsRepository.findOneOrFail({ ip: ip })).pipe(
      catchError((err) => {
        console.error('Ошибка при поиске панели:', err);
        throw err; // Перебрасываем ошибку для обработки внешними средствами
      }),
    );
  }

  async findByIp(ip: string): Promise<any> {
    const a = await this.panelsRepository.findOne({ ip: ip });
    return a;
  }

  async update(id: string, updatePanelsDto: UpdatePanelsDto): Promise<Panels> {
    const panel = await this.panelsRepository.update(id, updatePanelsDto);
    await this.panelsRepository.flush();
    return panel;
  }

  async remove(id: string): Promise<Panels> {
    const panel = await this.panelsRepository.findOneOrFail({ id });
    await this.panelsRepository.removeAndFlush(panel);
    return panel;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncWithAsterisk(): Promise<void> {
    try {
      const [results] = await this.mysqlConnection.query('SELECT * FROM panels_open;');
      const rows = results as RowDataPacket[];

      if (rows.length === 0) {
        console.log('Нет данных для обработки');
        return;
      }

      for (const element of rows) {
        try {
          const dahuaApi = this.httpRequestService.createDahuaApi(element.ip, element.login, element.password);

          const machine_id = await this.httpRequestService.getMachineId(dahuaApi);
          const serial_number = await this.httpRequestService.getSerialNumber(dahuaApi);
          const sip_user_id = await this.httpRequestService.getSipUserId(dahuaApi);
          const isOnline = await this.httpRequestService.checkConnection(dahuaApi);

          const existingPanel = await this.findByIp(element.ip);
          if (!existingPanel) {
            const panel = new CreatePanelsDto();
            panel.login = element.login;
            panel.password = element.password;
            panel.ip = element.ip;
            panel.device_id = machine_id ? machine_id.table.General.MachineName : '';
            panel.device_name = sip_user_id ? sip_user_id.table.SIP.UserID : '';
            panel.description = serial_number ? serial_number.table.DeviceInfo.Serial : '';
            panel.isOnline = isOnline;
            await this.create(panel);
          } else {
            const updatedPanel = new UpdatePanelsDto();
            updatedPanel.login = element.login;
            updatedPanel.password = element.password;
            updatedPanel.ip = element.ip;
            updatedPanel.device_id = machine_id ? machine_id.table.General.MachineName : existingPanel.device_id;
            updatedPanel.device_name = sip_user_id ? sip_user_id.table.SIP.UserID : existingPanel.device_name;
            updatedPanel.description = serial_number
              ? serial_number.table.DeviceInfo.Serial
              : existingPanel.description;
            updatedPanel.isOnline = isOnline;
            await this.update(existingPanel.id, updatedPanel);
          }
        } catch (err) {
          console.error('Ошибка обработки элемента:', err);
        }
      }

      console.log('Обработка завершена');
    } catch (err) {
      console.error('Ошибка выполнения запроса:', err);
    }
  }

}
