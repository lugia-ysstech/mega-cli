/**
 * Created Date: Monday, September 3rd 2018, 10:10:28 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, November 8th 2018, 7:49:14 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

// TODO: Use Inquirer
// https://github.com/SBoudrias/Inquirer.js/#question
module.exports = {
  prompts: {
    lint: {
      type: 'confirm',
      message: 'Use a linter?',
    },
    lintConfig: {
      when: 'lint',
      type: 'list',
      message: 'Pick a lint config',
      choices: ['standard', 'airbnb', 'none'],
    },
  },
};
