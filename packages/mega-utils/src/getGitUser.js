/**
 * Created Date: Tuesday, August 28th 2018, 4:40:43 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, September 3rd 2018, 11:26:06 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { execSync } from 'child_process';

export default function getGitUser() {
  let name = null;
  let email = null;
  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (e) {} // eslint-disable-line
  name = name && name.toString().trim();
  email = email && email.toString().trim();
  return { name, email };
}
