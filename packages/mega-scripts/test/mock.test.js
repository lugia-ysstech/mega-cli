import { join } from 'path';
import { fork } from 'child_process';
import got from 'got';

const fixtures = join(__dirname, './fixtures');

describe('mock', () => {
  test('mock', done => {
    const PORT = 8987;
    const cwd = join(fixtures, 'mock');
    const p = fork(require.resolve('../lib/commands/dev.js'), [], {
      cwd,
      env: {
        CLEAR_CONSOLE: 'none',
        BROWSER: 'none',
        BROWSER_SYNC: 'none',
        PORT,
      },
    });

    p.on('message', data => {
      if (data && data.type && data.type === 'STARTING') {
        Promise.all([
          got(`http://localhost:${PORT}/a`),
          got(`http://localhost:${PORT}/b`),
          got(`http://localhost:${PORT}/c`),
          got.post(`http://localhost:${PORT}/c`, {
            body: { a: 'b' },
            json: true,
          }),
        ]).then(res => {
          const data = res.map(item => item.body);
          expect(data[0]).toBe('a');
          expect(JSON.parse(data[1])).toEqual({ data: 'b' });
          expect(JSON.parse(data[2])).toEqual({ c: true });
          expect(data[3]).toEqual({ a: 'b' });
          p.kill('SIGINT');
        });
      }
    });

    p.on('close', (code, signal) => {
      if (code === 0 || signal === 'SIGINT') {
        done();
      } else {
        throw new Error(`code: ${code}, signal: ${signal}`);
      }
    });

    p.on('error', err => {
      throw new Error(err);
    });
  });
});
