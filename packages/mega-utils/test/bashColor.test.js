/**
 * Created Date: Monday, July 2nd 2018, 2:44:19 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import {
  bashCodes,
  colors,
  styles,
  REMOVE_COLOR,
  purple,
  cyan,
  yellow,
  red,
  green,
  black,
  blue,
  white,
  wrap,
} from '../lib/bashColor';

describe('[bashColor]', () => {
  it('const bashCodes', () => {
    expect(bashCodes).toEqual({
      BLACK: {
        text: '\u001b[0;30m',
        bold: '\u001b[1;30m',
        underline: '\u001b[4;30m',
        background: '\u001b[40m',
        hi_text: '\u001b[0;90m',
        hi_bold: '\u001b[1;90m',
        hi_background: '\u001b[0;100m',
      },
      RED: {
        text: '\u001b[0;31m',
        bold: '\u001b[1;31m',
        underline: '\u001b[4;31m',
        background: '\u001b[41m',
        hi_text: '\u001b[0;91m',
        hi_bold: '\u001b[1;91m',
        hi_background: '\u001b[0;101m',
      },
      GREEN: {
        text: '\u001b[0;32m',
        bold: '\u001b[1;32m',
        underline: '\u001b[4;32m',
        background: '\u001b[42m',
        hi_text: '\u001b[0;92m',
        hi_bold: '\u001b[1;92m',
        hi_background: '\u001b[0;102m',
      },
      YELLOW: {
        text: '\u001b[0;33m',
        bold: '\u001b[1;33m',
        underline: '\u001b[4;33m',
        background: '\u001b[43m',
        hi_text: '\u001b[0;93m',
        hi_bold: '\u001b[1;93m',
        hi_background: '\u001b[0;103m',
      },
      BLUE: {
        text: '\u001b[0;34m',
        bold: '\u001b[1;34m',
        underline: '\u001b[4;34m',
        background: '\u001b[44m',
        hi_text: '\u001b[0;94m',
        hi_bold: '\u001b[1;94m',
        hi_background: '\u001b[0;104m',
      },
      PURPLE: {
        text: '\u001b[0;35m',
        bold: '\u001b[1;35m',
        underline: '\u001b[4;35m',
        background: '\u001b[45m',
        hi_text: '\u001b[0;95m',
        hi_bold: '\u001b[1;95m',
        hi_background: '\u001b[0;105m',
      },
      CYAN: {
        text: '\u001b[0;36m',
        bold: '\u001b[1;36m',
        underline: '\u001b[4;36m',
        background: '\u001b[46m',
        hi_text: '\u001b[0;96m',
        hi_bold: '\u001b[1;96m',
        hi_background: '\u001b[0;106m',
      },
      WHITE: {
        text: '\u001b[0;37m',
        bold: '\u001b[1;37m',
        underline: '\u001b[4;37m',
        background: '\u001b[47m',
        hi_text: '\u001b[0;97m',
        hi_bold: '\u001b[1;97m',
        hi_background: '\u001b[0;107m',
      },
    });
  });

  it('const colors', () => {
    expect(colors).toEqual({
      BLACK: 'BLACK',
      RED: 'RED',
      GREEN: 'GREEN',
      YELLOW: 'YELLOW',
      BLUE: 'BLUE',
      PURPLE: 'PURPLE',
      CYAN: 'CYAN',
      WHITE: 'WHITE',
    });

    const colorsValues = Object.values(colors);
    const bashCodesKeys = Object.keys(bashCodes);
    expect(colorsValues).toEqual(bashCodesKeys);
  });

  it('const styles', () => {
    expect(styles).toEqual({
      bold: 'bold',
      underline: 'underline',
      background: 'background',
      hi_text: 'hi_text',
      hi_bold: 'hi_bold',
      hi_background: 'hi_background',
    });

    const stylesValues = ['text', ...Object.values(styles)];
    const bashCodesValues = Object.values(bashCodes);
    bashCodesValues.forEach(bc =>
      expect(stylesValues).toEqual(Object.keys(bc)),
    );
  });

  it('const REMOVE_COLOR', () => {
    expect(REMOVE_COLOR).toBe('\u001b[0m');
  });

  it('fn colors', () => {
    console.log(black('this text is black'));

    console.log(red('this text is red'));
    console.log(red('this text is high-intensity red', true));

    console.log(green('this text is green'));

    console.log(yellow('this text is yellow'));
    console.log(yellow('this text is high-intensity yellow', true));

    console.log(blue('this text is blue'));
    console.log(purple('this text is purple'));
    console.log(cyan('this text is cyan'));
    console.log(white('this text is white'));
  });

  it('fn wrap', () => {
    console.log(
      wrap(
        'this string will have a high-intensity blue background.',
        colors.BLUE,
        styles.hi_background,
      ),
    );
    console.log(
      wrap(
        'this string will be red and underlined.',
        colors.RED,
        styles.underline,
      ),
    );
  });
});
