interface Device {
  login: string;
  password: string;
  ip: string;
  device_id?: string;
  device_name?: string;
  description?: string;
  device_online?: number;
}

interface DeviceInfo {
  result: {
    machinename: string;
    serial: string;
    userid: string;
  };
  error_code?: string;
  errno?: number;
}
