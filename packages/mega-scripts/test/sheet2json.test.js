/**
 * Created Date: Friday, September 14th 2018, 1:52:09 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 14th 2018, 5:28:19 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */
import { resolve } from 'path';
import { readFileSync } from 'fs';
import rm from 'rimraf';
import { sheet2json, error } from '../lib/utils/sheet2json';

describe('sheet2json', () => {
  test('error()', () => {
    expect(error(1, 'err info')).toEqual(new Error('[sheet2json 1]: err info'));
  });

  test('500 error', async () => {
    try {
      await sheet2json();
    } catch (error) {
      expect(() => {
        throw error;
      }).toThrow('[sheet2json 500]: must specify a filePath');
    }
  });

  test('510 error', async () => {
    const fileName = './xxxx.csv';
    try {
      await sheet2json(fileName);
    } catch (error) {
      expect(() => {
        throw error;
      }).toThrow(
        `[sheet2json 510]: ${resolve(
          process.cwd(),
          fileName,
        )}: No such file or directory`,
      );
    }
  });

  test('540 error', async () => {
    const filePath = resolve(__dirname, './fixtures/sheet/A4X_2013.xls');
    let error;
    try {
      await sheet2json(filePath, 's1');
    } catch (e) {
      error = e;
    }
    expect(() => {
      throw error;
    }).toThrow('[sheet2json 540]: Sheet s1 cannot be found');

    expect(await sheet2json(filePath)).toEqual([]);
  });

  test('sheetName', async () => {
    const filePath = resolve(__dirname, './fixtures/sheet/AutoFilter.xlsx');
    expect((await sheet2json(filePath))[0]).toEqual({
      Code: '5',
      Format: 'XLSX (Excel 2007+)',
      Importance: '1',
      Library: 'js-xlsx',
      Notes: 'Strict Open XML Spreadsheet, Excel Workbook',
    });
  });

  test('readAll', async () => {
    const filePath = resolve(__dirname, './fixtures/sheet/AutoFilter.xlsx');
    const result = await sheet2json(filePath, { readAll: true });
    expect(Object.keys(result)).toEqual([
      'No Filter',
      'Just Filter',
      'One Cond',
      'Two Cond',
      'Top10',
      'Bot10',
      'Average',
      'NE',
      'GT',
      'AND Bounding',
      'OR Range',
    ]);
  });

  test('output', async () => {
    const filePath = resolve(__dirname, './fixtures/sheet/AutoFilter.xlsx');
    const outputPath = resolve(__dirname, './fixtures/sheet/AutoFilter.json');
    const result = await sheet2json(filePath, {
      readAll: true,
      outputPath,
    });
    expect(readFileSync(outputPath, 'utf8')).toBe(JSON.stringify(result));
    rm.sync(outputPath);
  });
});
