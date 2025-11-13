import chalk from 'chalk';

export const generateErrorMessage = (error: unknown, message: string) => {
  console.error(chalk.red(message));

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  }
};
