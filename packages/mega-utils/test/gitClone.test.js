/**
 * Created Date: Wednesday, March 27th 2019, 1:50:26 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, March 28th 2019, 11:34:38 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import rm from 'rimraf';
import { join } from 'path';
import gitClone from '../lib/gitClone';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

describe('gitClone', () => {
  test('checkout', done => {
    rm(join(__dirname, './fixtures/git-clone/dist'), () => {
      gitClone(
        'git@github.com:hanjingboo/bash-color.git',
        join(__dirname, './fixtures/git-clone/dist'),
        {
          checkout: '47b524df5cf853e383c454f21d8fe0844cbae55b',
        },
        err => {
          if (err) {
            done(err);
          }
          rm(join(__dirname, './fixtures/git-clone/dist/.git'), () => {
            assertBuildResult(join(__dirname, './fixtures/git-clone'));
            done();
          });
        },
      );
    });
  });
});
