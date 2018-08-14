import { join } from 'path';
import getEntry from '../src/utils/getEntry';

const fixtures = join(__dirname, 'fixtures/getEntry');

describe('getEntry', () => {
  test('no config', () => {
    const entry = getEntry({
      cwd: join(fixtures, 'no-config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      index: './src/index.js',
    });
  });

  test('no config (dev)', () => {
    const entry = getEntry({
      cwd: join(fixtures, 'no-config'),
      isBuild: false,
    });
    expect(entry.index.length).toBe(2);
    expect(entry.index[0].indexOf('webpackHotDevClient') > -1).toBe(true);
  });

  test('no config (jsx)', () => {
    const entry = getEntry({
      cwd: join(fixtures, 'no-config-jsx'),
      isBuild: true,
    });
    expect(entry).toEqual({
      index: './src/index.jsx',
    });
  });

  test('no config (ts)', () => {
    const entry = getEntry({
      cwd: join(fixtures, 'no-config-ts'),
      isBuild: true,
    });
    expect(entry).toEqual({
      index: './src/index.ts',
    });
  });

  test('no config (tsx)', () => {
    const entry = getEntry({
      cwd: join(fixtures, 'no-config-tsx'),
      isBuild: true,
    });
    expect(entry).toEqual({
      index: './src/index.tsx',
    });
  });

  test('config string', () => {
    const entry = getEntry({
      entry: './pages/a.js',
      cwd: join(fixtures, 'config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      a: './pages/a.js',
    });
  });

  test('config string (glob)', () => {
    const entry = getEntry({
      entry: './pages/*.js',
      cwd: join(fixtures, 'config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      a: './pages/a.js',
      b: './pages/b.js',
    });
  });

  test('config array', () => {
    const entry = getEntry({
      entry: ['./pages/a.js', './extra/c.js'],
      cwd: join(fixtures, 'config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      a: './pages/a.js',
      c: './extra/c.js',
    });
  });

  test('config array (glob)', () => {
    const entry = getEntry({
      entry: ['./pages/*.js', './extra/c.js'],
      cwd: join(fixtures, 'config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      a: './pages/a.js',
      b: './pages/b.js',
      c: './extra/c.js',
    });
  });

  test('config object', () => {
    const entry = getEntry({
      entry: { a: './a/b.js' },
      cwd: join(fixtures, 'config'),
      isBuild: true,
    });
    expect(entry).toEqual({
      a: './a/b.js',
    });
  });

  test('error if entry is not String, Array or Plain Object', () => {
    [1, null, true, false, function() {}].forEach(entry =>
      expect(() => getEntry({ entry })).toThrow(
        `entry should be String, Array or Plain Object, but got ${entry}`,
      ),
    );
  });
});
