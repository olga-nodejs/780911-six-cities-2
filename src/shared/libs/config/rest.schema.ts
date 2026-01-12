import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  MOCK_API_PORT: number;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_HOST: string;
  ME_CONFIG_MONGODB_ADMINUSERNAME: string;
  ME_CONFIG_MONGODB_ADMINPASSWORD: string;
  ME_CONFIG_BASICAUTH_USERNAME: string;
  ME_CONFIG_BASICAUTH_PASSWORD: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET: string;
  HOST: string;
  STATIC_DIRECTORY_PATH: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000,
  },
  MOCK_API_PORT: {
    doc: 'Port for mock api json-server',
    format: 'port',
    env: 'MOCK_API_PORT',
    default: 8000,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_USER: {
    doc: 'login to connect to mongo db',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'password to connect to monfo db',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to Mongo DB',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_HOST: {
    doc: 'Host to connect to Mongo DB',
    format: String,
    env: 'DB_HOST',
    default: 'localhost',
  },
  ME_CONFIG_MONGODB_ADMINUSERNAME: {
    doc: 'mongo ui auth login',
    format: String,
    env: 'ME_CONFIG_MONGODB_ADMINUSERNAME',
    default: null,
  },
  ME_CONFIG_MONGODB_ADMINPASSWORD: {
    doc: 'mongo ui auth password',
    format: String,
    env: 'ME_CONFIG_MONGODB_ADMINPASSWORD',
    default: null,
  },
  ME_CONFIG_BASICAUTH_USERNAME: {
    doc: 'basic auth login',
    format: String,
    env: 'ME_CONFIG_BASICAUTH_USERNAME',
    default: null,
  },
  ME_CONFIG_BASICAUTH_PASSWORD: {
    doc: 'basic auth password',
    format: String,
    env: 'ME_CONFIG_BASICAUTH_PASSWORD',
    default: null,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities',
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost',
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: 'static',
  },
});
