import dotenv from 'dotenv';

import { PinoLogger } from './shared/libs/Logger/index.js';
import { RestApplication } from './rest/index.js';
import { NodeEnv } from './shared/types/nodeEnv.js';

dotenv.config();
async function bootstrap() {
  const logger = new PinoLogger(process.env.NODE_ENV as NodeEnv);

  const application = new RestApplication(logger);

  await application.init();
  logger.info(`PORT: ${process.env.PORT}`);
}

bootstrap();
