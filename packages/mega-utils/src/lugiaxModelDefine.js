/**
 * Created Date: Sunday, July 28th 2019, 11:20:20 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, July 29th 2019, 1:54:14 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

export function gDefine(modelName) {
  return `const __LUGIAX_MODEL_DEFINE__ = "${modelName}"; // lugiax-model-define`;
}

export function replaceDefine(content, replaceModelName) {
  return content.replace(
    /__LUGIAX_MODEL_DEFINE__.*\/\/ lugiax-model-define/,
    `__LUGIAX_MODEL_DEFINE__ = "${replaceModelName}"; // lugiax-model-define`
  );
}
