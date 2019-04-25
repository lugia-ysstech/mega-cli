/**
 * Created Date: Thursday, April 25th 2019, 10:58:33 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, April 25th 2019, 4:11:57 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { urlJoin, pathNormalize, pathJoin, normalize } from '../src/URI';

describe('URI', () => {
  describe('urlJoin', () => {
    it('should add leading slash and no trailing slash by default', () => {
      expect(urlJoin()).toBe('/');
      expect(urlJoin(undefined, 'foo')).toBe('/foo');
      expect(urlJoin('foo', null, 'bar')).toBe('/foo/bar');
      expect(urlJoin('foo', '', 'bar')).toBe('/foo/bar');
      expect(urlJoin('foo')).toBe('/foo');
      expect(urlJoin('/foo')).toBe('/foo');
      expect(urlJoin('/', '/foo')).toBe('/foo');
      expect(urlJoin('/', '//foo')).toBe('/foo');
      expect(urlJoin('/', '/foo//')).toBe('/foo');
      expect(urlJoin('/', '/foo/', '')).toBe('/foo');
      expect(urlJoin('/', '/foo/', '/')).toBe('/foo');
      expect(urlJoin('foo', 'bar')).toBe('/foo/bar');
      expect(urlJoin('/foo', 'bar')).toBe('/foo/bar');
      expect(urlJoin('/foo', '/bar')).toBe('/foo/bar');
      expect(urlJoin('/foo/', '/bar/')).toBe('/foo/bar');
      expect(urlJoin('/foo/', '/bar/baz')).toBe('/foo/bar/baz');
      expect(urlJoin('/foo/', '/bar//baz')).toBe('/foo/bar/baz');

      expect(urlJoin('http://google.com')).toBe('http://google.com');
      expect(urlJoin('http://google.com', '')).toBe('http://google.com');
      expect(urlJoin('http://google.com', 'foo')).toBe('http://google.com/foo');
      expect(urlJoin('http://google.com/', 'foo')).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com/', '/foo')).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com//', '/foo')).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com/foo', 'bar')).toBe(
        'http://google.com/foo/bar',
      );

      expect(urlJoin('http://google.com', '?queryString')).toBe(
        'http://google.com?queryString',
      );
      expect(urlJoin('http://google.com', 'foo?queryString')).toBe(
        'http://google.com/foo?queryString',
      );
      expect(urlJoin('http://google.com', 'foo', '?queryString')).toBe(
        'http://google.com/foo?queryString',
      );
      expect(urlJoin('http://google.com', 'foo/', '?queryString')).toBe(
        'http://google.com/foo?queryString',
      );
      expect(urlJoin('http://google.com?queryString')).toBe(
        'http://google.com?queryString',
      );
    });

    it('should add leading slash and trailing slash', () => {
      const options = { trailingSlash: true };

      expect(urlJoin(options)).toBe('/');
      expect(urlJoin(undefined, 'foo', options)).toBe('/foo/');
      expect(urlJoin('foo', null, 'bar', options)).toBe('/foo/bar/');
      expect(urlJoin('foo', '', 'bar', options)).toBe('/foo/bar/');
      expect(urlJoin('foo', options)).toBe('/foo/');
      expect(urlJoin('/foo', options)).toBe('/foo/');
      expect(urlJoin('/', '/foo', options)).toBe('/foo/');
      expect(urlJoin('/', '//foo', options)).toBe('/foo/');
      expect(urlJoin('/', '/foo//', options)).toBe('/foo/');
      expect(urlJoin('/', '/foo/', '', options)).toBe('/foo/');
      expect(urlJoin('/', '/foo/', '/', options)).toBe('/foo/');
      expect(urlJoin('foo', 'bar', options)).toBe('/foo/bar/');
      expect(urlJoin('/foo', 'bar', options)).toBe('/foo/bar/');
      expect(urlJoin('/foo', '/bar', options)).toBe('/foo/bar/');
      expect(urlJoin('/foo/', '/bar/', options)).toBe('/foo/bar/');
      expect(urlJoin('/foo/', '/bar/baz', options)).toBe('/foo/bar/baz/');
      expect(urlJoin('/foo/', '/bar//baz', options)).toBe('/foo/bar/baz/');

      expect(urlJoin('http://google.com', options)).toBe('http://google.com/');
      expect(urlJoin('http://google.com', '', options)).toBe(
        'http://google.com/',
      );
      expect(urlJoin('http://google.com', 'foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/', 'foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/', '/foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com//', '/foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/foo', 'bar', options)).toBe(
        'http://google.com/foo/bar/',
      );

      expect(urlJoin('http://google.com', '?queryString', options)).toBe(
        'http://google.com/?queryString',
      );
      expect(urlJoin('http://google.com', 'foo?queryString', options)).toBe(
        'http://google.com/foo/?queryString',
      );
      expect(urlJoin('http://google.com', 'foo', '?queryString', options)).toBe(
        'http://google.com/foo/?queryString',
      );
      expect(
        urlJoin('http://google.com', 'foo/', '?queryString', options),
      ).toBe('http://google.com/foo/?queryString');
      expect(urlJoin('http://google.com?queryString', options)).toBe(
        'http://google.com/?queryString',
      );
    });

    it('should remove leading slash and add trailing slash', () => {
      const options = { leadingSlash: false, trailingSlash: true };

      expect(urlJoin(options)).toBe('/');
      expect(urlJoin(undefined, 'foo', options)).toBe('foo/');
      expect(urlJoin('foo', null, 'bar', options)).toBe('foo/bar/');
      expect(urlJoin('foo', '', 'bar', options)).toBe('foo/bar/');
      expect(urlJoin('foo', options)).toBe('foo/');
      expect(urlJoin('/foo', options)).toBe('foo/');
      expect(urlJoin('/', '/foo', options)).toBe('foo/');
      expect(urlJoin('/', '//foo', options)).toBe('foo/');
      expect(urlJoin('/', '/foo//', options)).toBe('foo/');
      expect(urlJoin('/', '/foo/', '', options)).toBe('foo/');
      expect(urlJoin('/', '/foo/', '/', options)).toBe('foo/');
      expect(urlJoin('foo', 'bar', options)).toBe('foo/bar/');
      expect(urlJoin('/foo', 'bar', options)).toBe('foo/bar/');
      expect(urlJoin('/foo', '/bar', options)).toBe('foo/bar/');
      expect(urlJoin('/foo/', '/bar/', options)).toBe('foo/bar/');
      expect(urlJoin('/foo/', '/bar/baz', options)).toBe('foo/bar/baz/');
      expect(urlJoin('/foo/', '/bar//baz', options)).toBe('foo/bar/baz/');

      expect(urlJoin('http://google.com', options)).toBe('http://google.com/');
      expect(urlJoin('http://google.com', '', options)).toBe(
        'http://google.com/',
      );
      expect(urlJoin('http://google.com', 'foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/', 'foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/', '/foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com//', '/foo', options)).toBe(
        'http://google.com/foo/',
      );
      expect(urlJoin('http://google.com/foo', 'bar', options)).toBe(
        'http://google.com/foo/bar/',
      );

      expect(urlJoin('http://google.com', '?queryString', options)).toBe(
        'http://google.com/?queryString',
      );
      expect(urlJoin('http://google.com', 'foo?queryString', options)).toBe(
        'http://google.com/foo/?queryString',
      );
      expect(urlJoin('http://google.com', 'foo', '?queryString', options)).toBe(
        'http://google.com/foo/?queryString',
      );
      expect(
        urlJoin('http://google.com', 'foo/', '?queryString', options),
      ).toBe('http://google.com/foo/?queryString');
      expect(urlJoin('http://google.com?queryString', options)).toBe(
        'http://google.com/?queryString',
      );
    });

    it('should remove leading slash and trailing slash', () => {
      const options = { leadingSlash: false, trailingSlash: false };

      expect(urlJoin(options)).toBe('');
      expect(urlJoin(undefined, 'foo', options)).toBe('foo');
      expect(urlJoin('foo', null, 'bar', options)).toBe('foo/bar');
      expect(urlJoin('foo', '', 'bar', options)).toBe('foo/bar');
      expect(urlJoin('foo', options)).toBe('foo');
      expect(urlJoin('/foo', options)).toBe('foo');
      expect(urlJoin('/', '/foo', options)).toBe('foo');
      expect(urlJoin('/', '//foo', options)).toBe('foo');
      expect(urlJoin('/', '/foo//', options)).toBe('foo');
      expect(urlJoin('/', '/foo/', '', options)).toBe('foo');
      expect(urlJoin('/', '/foo/', '/', options)).toBe('foo');
      expect(urlJoin('foo', 'bar', options)).toBe('foo/bar');
      expect(urlJoin('/foo', 'bar', options)).toBe('foo/bar');
      expect(urlJoin('/foo', '/bar', options)).toBe('foo/bar');
      expect(urlJoin('/foo/', '/bar/', options)).toBe('foo/bar');
      expect(urlJoin('/foo/', '/bar/baz', options)).toBe('foo/bar/baz');
      expect(urlJoin('/foo/', '/bar//baz', options)).toBe('foo/bar/baz');

      expect(urlJoin('http://google.com', options)).toBe('http://google.com');
      expect(urlJoin('http://google.com', '', options)).toBe(
        'http://google.com',
      );
      expect(urlJoin('http://google.com', 'foo', options)).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com/', 'foo', options)).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com/', '/foo', options)).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com//', '/foo', options)).toBe(
        'http://google.com/foo',
      );
      expect(urlJoin('http://google.com/foo', 'bar', options)).toBe(
        'http://google.com/foo/bar',
      );

      expect(urlJoin('http://google.com', '?queryString', options)).toBe(
        'http://google.com?queryString',
      );
      expect(urlJoin('http://google.com', 'foo?queryString', options)).toBe(
        'http://google.com/foo?queryString',
      );
      expect(urlJoin('http://google.com', 'foo', '?queryString', options)).toBe(
        'http://google.com/foo?queryString',
      );
      expect(
        urlJoin('http://google.com', 'foo/', '?queryString', options),
      ).toBe('http://google.com/foo?queryString');
      expect(urlJoin('http://google.com?queryString', options)).toBe(
        'http://google.com?queryString',
      );
    });

    it('should support URLs with relative protocol according to options.protocolRelative', () => {
      const options = { protocolRelative: true };

      expect(urlJoin('//google.com', 'foo', options)).toBe('//google.com/foo');
      expect(urlJoin('//google.com/', 'foo', options)).toBe('//google.com/foo');
      expect(urlJoin('//google.com/foo', 'bar', options)).toBe(
        '//google.com/foo/bar',
      );
      expect(urlJoin('//google.com/foo//', 'bar', options)).toBe(
        '//google.com/foo/bar',
      );

      options.protocolRelative = false;

      expect(urlJoin('//google.com', 'foo', options)).toBe('/google.com/foo');
      expect(urlJoin('//google.com/', 'foo', options)).toBe('/google.com/foo');
      expect(urlJoin('//google.com/foo', 'bar', options)).toBe(
        '/google.com/foo/bar',
      );
      expect(urlJoin('//google.com/foo//', 'bar', options)).toBe(
        '/google.com/foo/bar',
      );
    });

    it('should include numbers', () => {
      expect(urlJoin(undefined, 1)).toBe('/1');
      expect(urlJoin(1, null, 2)).toBe('/1/2');
      expect(urlJoin(1, '', 2)).toBe('/1/2');
      expect(urlJoin(1)).toBe('/1');
      expect(urlJoin('/1')).toBe('/1');
      expect(urlJoin('/', '/1')).toBe('/1');
      expect(urlJoin('/', '//1')).toBe('/1');
      expect(urlJoin('/', '/1//')).toBe('/1');
      expect(urlJoin('/', '/1/', '')).toBe('/1');
      expect(urlJoin('/', '/1/', '/')).toBe('/1');
      expect(urlJoin(1, 2)).toBe('/1/2');
      expect(urlJoin('/1', 2)).toBe('/1/2');
      expect(urlJoin('/1', '/2')).toBe('/1/2');
      expect(urlJoin('/1/', '/2/')).toBe('/1/2');
      expect(urlJoin('/1/', '/2/3')).toBe('/1/2/3');
      expect(urlJoin('/1/', '/2//3')).toBe('/1/2/3');

      expect(urlJoin('http://google.com', 1)).toBe('http://google.com/1');
      expect(urlJoin('http://google.com/', 1)).toBe('http://google.com/1');
      expect(urlJoin('http://google.com/', '/1')).toBe('http://google.com/1');
      expect(urlJoin('http://google.com//', '/1')).toBe('http://google.com/1');
      expect(urlJoin('http://google.com/1', 2)).toBe('http://google.com/1/2');

      expect(urlJoin('http://google.com', '?1')).toBe('http://google.com?1');
      expect(urlJoin('http://google.com', 'foo?1')).toBe(
        'http://google.com/foo?1',
      );
      expect(urlJoin('http://google.com', 'foo', '?1')).toBe(
        'http://google.com/foo?1',
      );
      expect(urlJoin('http://google.com', 'foo/', '?1')).toBe(
        'http://google.com/foo?1',
      );
      expect(urlJoin('http://google.com?1')).toBe('http://google.com?1');
    });

    it('should handle the provided query object and append it to the url', () => {
      const options = { query: { biz: 'buz', foo: 'bar' } };

      expect(urlJoin('/google.com', options)).toBe(
        '/google.com?biz=buz&foo=bar',
      );
      expect(urlJoin('google.com', options)).toBe(
        '/google.com?biz=buz&foo=bar',
      );

      options.protocolRelative = false;

      expect(urlJoin('//google.com', options)).toBe(
        '/google.com?biz=buz&foo=bar',
      );

      options.leadingSlash = false;

      expect(urlJoin('google.com', options)).toBe('google.com?biz=buz&foo=bar');

      options.trailingSlash = true;

      expect(urlJoin('google.com', options)).toBe(
        'google.com/?biz=buz&foo=bar',
      );

      options.trailingSlash = false;

      expect(urlJoin('google.com', 'qux?tux=baz', options)).toBe(
        'google.com/qux?biz=buz&foo=bar&tux=baz',
      );
    });

    it('should handle the provided query and query options objects', () => {
      const options = { query: { foo: [1, 2, 3] }, queryOptions: {} };

      expect(urlJoin('/google.com', options)).toBe(
        '/google.com?foo=1&foo=2&foo=3',
      );

      options.queryOptions.arrayFormat = 'bracket';

      expect(urlJoin('/google.com', options)).toBe(
        '/google.com?foo[]=1&foo[]=2&foo[]=3',
      );

      options.queryOptions.arrayFormat = 'index';

      expect(urlJoin('/google.com', options)).toBe(
        '/google.com?foo[0]=1&foo[1]=2&foo[2]=3',
      );
    });
  });

  describe('pathNormalize', () => {
    describe('single slash', () => {
      it('should always return a single forward slash', () => {
        expect(pathNormalize('/')).toBe('/');
        expect(pathNormalize('/', true)).toBe('/');

        expect(pathNormalize('\\')).toBe('/');
        expect(pathNormalize('\\', true)).toBe('/');
      });
    });

    describe('strip trailing slashes', () => {
      const units = [
        ['../../foo/bar', '../../foo/bar'],
        ['..\\..\\foo/bar', '../../foo/bar'],
        ['..\\\\..\\\\foo/bar', '../../foo/bar'],
        ['//foo/bar\\baz', '/foo/bar/baz'],
        ['//foo\\bar\\baz', '/foo/bar/baz'],
        ['/user/docs/Letter.txt', '/user/docs/Letter.txt'],
        ['\\?\\C:\\user\\docs\\Letter.txt', '/?/C:/user/docs/Letter.txt'],
        [
          '\\?\\UNC\\Server01\\user\\docs\\Letter.txt',
          '/?/UNC/Server01/user/docs/Letter.txt',
        ],
        ['\\\\.\\CdRomX', '//./CdRomX'],
        ['\\\\.\\PhysicalDiskX', '//./PhysicalDiskX'],
        ['\\\\?\\C:\\user\\docs\\Letter.txt', '//?/C:/user/docs/Letter.txt'],
        [
          '\\\\?\\UNC\\Server01\\user\\docs\\Letter.txt',
          '//?/UNC/Server01/user/docs/Letter.txt',
        ],
        [
          '\\Server01\\user\\docs\\Letter.txt',
          '/Server01/user/docs/Letter.txt',
        ],
        ['C:\\user\\docs\\Letter.txt', 'C:/user/docs/Letter.txt'],
        [
          'C:\\user\\docs\\somefile.ext:alternate_stream_name',
          'C:/user/docs/somefile.ext:alternate_stream_name',
        ],
        ['C:Letter.txt', 'C:Letter.txt'],
        ['E://foo//bar//baz', 'E:/foo/bar/baz'],
        ['E://foo//bar//baz//', 'E:/foo/bar/baz'],
        ['E://foo//bar//baz//////', 'E:/foo/bar/baz'],
        ['E://foo/bar\\baz', 'E:/foo/bar/baz'],
        ['E://foo\\bar\\baz', 'E:/foo/bar/baz'],
        ['E:/foo/bar/baz/', 'E:/foo/bar/baz'],
        ['E:/foo/bar/baz///', 'E:/foo/bar/baz'],
        ['E:\\\\foo/bar\\baz', 'E:/foo/bar/baz'],
        ['foo\\bar\\baz', 'foo/bar/baz'],
        ['foo\\bar\\baz\\', 'foo/bar/baz'],
        ['foo\\bar\\baz\\\\\\', 'foo/bar/baz'],
      ];

      units.forEach(unit => {
        it(`should normalize ${unit[0]}`, () => {
          expect(pathNormalize(unit[0])).toBe(unit[1]);
        });
      });
    });

    describe('keep trailing slashes', () => {
      const units = [
        ['\\', '/'],
        ['foo\\bar\\baz\\', 'foo/bar/baz/'],
        ['foo\\\\bar\\\\baz\\\\', 'foo/bar/baz/'],
        ['foo//bar//baz//', 'foo/bar/baz/'],
        ['foo/bar/baz/', 'foo/bar/baz/'],
        ['./foo/bar/baz/', './foo/bar/baz/'],
        ['./foo/bar/baz', './foo/bar/baz'],
      ];

      units.forEach(unit => {
        it(`should normalize ${unit[0]}`, () => {
          expect(pathNormalize(unit[0], false)).toBe(unit[1]);
        });
      });
    });
  });

  it('normalize properly encode URI path segments', () => {
    expect(normalize('../abc/@#$%¨&()[]{}-_=+ß/môòñ 月 قمر')).toBe(
      'abc/@#$%%C2%A8&()%5B%5D%7B%7D-_=+%C3%9F/m%C3%B4%C3%B2%C3%B1%20%E6%9C%88%20%D9%82%D9%85%D8%B1',
    );
  });

  it('pathJoin arguments normalize', () => {
    expect(pathJoin('../ds/asda/', 'foo\\\\bar\\\\baz\\\\')).toBe(
      '../ds/asda/foo/bar/baz/',
    );
    expect(pathJoin('./ds/asda/', 'foo\\\\bar\\\\baz\\\\')).toBe(
      'ds/asda/foo/bar/baz/',
    );
    expect(pathJoin('/ds/asda/', 'foo\\\\bar\\\\baz\\\\')).toBe(
      '/ds/asda/foo/bar/baz/',
    );
    expect(pathJoin('/ds/asda/', 'foo\\\\bar\\\\baz')).toBe(
      '/ds/asda/foo/bar/baz',
    );
    expect(pathJoin('a', 'b')).toBe('a/b');

    expect(pathJoin('foo', 'bar', { leadingSlash: true })).toBe('/foo/bar');
    expect(pathJoin('foo', 'bar', { trailingSlash: true })).toBe('foo/bar/');
    expect(
      pathJoin('foo', 'bar', { leadingSlash: true, trailingSlash: true }),
    ).toBe('/foo/bar/');
  });
});
