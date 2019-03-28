import rm from 'rimraf';
import { join } from 'path';
import download from '../lib/downloadGitRepo';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

describe('download-git-repo', () => {
  // const filter = (x) => {
  //   return x[0] !== '.' || x === '.git';
  // };

  const runStyle = (type, style) => {
    let clone = false;
    const getDistPath = post => join(__dirname, 'fixtures', type, post);
    if (style === 'clones') clone = true;

    it(`${style} master branch by default`, done => {
      const dist = getDistPath('./master/dist');
      rm(dist, () => {
        download(
          `${type}:flipxfx/download-git-repo-fixture`,
          dist,
          { clone },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./master'));
            done();
          },
        );
      });
    });

    it(`${style} a branch`, done => {
      const dist = getDistPath('./my-branch/dist');
      rm(dist, () => {
        download(
          `${type}:flipxfx/download-git-repo-fixture#my-branch`,
          dist,
          { clone },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./my-branch'));
            done();
          },
        );
      });
    });

    it(`${style} a branch with slashes`, done => {
      const dist = getDistPath('./my-branch-with-slashes/dist');
      rm(dist, () => {
        download(
          `${type}:flipxfx/download-git-repo-fixture#my/branch/with/slashes`,
          dist,
          { clone },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./my-branch-with-slashes'));
            done();
          },
        );
      });
    });

    it(`${style} master branch with specific origin`, done => {
      const dist = getDistPath('./master/dist');
      rm(dist, () => {
        download(
          `${type}:${type}.com:flipxfx/download-git-repo-fixture`,
          dist,
          { clone },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./master'));
            done();
          },
        );
      });
    });

    it(`${style} master branch with specific origin and protocol`, done => {
      const dist = getDistPath('./master/dist');
      rm(dist, () => {
        download(
          `${type}:https://${type}.com:flipxfx/download-git-repo-fixture`,
          dist,
          { clone },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./master'));
            done();
          },
        );
      });
    });
  };

  const runType = function(type) {
    runStyle(type, 'downloads');

    // TODO: 错误 gitlab 和 bitbucket 不能使用 clone
    // 'git clone' failed with status 128
    // 不是目录已存在的错误
    // 不是权限的错误
    // 有 protocol 可以
    // gitlab 和 bitbucket 必须带 protocol？
    if (type === 'github') {
      runStyle(type, 'clones');

      const getDistPath = post => join(__dirname, 'fixtures', type, post);
      const dist = getDistPath('./master/dist');

      it('clones master branch with specific origin without type', done => {
        rm(dist, () => {
          download(
            `${type}.com:flipxfx/download-git-repo-fixture`,
            dist,
            { clone: true },
            err => {
              if (err) return done(err);
              assertBuildResult(getDistPath('./master'));
              done();
            },
          );
        });
      });

      it('clones master branch with specific origin and protocol without type', done => {
        rm(dist, () => {
          download(
            `https://${type}.com:flipxfx/download-git-repo-fixture`,
            dist,
            { clone: true },
            err => {
              if (err) return done(err);
              assertBuildResult(getDistPath('./master'));
              done();
            },
          );
        });
      });
    }
  };

  describe('via github', () => {
    runType('github');

    it('downloads from github by default', done => {
      const dist = join(__dirname, 'fixtures', 'github', './master/dist');
      rm(dist, () => {
        download('flipxfx/download-git-repo-fixture', dist, err => {
          if (err) return done(err);
          assertBuildResult(join(__dirname, 'fixtures', 'github', './master'));
          done();
        });
      });
    });
  });

  describe('via gitlab', () => {
    runType('gitlab');
  });

  describe('via bitbucket', () => {
    runType('bitbucket');
  });

  describe('via direct', () => {
    const getDistPath = post => join(__dirname, 'fixtures', 'gitlab', post);

    it('downloads master branch', done => {
      const dist = getDistPath('./master/dist');
      rm(dist, () => {
        download(
          'direct:https://gitlab.com/flipxfx/download-git-repo-fixture/repository/archive.zip',
          dist,
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./master'));
            done();
          },
        );
      });
    });

    it('downloads a branch', done => {
      const dist = getDistPath('./my-branch/dist');
      rm(dist, () => {
        download(
          'direct:https://gitlab.com/flipxfx/download-git-repo-fixture/repository/archive.zip?ref=my-branch',
          dist,
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./my-branch'));
            done();
          },
        );
      });
    });

    it('clones master branch', done => {
      const dist = getDistPath('./master/dist');
      rm(dist, () => {
        download(
          'direct:https://gitlab.com/flipxfx/download-git-repo-fixture.git',
          dist,
          { clone: true },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./master'));
            done();
          },
        );
      });
    });

    it('clones a branch', done => {
      const dist = getDistPath('./my-branch/dist');
      rm(dist, () => {
        download(
          'direct:https://gitlab.com/flipxfx/download-git-repo-fixture.git#my-branch',
          dist,
          { clone: true },
          err => {
            if (err) return done(err);
            assertBuildResult(getDistPath('./my-branch'));
            done();
          },
        );
      });
    });
  });
});
