import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName() {
    return '--help';
  }

  public execute(..._args: string[]): void {
    console.info(
      chalk.blue(`
      Программа для подготовки данных для REST API сервера.
      Пример:
          cli.js --<command> [--arguments]
      Команды:
          --version:                        # выводит номер версии
          --help:                           # печатает этот текст
          --import <filepath> <dblogin> <dbpassword> <dbhost> <dbPort> <dbName> <salt>:                  # импортирует данные из TSV
          --generate <n> <filepath> <url>   # генерирует mock TSV файл
  `)
    );
  }
}
