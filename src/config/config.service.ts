require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public getServer() {
    console.log(this.getValue('SSL_KEY'));
    return {
      host: this.getValue('HOST', true),
      port: this.getValue('PORT', true),
      protocol: this.getValue('PROTOCOL', true),
      sslKey: this.getValue('SSL_KEY', false),
      sslCert: this.getValue('SSL_CERT', false),
    };
  }

  public getDb() {
    return {
      host: this.getValue('POSTGRES_HOST', true),
      port: this.getValue('POSTGRES_PORT', true),
      user: this.getValue('POSTGRES_USER', true),
      password: this.getValue('POSTGRES_PASSWORD', false),
      dbname: this.getValue('POSTGRES_DATABASE', false),
      seeds: this.getValue('SEEDS_RUN', false),
      logPath: this.getValue('LOG_PATH', false),
      passphrase: this.getValue('SSL_PASSWORD', false),
    };
  }

  public getJwtConfig() {
    return {
      secretKey: this.getValue('JWT_SECRET_KEY', true),
      expiredAt: this.getValue('JWT_EXPIRED_AT', true),
      refreshSecretKey: this.getValue('JWT_REFRESH_SECRET_KEY', true),
      refreshExpiredAt: this.getValue('JWT_REFRESH_EXPIRED_AT', true),
    };
  }

  public getExternalDbConfig() {
    return {
      host: this.getValue('EXTERNAL_DB_HOST', true),
      username: this.getValue('EXTERNAL_DB_USERNAME', true),
      db_name: this.getValue('EXTERNAL_DB_NAME', true),
      password: this.getValue('EXTERNAL_DB_PASSWORD', true),
      port: this.getValue('EXTERNAL_DB_PORT', true),
    };
  }
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }
}

const configService = new ConfigService(process.env);
export { configService };
