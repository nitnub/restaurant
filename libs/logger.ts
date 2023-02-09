import chalk from 'chalk';
import fs from 'fs';

export default class Logger {
  // private static stream: fs.WriteStream = fs.createWriteStream(`auth.log`, {
  //   flags: 'a',
  // });

  public static info(args: any) {
    const timeStamp = `[${new Date().toLocaleString()}] [INFO] `;
    const message = typeof args === 'string' ? chalk.blue(args) : args;

    // this.stream.write(timeStamp + args + '\n');
    console.log(chalk.blue(timeStamp) + message);
  }

  public static warn = (args: any) => {
    const timeStamp = `[${new Date().toLocaleString()}] [WARN] `;
    const message = typeof args === 'string' ? chalk.yellow(args) : args;

    // this.stream.write(timeStamp + args + '\n');
    console.log(chalk.yellow(timeStamp) + message);
  };
  
  public static error = (args: any) => {
    const timeStamp = `[${new Date().toLocaleString()}] [ERROR] `;
    const message = typeof args === 'string' ? chalk.red(args) : args;

    // this.stream.write(timeStamp + args + '\n');
    console.log(chalk.red(timeStamp) + message);
  };

  // public static warn = (args: any) => {
  //   console.log(
  //     chalk.yellow`[${new Date().toLocaleString()}] [WARN] `,
  //     typeof args === 'string' ? chalk.yellow(args) : args
  //   );
  // };
  // public static error = (args: any) => {
  //   console.log(
  //     chalk.red`[${new Date().toLocaleString()}] [ERROR] `,
  //     typeof args === 'string' ? chalk.red(args) : args
  //   );
  // };
}
