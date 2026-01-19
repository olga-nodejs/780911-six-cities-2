#!/usr/bin/env node
import 'reflect-metadata';

import {
  CLIApplication,
  GenerateCommand,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
function bootstrap() {
  const cliApplication = new CLIApplication();
  const logger = new PinoLogger();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(logger),
    new GenerateCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
