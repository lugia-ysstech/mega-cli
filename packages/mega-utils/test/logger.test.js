/**
 * Created Date: Monday, July 2nd 2018, 2:41:02 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import logger from '../lib/logger';

describe('[logger]', () => {
  it('debug', () => {
    logger.debug('debug is purple.');
  });

  it('info', () => {
    logger.info('info is cyan.');
  });

  it('warn', () => {
    logger.warn('warn is yellow.');
  });

  it('loading', () => {
    logger.loading('loading is yellow');
  });

  it('error', () => {
    logger.error('error is red.');
  });

  it('ok', () => {
    logger.ok('ok is green.');
  });

  it('create', () => {
    logger.create('info create');
  });

  it('list', () => {
    logger.list(['1.', '2. choose [two]', '3.'], '2. choose [two]');
  });

  it('line', () => {
    const test = '666666';
    const testLn = test.length;

    for (let index = 0; index <= testLn + 1; index += 1) {
      expect(logger.$line(test, index)).toBe('  ');
    }

    expect(logger.$line(test, testLn + 2)).toBe(' - ');
    expect(logger.$line(test, testLn + 3)).toBe(' -- ');
  });
});
