/**
 * Created Date: Tuesday, January 29th 2019, 2:31:05 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Tuesday, January 29th 2019, 4:06:19 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

/* eslint-disable */
function camelNamed(_str) {
  const str = _str[0].toUpperCase() + _str.substr(1);
  return str;
}

const BindWidgets = [
  'Input',
  'NumberInput',
  'DatePicker',
  'Select',
  'Switch',
  'Slider',
];

function createHeader(page) {
  let pakage =
    'import React from "react"; import styled from "styled-components";';

  let styledCom = '';
  const widgetName2ComponentName = {};
  const { mainDependencies, themes, lugiax } = page;
  const { widgetId2PropsName2BindInfo } = lugiax || {};
  if (widgetId2PropsName2BindInfo) {
    pakage += 'import lugiax, { bindTo, connect, bind } from "@lugia/lugiax";';
  }
  if (mainDependencies && mainDependencies.length > 0) {
    mainDependencies.forEach(item => {
      const { widgetName, module } = item;
      const componentName = camelNamed(widgetName);
      //TODO: 临时写法
      if (widgetName === 'Label') {
        styledCom =
          `const ${componentName} = styled.div` +
          `\`` +
          `font-size: 12px;` +
          `\`;`;
        widgetName2ComponentName[widgetName] = componentName;
      } else {
        pakage =
          `${pakage}import { ${widgetName} } from ` + `"${module}"` + `;`;
      }
    });
  }

  let themePakage = '';
  if (themes) {
    themePakage = 'import { Theme } from "@lugia/lugia-web"; ';
  }

  return { pakage, styledCom, widgetName2ComponentName, themePakage };
}

function createComponent(
  mainPad,
  componentNames,
  widgetName2ComponentName,
  page,
) {
  const { width, height, zIndex, point } = mainPad;
  const wrap = `<div style={{width: '${width}px',zIndex: '${zIndex}', position: 'relative', }}>${
    createChildComponent(
      mainPad,
      componentNames,
      widgetName2ComponentName,
      false,
      page,
    ).code
  }</div>`;

  return wrap;
}

function createComponentInfo(
  widgetName2ComponentName,
  page,
  existDefineWidgetMap,
) {
  const { mainPad, lugiax } = page;
  const { widgetId2PropsName2BindInfo, widgetId2EventName2MutationInfo } =
    lugiax || {};
  const { children } = mainPad;
  const classCode = [];
  const componentNames = {};
  if (children && children.length) {
    recursiveChildren(
      children,
      classCode,
      componentNames,
      widgetName2ComponentName,
      widgetId2PropsName2BindInfo,
      widgetId2EventName2MutationInfo,
      page,
      existDefineWidgetMap,
    );
  }
  return { classCode: classCode.join(' '), componentNames };
}

function recursiveChildren(
  children,
  classCode,
  componentNames,
  widgetName2ComponentName,
  widgetId2PropsName2BindInfo,
  widgetId2EventName2MutationInfo,
  page,
  existDefineWidgetMap,
) {
  children.forEach(item => {
    if (item.children) {
      recursiveChildren(
        item.children,
        classCode,
        componentNames,
        widgetName2ComponentName,
        widgetId2PropsName2BindInfo,
        widgetId2EventName2MutationInfo,
        page,
        existDefineWidgetMap,
      );
    }
    classCode.unshift(
      createClass(
        item,
        componentNames,
        widgetName2ComponentName,
        page,
        existDefineWidgetMap,
      ),
    );
  });
}

let ComponentIndex = 1;

function createClass(
  item,
  componentNames,
  widgetName2ComponentName,
  page,
  existDefineWidgetMap,
) {
  const { widgetId } = item;
  const componentName = `Component${ComponentIndex}`;
  ComponentIndex++;
  const { widgetId2ChildPad, mainPad, lugiax } = page;
  const { layers, id2WidgetInfo } = mainPad;
  const componentInfo = widgetId2ChildPad[widgetId];
  componentNames[widgetId] = componentName;
  const { code } = createChildComponent(
    componentInfo,
    componentNames,
    widgetName2ComponentName,
    true,
    widgetId,
    existDefineWidgetMap,
  );
  const classCode = `class ${componentName} extends React.Component {
    render () {
      return (
        <React.Fragment>
            ${code}

        </React.Fragment>
      );
    }
  };
  `;

  return classCode;
}

function createChildComponent(
  mainPad,
  componentNames,
  widgetName2ComponentName,
  updateComponentNames,
  page,
  existDefineWidgetMap,
) {
  let child = '';
  const { widgetId2ChildPad, themes, lugiax } = page;
  const { widgetId2ThemeInfo } = themes || {};
  const { widgetId2PropsName2BindInfo = {} } = lugiax || {};

  const { layers, id2WidgetInfo, width, height, zIndex, point } = mainPad;

  // modelComponents = { ...modelNames, ...modelComponents };
  // console.log('widgetId', widgetId);

  if (layers && layers.length > 0) {
    layers.forEach(item => {
      const { widgetId: layerChildWidid, width, height, zIndex, point } = item;
      if (layerChildWidid && id2WidgetInfo[layerChildWidid]) {
        const { widgetName, props } = id2WidgetInfo[layerChildWidid];
        const inChildPad =
          widgetId2ChildPad && widgetId2ChildPad[layerChildWidid];
        const customLabel = widgetName2ComponentName[widgetName];
        const componentName =
          customLabel ||
          (modelComponents[layerChildWidid]
            ? modelComponents[layerChildWidid]
            : inChildPad
            ? componentNames[layerChildWidid]
            : widgetId2PropsName2BindInfo[layerChildWidid]
            ? existDefineWidgetMap[layerChildWidid]
            : widgetName);
        const { labelStart, labelEnd, viewClass } = createThemeCode(
          widgetId2ThemeInfo,
          layerChildWidid,
        );
        const propsViewClass = viewClass ? `viewClass = "${viewClass}"` : '';
        const propsConfig = getComponentProps(props);

        // 增加父组件；
        let cardStart = '';

        let cardEnd = '';
        if (props && props.TargetContainer) {
          const { widgetName } = props.TargetContainer;
          cardStart = `${labelStart}<div style={{position: 'absolute',width: '${width}px',height: '${height}px',zIndex: '${zIndex}',left: '${
            point[0]
          }px',top: '${
            point[1]
          }px'}}><${widgetName} ${propsConfig} ${propsViewClass}>`;
          cardEnd = `</${widgetName}></div>${labelEnd}`;
        }
        if (cardStart && cardEnd) {
          child = `${child +
            cardStart}<div style={{position: 'absolute',width: '${width}px',height: '${height}px',zIndex: '${zIndex}', left: '0px', top: '0px'}}>${labelStart}<${componentName}${propsConfig} ${propsViewClass} />${labelEnd}</div>${cardEnd}`;
        } else {
          child = `${child +
            cardStart}<div style={{position: 'absolute',width: '${width}px',height: '${height}px',zIndex: '${zIndex}',left: '${
            point[0]
          }px',top: '${
            point[1]
          }px'}}>${labelStart}<${componentName}${propsConfig} ${propsViewClass} />${labelEnd}</div>${cardEnd}`;
        }
      }
    });
  }
  const code = `<div style={{position: 'absolute',width: '${width}px',height: '${height}px',zIndex: '${zIndex}'}}>${child}</div>`;

  return { code };
}

function createThemeCode(widgetId2ThemeInfo, widgetId) {
  let labelStart = '';

  let labelEnd = '';

  let viewClass = '';
  if (widgetId2ThemeInfo && widgetId) {
    const theme = widgetId2ThemeInfo[widgetId];
    if (theme) {
      labelStart = `<Theme config={{${getThemeConfig(theme, widgetId)}}}>`;
      labelEnd = '</Theme>';
      viewClass = widgetId;
    }
  }

  return { labelStart, labelEnd, viewClass };
}

function getThemeConfig(theme, widgetId) {
  const themes = Object.keys(theme);
  let config = '';
  if (themes && themes.length > 0) {
    themes.forEach(item => {
      config = `${config} ${item}: ${theme[item]},`;
    });
    config = `'${widgetId}' :{ ${config} }`;
  }
  return config;
}

function getComponentProps(props) {
  const propsKey = Object.keys(props);
  let comProps = '';
  if (propsKey && propsKey.length > 0) {
    propsKey.forEach(item => {
      comProps = `${comProps} ${item}=${handlePropsType(props[item])} `;
    });
  }

  return comProps;
}

function handlePropsType(propsItem) {
  const type = typeof propsItem;
  if (type === 'object') {
    return `{ ${JSON.stringify(propsItem)} }`;
  }
  if (type === 'number') {
    return `{ ${propsItem} }`;
  }
  return `{'${propsItem}'}`;
}

function createConnectState(bindInfo) {
  let modelNm = '';

  const empty = {
    modelName: modelNm,
    stateCodes: '',
    bindType: 'connect',
  };
  if (!bindInfo) {
    return empty;
  }
  const connectItems = Object.values(bindInfo).filter(item => {
    const { bindType = 'connect' } = item;
    return bindType === 'connect';
  });

  if (!connectItems || connectItems.length === 0) {
    return empty;
  }

  let stateCodes = [
    `
    state=>{
      return {
  `,
  ];
  connectItems.forEach(bindItem => {
    const { modelName, fieldName, propsName } = bindItem;
    modelComponents.modelNames.push(modelName);
    modelNm = modelName;
    stateCodes.push(`
      ... getData(state, '${propsName}', '${modelName}', '${fieldName}'),
    `);
  });
  stateCodes.push('}},');
  return {
    modelName: modelNm,
    stateCodes: stateCodes.join(''),
  };
}

function createBindState(bindInfo) {
  let modelNm = '';

  let bindTp = '';
  const empty = {
    modelName: modelNm,
    stateCodes: '',
    bindType: 'bindTo',
  };
  if (!bindInfo) {
    return empty;
  }
  const connectItems = Object.values(bindInfo).filter(item => {
    const { bindType } = item;
    return bindType === 'type';
  });

  if (!connectItems || connectItems.length === 0) {
    return empty;
  }

  let stateCodes = [
    `
    state=>{
      return {
  `,
  ];
  connectItems.forEach(bindItem => {
    const { modelName, fieldName, propsName } = bindItem;
    modelComponents.modelNames.push(modelName);
    modelNm = modelName;
    stateCodes.push(`
      ... getData(state, '${propsName}', '${modelName}', '${fieldName}'),
    `);
  });
  stateCodes.push('}}');
  return {
    modelName: modelNm,
    stateCodes: stateCodes.join(''),
  };
}

function createMutations(mutationsValue, mutationsObj) {
  let mutationsCode = '';

  let modelNm = '';
  if (!mutationsValue || mutationsValue.length < 1) {
    return {
      modelName: modelNm,
      mutationsCode,
      bindType: 'connect',
    };
  }

  mutationsValue.forEach(item => {
    const eventName = mutationsObj[item];
    const { modelName, mutationName, eventName: eventDo } = eventName;
    modelComponents.modelNames.push(modelName);
    modelNm = modelName;

    mutationsCode += `'${eventDo}': ${modelName}.${mutationName},`;
  });

  return {
    modelName: modelNm,
    mutationsCode,
  };
}
let seq = 1;
function getMainPaidLugiax(
  layers,
  lugiax = {},
  id2WidgetInfo,
  widgetId2ChildPad,
) {
  const {
    widgetId2PropsName2BindInfo = {},
    widgetId2EventName2MutationInfo = {},
  } = lugiax;
  let bindCode = '';
  const modelNames = {};

  function generateBindCode(item, id2WidgetInfo) {
    const { widgetId } = item;
    const bindObj = widgetId2PropsName2BindInfo[widgetId];
    const mutationsObj = widgetId2EventName2MutationInfo[widgetId];
    if (bindObj || mutationsObj) {
      const widgetName = id2WidgetInfo[widgetId].widgetName;
      if (widgetName === 'Button' && mutationsObj) {
        const [{ mutationName, eventName, modelName }] = Object.values(
          mutationsObj,
        );
        const componentName = `${widgetName}${mutationName}`;
        bindCode = `${bindCode} const ${componentName} = bind(user, ()=>({}),{
        ['${eventName}']:(mutations)=> (mutations['${mutationName}']({})),
        })(Button);`;
        modelNames[widgetId] = componentName;
        modelComponents[widgetId] = componentName;
      } else if (BindWidgets.indexOf(widgetName) != -1) {
        const [{ fieldName, propsName, modelName }] = Object.values(bindObj);

        const componentName =
          camelNamed(modelName) +
          fieldName.replace(/./g, '') +
          widgetName +
          seq++;

        modelNames[widgetId] = componentName;
        modelComponents[widgetId] = componentName;

        bindCode = `${bindCode} const ${componentName} = bindTo(
  user,
  {
    '${fieldName}': '${propsName}'
  },
  {
    onChange: {
      [ '${fieldName}' ] (e) {
        return bindHandleEvent(e);
      }
    }
  }
)(${widgetName});`;
      } else {
        const { stateCodes, modelName } = createConnectState(bindObj);
        const mutationsValue = mutationsObj ? Object.keys(mutationsObj) : [];

        const { mutationsCode, modelName: mutModelName } = createMutations(
          mutationsValue,
          mutationsObj,
        );
        const modelNm = bindObj ? modelName : mutModelName;
        const componentName = camelNamed(modelNm) + widgetName;

        modelNames[widgetId] = componentName;
        modelComponents[widgetId] = componentName;

        bindCode = `${bindCode} const ${componentName} = connect(
           ${modelNm},
           ${stateCodes}
            mutations => {
             const { ${modelNm} } = mutations;
             return { ${mutationsObj ? mutationsCode : ''} };
            }
          )(${widgetName});`;
      }
    }
  }

  function generateBindCodeForLayers(layers, id2WidgetInfo) {
    if (layers && layers.length) {
      layers.forEach(item => {
        generateBindCode(item, id2WidgetInfo);
      });
    }
  }

  generateBindCodeForLayers(layers, id2WidgetInfo);
  let childPads = widgetId2ChildPad && Object.values(widgetId2ChildPad);
  childPads &&
    childPads.forEach(pad => {
      const { layers, id2WidgetInfo } = pad;
      generateBindCodeForLayers(layers, id2WidgetInfo);
    });
  return { bindCode, modelNames };
}

function createModelImportCode(modelNames) {
  let code = '';
  if (!modelNames || modelNames.length < 1) {
    return code;
  }
  const models = [...new Set(modelNames)];
  models.forEach(item => {
    code += `import ${item} from '../models/${item}';`;
  });
  return code;
}

let modelComponents = { modelNames: [] };

module.exports = function conversion(page) {
  const { mainPad, lugiax, widgetId2ChildPad } = page;
  const {
    pakage,
    styledCom,
    themePakage,
    widgetName2ComponentName,
  } = createHeader(page);

  const { layers, id2WidgetInfo } = mainPad;
  const { bindCode, modelNames } = getMainPaidLugiax(
    layers,
    lugiax,
    id2WidgetInfo,
    widgetId2ChildPad,
  );

  const { classCode, componentNames } = createComponentInfo(
    widgetName2ComponentName,
    page,
    modelNames,
  );

  const exportCode = createComponent(
    mainPad,
    componentNames,
    widgetName2ComponentName,
    page,
  );
  const modelCode = createModelImportCode(modelComponents.modelNames);
  const stateHeader = `const getData = (state, propsName, modelName, fieldName)=>{
    const model = state[ modelName ];
    if (!model) {
      return {};
    }
    const paths = fieldName.split('.');
    const data = model.getIn(paths);
    return { [propsName] : typeof data !== 'object' ? data : data ? data.toJS  ? data.toJS() : data:null }
  };`;
  const bindHandle = `
     function bindHandleEvent(e) {

        if(!e){
          return;
        }

        if(e.newValue || e.newValue === 0){
          return e.newValue;
        }

        if(e.value || e.value === 0){
          return e.value;
        }

        if(e.target && (e.target.value || e.target.value === 0)){
          return e.target.value;
        }
      }
  `;
  const code = `${pakage}
    ${themePakage}
    ${stateHeader}
    ${bindHandle}
    ${modelCode}
    ${styledCom}
    ${bindCode}
    ${classCode}
    export default () => {
      return (
        <React.Fragment>
          ${exportCode}
        </React.Fragment>
      );
    }`;

  return code;
};
