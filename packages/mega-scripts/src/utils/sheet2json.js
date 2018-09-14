/**
 * Created Date: Wednesday, September 12th 2018, 6:08:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 14th 2018, 5:05:26 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */
import X from 'xlsx';
import { existsSync, writeFileSync } from 'fs';
import { resolve as pathResolve } from 'path';
import is from '@lugia/mega-utils/lib/is';

export const error = (code, msg) => new Error(`[sheet2json ${code}]: ${msg}`);

export function sheet2json(filePath, sheetname, opts = {}) {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return reject(error(500, 'must specify a filePath'));
    }
    filePath = pathResolve(process.cwd(), filePath);
    if (!existsSync(filePath)) {
      return reject(error(510, `${filePath}: No such file or directory`));
    }

    if (is.object(sheetname)) {
      opts = sheetname;
      sheetname = null;
    }
    sheetname = sheetname || opts.sheetname;
    delete opts.sheetname;
    const { outputPath, readAll, arrays, rawJs, ...readOpts } = opts;

    let wb = null;
    try {
      wb = X.readFile(filePath, readOpts);
    } catch (e) {
      return reject(error(520, `${filePath} error parsing: ${e}`));
    }
    if (!wb) {
      return reject(error(530, `${filePath} error parsing: empty workbook`));
    }

    const targetSheet = sheetname || (wb.SheetNames || [''])[0];
    let ws;
    try {
      ws = wb.Sheets[targetSheet];
      if (!ws) {
        return reject(error(540, `Sheet ${targetSheet} cannot be found`));
      }
    } catch (e) {
      return reject(
        error(550, `error parsing ${filePath} ${targetSheet}: ${e}`),
      );
    }

    const jsonOpts = {
      header: arrays ? 1 : undefined,
      raw: rawJs ? true : undefined,
    };
    const sheetToJson = ws => X.utils.sheet_to_json(ws, jsonOpts);
    let result = {};
    if (readAll) {
      wb.SheetNames.forEach(s => {
        result[s] = sheetToJson(wb.Sheets[s]);
      });
    } else {
      result = sheetToJson(ws);
    }

    if (outputPath) {
      try {
        writeFileSync(
          pathResolve(process.cwd(), outputPath),
          JSON.stringify(result),
          'utf8',
        );
      } catch (e) {
        return reject(error(560, e));
      }
    }

    resolve(result);
  });
}
