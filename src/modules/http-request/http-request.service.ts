import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IDeviceInfoSerial, IGeneralMachineName, ISIPUserID, RPCApi } from '../driver/rpc.api';

@Injectable()
export class HttpRequestService {
  constructor(private readonly httpService: HttpService) {}
  createDahuaApi(host: string, username: string, password: string) {
    return RPCApi(this.httpService, { host, username, password });
  }
  async getMachineId(rpcApi: any): Promise<IGeneralMachineName> {
    try {
      return await rpcApi.getMachineId();
    } catch (error) {
      console.error('Error fetching machine ID:', error.message);
      return undefined;
    }
  }
  async getSerialNumber(rpcApi: any): Promise<IDeviceInfoSerial> {
    try {
      return await rpcApi.getSerialNumber();
    } catch (error) {
      console.error('Error fetching serial number:', error.message);
      return undefined;
    }
  }
  async getSipUserId(rpcApi: any): Promise<ISIPUserID> {
    try {
      return await rpcApi.getSipUserId();
    } catch (error) {
      console.error('Error fetching SIP User ID:', error.message);
      return undefined;
    }
  }
  async getAccessCardFind(rpcApi: any): Promise<any> {
    try {
      return await rpcApi.accessCardFind();
    } catch (error) {
      console.error('Error fetching find card', error.message);
      return undefined;
    }
  }
  async checkConnection(rpcApi: any): Promise<boolean> {
    try {
      await rpcApi.getMachineId(); // Можно использовать любой другой метод, который подтверждает успешное подключение
      return true;
    } catch (error) {
      console.error('Connection check failed:', error.message);
      return false;
    }
  }
  async removeAllCards(rpcApi: any): Promise<any> {
    try {
      return await rpcApi.accessCardRemoveAll();
    } catch (error) {
      console.error('Error fetching find card', error.message);
      return undefined;
    }
  }
  async removeAllUsers(rpcApi: any): Promise<any> {
    try {
      return await rpcApi.accessUserRemoveAll();
    } catch (error) {
      console.error('Error fetching find card', error.message);
      return undefined;
    }
  }

  async insertMultiUsers(rpcApi: any, data: any): Promise<any> {
    try {
      return await rpcApi.insertMultiUsers1(data);
    } catch (error) {
      console.error('Error fetching insert users', error.message);
      return undefined;
    }
  }

  async insertMultiCards(rpcApi: any, data: any): Promise<any> {
    try {
      return await rpcApi.insertMultiCards(data);
    } catch (error) {
      console.error('Error fetching find card', error.message);
      return undefined;
    }
  }

  async insertCard(rpcApi: any, data: any): Promise<any> {
    try {
      return await rpcApi.insertCard(data);
    } catch (error) {
      console.error('Error fetching find card', error.message);
      return undefined;
    }
  }
}
