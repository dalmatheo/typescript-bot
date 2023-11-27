import chalk from "chalk";

export function printError(...message: any[]) {
  console.error(chalk.red("[Error]", ...message));
}

export function printInfo(...message: any[]) {
  console.log(chalk.yellow("[Info]", ...message));
}

export function printSucess(...message: any[]) {
  console.log(chalk.green("[Sucess]", ...message));
}
