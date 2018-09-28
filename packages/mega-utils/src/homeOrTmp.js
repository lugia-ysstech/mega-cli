/**
 * Created Date: Wednesday, August 29th 2018, 5:02:45 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, August 29th 2018, 5:04:49 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { homedir, tmpdir } from 'os';

// cache result
export default homedir() || tmpdir();
