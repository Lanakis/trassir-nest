import { HttpService } from '@nestjs/axios';
import crypto from 'node:crypto';

/**
 * Интерфейс для General.MachineName
 */
export interface IGeneralMachineName {
  table: {
    General: {
      MachineName: string;
    };
  };
}

/**
 * Интерфейс для DeviceInfo.Serial
 */
export interface IDeviceInfoSerial {
  table: {
    DeviceInfo: {
      Serial: string;
    };
  };
}

/**
 * Интерфейс для SIP.UserID
 */
export interface ISIPUserID {
  table: {
    SIP: {
      UserID: string;
    };
  };
}

/**
 * Создает экземпляр API для работы с RPC.
 *
 * @param httpService - Экземпляр HttpService из NestJS.
 * @param options - Опции подключения, содержащие хост, имя пользователя и пароль.
 * @returns Объект с методами для взаимодействия с API.
 */
export const RPCApi = (httpService: HttpService, options: { host: string; username: string; password: string }) => {
  const { host, username, password } = options;
  const axios = httpService.axiosRef;

  /**
   * Получает заголовок Digest Authentication для запросов.
   *
   * @param url - URL для запроса.
   * @param path - Путь для запроса.
   * @param method - Метод HTTP запроса (GET, POST, PUT, DELETE).
   * @returns Заголовок Digest Authentication.
   */
  const getDigestAuthHeader = async (url: URL, path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
    try {
      // Выполняем запрос для получения заголовка WWW-Authenticate
      const response = await axios.get(url.toString());
      return response.headers['www-authenticate'];
    } catch (error) {
      if (
          !error.response ||
          error.response.status !== 401 ||
          !error.response.headers ||
          !error.response.headers['www-authenticate']
      ) {
        throw error;
      }

      // Разбираем заголовок WWW-Authenticate
      const digest = Object.fromEntries(
          error.response.headers['www-authenticate']
              .replace('Digest ', '')
              .replace(/['"]/g, '')
              .split(', ')
              .map((authPart) => authPart.split('=')),
      );

      // Функция для вычисления MD5 хэша
      const md5 = (value) => crypto.createHash('md5').update(value).digest('hex');

      // Извлекаем необходимые параметры для Digest Authentication
      const { realm, nonce, qop, opaque } = digest;
      const client_nonce = crypto.randomBytes(24).toString('hex');
      const nonce_count = '00000001';

      // Вычисляем хэши HA1 и HA2
      const HA1 = md5(`${username}:${realm}:${password}`);
      const HA2 = md5(`${method}:${path}`);
      const response = md5(`${HA1}:${nonce}:${nonce_count}:${client_nonce}:auth:${HA2}`);

      // Формируем заголовок Digest Authentication
      return (
          'Digest ' +
          Object.entries({
            username,
            realm,
            nonce,
            uri: path,
            qop,
            nc: nonce_count,
            cnonce: client_nonce,
            response,
            opaque,
          })
              .map(([key, value]) => `${key}="${value}"`)
              .join(', ')
      );
    }
  };

  /**
   * Парсит текст ответа от сервера в объект.
   *
   * @param response_text - Текст ответа от сервера.
   * @returns Объект, полученный из текста ответа.
   */
  const parseResponse = <T>(response_text): T => {
    const splitPathToParts = (path) => {
      const boundaries = new RegExp(['(\\]\\.)', '(\\[)', '(\\]\\[)'].join('|'), 'g');
      const ends = new RegExp('(])', 'g');
      return path.replace(boundaries, '.').replace(ends, '').split('.');
    };

    const lines = response_text.split('\n').filter((line) => line !== '');
    const entries = lines.map((part) => part.split('='));
    const path_parts = entries.map(([path, value]) => {
      const parts = splitPathToParts(path);
      const formattedValue = value ? value.replace(/\r/g, '') : '';
      return [parts, formattedValue];
    });

    const object = {};

    path_parts.forEach((part) => {
      const [path, value] = part;
      path.reduce((acc, key, i, array) => {
        const is_next_key_int = !isNaN(array[i + 1]);
        const is_last_element = i === array.length - 1;

        if (!acc[key]) {
          const initial_value = is_next_key_int ? [] : {};
          acc[key] = is_last_element ? value : initial_value;
        }

        return acc[key];
      }, object);
    });

    return object as T;
  };

  /**
   * Выполняет запрос к API с указанным методом и данными.
   *
   * @param path - Путь для запроса.
   * @param query - Параметры запроса.
   * @param method - Метод HTTP запроса (GET, POST, PUT, DELETE).
   * @param data - Данные для POST или PUT запроса.
   * @returns Результат запроса, преобразованный в объект.
   */
  const apiCall = async <T>(
      path: string,
      query: { [key: string]: string } = {},
      method?: any,
      data?: any,
  ): Promise<T> => {
    const url = new URL(`http://${host}${path}`);
    console.log(`http://${host}${path}`);

    Object.entries(query).forEach((value) => {
      url.searchParams.set(value[0], value[1]);
    });

    let digestAuth;

    try {
      let response_text;
      const config: any = {
        headers: { Authorization: digestAuth },
      };

      switch (method) {
        case 'POST':
          digestAuth = (await getDigestAuthHeader(url, path, 'POST')) as string;
          config.headers['Content-Type'] = 'application/json';
          config.headers['Accept'] = '*/*';
          config.headers['User-Agent'] = "Nodejs Trassir v1.0'";
          config.headers['Accept-Encoding'] = 'gzip, deflate, br';
          config.headers['Authorization'] = digestAuth;
          response_text = await axios.post(url.toString(), data, config);
          console.log(response_text);
          break;
        case 'PUT':
        case 'DELETE':
          console.log('DELETE');
          response_text = await axios.request({
            url: url.toString(),
            method: method.toLowerCase(),
            data: data || {}, // Если нет данных, передаем пустой объект
            ...config,
          });
          break;
        case 'GET':
          digestAuth = (await getDigestAuthHeader(url, path, 'GET')) as string;
          config.headers['Content-Type'] = 'application/json'; // Или другой соответствующий Content-Type
          config.headers['Accept'] = '*/*';
          config.headers['User-Agent'] = "Nodejs Trassir v1.0'";
          config.headers['Accept-Encoding'] = 'gzip, deflate, br';
          config.headers['Authorization'] = digestAuth;
          response_text = await axios.get(url.toString(), config);
          break;
        default:
          digestAuth = (await getDigestAuthHeader(url, path, 'GET')) as string;
          config.headers['Content-Type'] = 'application/json'; // Или другой соответствующий Content-Type
          config.headers['Accept'] = '*/*';
          config.headers['User-Agent'] = "Nodejs Trassir v1.0'";
          config.headers['Accept-Encoding'] = 'gzip, deflate, br';
          config.headers['Authorization'] = digestAuth;
          console.log(config);
          response_text = await axios.get(url.toString(), config);
          break;
      }
      if (response_text.status !== 200) {
        throw new Error(`Ошибка в ответе RPC: ${response_text.status} ${response_text.data}`);
      }

      return parseResponse<T>(response_text.data);
    } catch (error) {
      console.log(error);
      throw new Error(`Ошибка при запросе к RPC: ${error.message}`);
    }
  };

  return {
    /**
     * Получает идентификатор машины.
     *
     * @returns Объект с идентификатором машины.
     */
    async getMachineId(): Promise<IGeneralMachineName> {
      return await apiCall<IGeneralMachineName>('/cgi-bin/configManager.cgi', {
        action: 'getConfig',
        name: 'General.MachineName',
      });
    },

    /**
     * Получает идентификатор пользователя SIP.
     *
     * @returns Объект с идентификатором пользователя SIP.
     */
    async getSipUserId(): Promise<ISIPUserID> {
      return await apiCall<ISIPUserID>('/cgi-bin/configManager.cgi', { action: 'getConfig', name: 'SIP.UserID' });
    },

    /**
     * Получает серийный номер устройства.
     *
     * @returns Объект с серийным номером устройства.
     */
    async getSerialNumber(): Promise<IDeviceInfoSerial> {
      return await apiCall<IDeviceInfoSerial>('/cgi-bin/configManager.cgi', {
        action: 'getConfig',
        name: 'DeviceInfo.Serial',
      });
    },

    /**
     * Получает системную информацию.
     *
     * @returns Объект с системной информацией устройства.
     */
    async getSystemInfo(): Promise<IDeviceInfoSerial> {
      return await apiCall<IDeviceInfoSerial>('/cgi-bin/magicBox.cgi', { action: 'getSystemInfo' });
    },

    /**
     * Начинает поиск карт доступа.
     *
     * @returns Результат запроса для поиска карт доступа.
     */
    async accessCardStartFind(): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessCard.cgi', { action: 'getConfig', name: 'DeviceInfo.Serial' });
    },

    /**
     * Выполняет поиск карт доступа.
     *
     * @returns Результаты поиска карт доступа.
     */
    async accessCardFind(): Promise<any> {
      return await apiCall<any>('/cgi-bin/recordFinder.cgi', {
        action: 'find',
        name: 'AccessControlCard',
        count: '10000',
      });
    },

    /**
     * Выполняет действие с картой доступа.
     *
     * @returns Результат запроса для карты доступа.
     */
    async accessCardSome(): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessCard.cgi', { action: '' });
    },

    /**
     * Удаляет все карты доступа.
     *
     * @returns Результат запроса на удаление всех карт доступа.
     */
    async accessCardRemoveAll(): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessCard.cgi', { action: 'removeAll' });
    },

    /**
     * Удаляет всех пользователей доступа.
     *
     * @returns Результат запроса на удаление всех пользователей доступа.
     */
    async accessUserRemoveAll(): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessUser.cgi', { action: 'removeAll' });
    },

    /**
     * Вставляет несколько пользователей доступа.
     *
     * @param data - Данные пользователей для вставки.
     * @returns Результат запроса на вставку пользователей.
     */
    async insertMultiUsers1(data: any): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessUser.cgi', { action: 'insertMulti' }, 'POST', data);
    },

    /**
     * Вставляет несколько карт доступа.
     *
     * @param data - Данные карт доступа для вставки.
     * @returns Результат запроса на вставку карт доступа.
     */
    async insertMultiCards(data: any): Promise<any> {
      return await apiCall<any>('/cgi-bin/AccessCard.cgi', { action: 'insertMulti' }, 'POST', data);
    },

    /**
     * Вставляет карту доступа.
     *
     * @param data - Данные карты доступа.
     * @returns Результат запроса на вставку карты доступа.
     */
    async insertCard(data: any): Promise<any> {
      return await apiCall<any>(
          '/cgi-bin/recordUpdater.cgi',
          {
            action: 'insert',
            name: 'AccessControlCard',
            CardName: data.CardName,
            CardNo: data.CardNo,
            UserID: data.UserID,
            CardStatus: data.CardStatus,
            CardType: data.CardType,
          },
          'GET',
      );
    },

    /**
     * Открывает дверь.
     *
     * @param data - Данные для открытия двери (например, идентификатор пользователя).
     * @returns Результат запроса на открытие двери.
     */
    async openDoor(data: any): Promise<any> {
      return await apiCall<any>('/cgi-bin/accessControl.cgi', { action: 'openDoor', channel:'1', UserID: data, Type: 'Remote' }, 'GET');
    },

    /**
     * Удаляет несколько карт доступа.
     *
     * @param data - Массив серийных номеров карт для удаления.
     * @returns Результат запроса на удаление карт доступа.
     */
    async deleteCardMulti(data: string[]): Promise<any> {
      const queryParams: { [key: string]: string } = { action: 'removeMulti' };
      data.forEach((cardNo, index) => {
        queryParams[`CardNoList[${index}]`] = cardNo;
      });
      return await apiCall<any>('/cgi-bin/AccessCard.cgi', queryParams, 'GET');
    }
  };
};
