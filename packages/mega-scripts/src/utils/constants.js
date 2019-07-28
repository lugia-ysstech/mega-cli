/**
 * Created Date: Thursday, November 8th 2018, 9:53:29 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Sunday, July 28th 2019, 5:04:38 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

export const CONFIG_FILE_NAME = 'lugia.config.js';

export const CONFIG_DIR = './config/';

export const MOCK_CONFIG_FILE = 'mock.config.js';

export const MOCK_CONFIG_DIR = './mock/';

export const DEFAULT_BROWSER_SYNC_PORT =
  parseInt(process.env.BROWSER_SYNC_PORT, 10) || 3000;

export const DLL_OUTPUT = './dll';

export const DLL_NAME = 'DevDLL';

export const PUBLIC_DIR = './public';

export const PKG_JSON = 'package.json';

export const SRC_DIR = './src';

export const BUILD_APP_DIR = './dist';

export const BUILD_LIB_DIR = './lib';

/**
 * 存放用户的项目源码 pages、models 等文件夹
 * 需要存储在项目目录下
 * 相对路径
 */
export const PAGES_DIR = `./pages`;
export const COMPONENTS_DIR = `./components`;
export const MODELS_DIR = `./models`;
export const ASSETS_DIR = `./assets`;
