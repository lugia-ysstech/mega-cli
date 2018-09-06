/**
 * Created Date: Thursday, August 23rd 2018, 3:37:07 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import program from 'commander';
import chalk from 'chalk';

program.Command.prototype.missingArgument = function(name) {
  this.outputHelp();
  console.log();
  console.log(
    `  ${chalk.red('Missing required argument')} ${chalk.yellow(
      `<${name}>`,
    )}${chalk.red('.')}`,
  );
  console.log();
  process.exit(1);
};

export default () => {
  program._args.forEach((arg, i) => {
    if (arg.required && program.args[i] == null) {
      program.missingArgument(arg.name);
    }
  });
};
