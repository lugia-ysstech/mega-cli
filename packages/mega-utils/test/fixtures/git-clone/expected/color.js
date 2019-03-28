/**
 * Created Date: Friday, June 29th 2018, 5:52:21 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

export const bashCodes = {
  'BLACK': {
    'text': '\u001b[0;30m',
    'underline': '\u001b[4;30m',
    'background': '\u001b[40m',
    'bold': '\u001b[1;30m',
    'hi_text': '\u001b[0;90m',
    'hi_bold': '\u001b[1;90m',
    'hi_background': '\u001b[0;100m',
  },
  'RED': {
    'text': '\u001b[0;31m',
    'bold': '\u001b[1;31m',
    'underline': '\u001b[4;31m',
    'background': '\u001b[41m',
    'hi_text': '\u001b[0;91m',
    'hi_bold': '\u001b[1;91m',
    'hi_background': '\u001b[0;101m',
  },
  'GREEN': {
    'text': '\u001b[0;32m',
    'bold': '\u001b[1;32m',
    'underline': '\u001b[4;32m',
    'background': '\u001b[42m',
    'hi_text': '\u001b[0;92m',
    'hi_bold': '\u001b[1;92m',
    'hi_background': '\u001b[0;102m',
  },
  'YELLOW': {
    'text': '\u001b[0;33m',
    'bold': '\u001b[1;33m',
    'underline': '\u001b[4;33m',
    'background': '\u001b[43m',
    'hi_text': '\u001b[0;93m',
    'hi_bold': '\u001b[1;93m',
    'hi_background': '\u001b[0;103m',
  },
  'BLUE': {
    'text': '\u001b[0;34m',
    'bold': '\u001b[1;34m',
    'underline': '\u001b[4;34m',
    'background': '\u001b[44m',
    'hi_text': '\u001b[0;94m',
    'hi_bold': '\u001b[1;94m',
    'hi_background': '\u001b[0;104m',
  },
  'PURPLE': {
    'text': '\u001b[0;35m',
    'bold': '\u001b[1;35m',
    'underline': '\u001b[4;35m',
    'background': '\u001b[45m',
    'hi_text': '\u001b[0;95m',
    'hi_bold': '\u001b[1;95m',
    'hi_background': '\u001b[0;105m',
  },
  'CYAN': {
    'text': '\u001b[0;36m',
    'bold': '\u001b[1;36m',
    'underline': '\u001b[4;36m',
    'background': '\u001b[46m',
    'hi_text': '\u001b[0;96m',
    'hi_bold': '\u001b[1;96m',
    'hi_background': '\u001b[0;106m',
  },
  'WHITE': {
    'text': '\u001b[0;37m',
    'bold': '\u001b[1;37m',
    'underline': '\u001b[4;37m',
    'background': '\u001b[47m',
    'hi_text': '\u001b[0;97m',
    'hi_bold': '\u001b[1;97m',
    'hi_background': '\u001b[0;107m',
  },
};

export const colors = {
  'BLACK': 'BLACK',
  'RED': 'RED',
  'GREEN': 'GREEN',
  'YELLOW': 'YELLOW',
  'BLUE': 'BLUE',
  'PURPLE': 'PURPLE',
  'CYAN': 'CYAN',
  'WHITE': 'WHITE',
};

export const styles = {
  'bold': 'bold',
  'underline': 'underline',
  'background': 'background',
  'hi_text': 'hi_text',
  'hi_bold': 'hi_bold',
  'hi_background': 'hi_background',
};

export const REMOVE_COLOR = '\u001b[0m';

const render = (code, str) => code + str + REMOVE_COLOR;

const renderColor = (str, color, hi) => render(hi ? color.hi_text : color.text, str);

export const black = (str, hi) => renderColor(str, bashCodes.BLACK, hi);

export const red = (str, hi) => renderColor(str, bashCodes.RED, hi);

export const green = (str, hi) => renderColor(str, bashCodes.GREEN, hi);

export const yellow = (str, hi) => renderColor(str, bashCodes.YELLOW, hi);

export const blue = (str, hi) => renderColor(str, bashCodes.BLUE, hi);

export const purple = (str, hi) => renderColor(str, bashCodes.PURPLE, hi);

export const cyan = (str, hi) => renderColor(str, bashCodes.CYAN, hi);

export const white = (str, hi) => renderColor(str, bashCodes.WHITE, hi);

export const wrap = (str, color, style) => {
  const c = bashCodes[color.toUpperCase()];
  const s = styles[style] || 'text';
  return render(c[s], str);
};
