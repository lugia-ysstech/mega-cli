export default {
  // 元信息类型
  metaType: 'block',

  // (必)标识名 英文
  name: 'text-search-list-block',

  // (必)标题
  title: '文本搜索列表',

  // （必）文件名
  dirName: 'TextSearchListBlock',

  // (可)区块详细说明
  description: '',

  // (必) download 字段描述区块下载方式
  download: {
    type: 'npm', // 或者 github、gitlab、local
    // npm
    packageName: 'text-search-list-block',
    registry: 'http://192.168.102.79:5001/', // (可)
    version: '1.0.0',
    // npm end

    // github
    repository: 'owner/name',
    clone: false,
    branch: 'master',
    // github end

    // gitlab
    repository: 'owner/name',
    clone: false,
    branch: 'master',
    customOrigin: 'http://192.168.102.73:8081/',
    // gitlab end

    // local
    path: '/f/materials/TextSearchListBlock',
    // local end

    sourceCodeDirectory: 'src',
  },

  // (必) 分类
  categories: ['信息展示'],

  // (必) 截图
  screenshot: 'https://xxx.png',

  // (必) 发布时间
  publishTime: '1535979136796',

  // (必) 最后修改时间
  updateTime: '1535979136796',

  // (可) 额外依赖项
  dependencies: {
    uri: '1.0.1',
  },

  // (必) 外部使用的依据
  useConfig: {
    propTypes: {
      title: PropTypes.string,
      dataSource: PropTypes.array,
      onChange: PropTypes.func,
      Icon: PropTypes.element,
    },
    defaultProps: {
      title: '',
      dataSource: [{}],
      onChange: (noop = () => {}),
      Icon: (
        <Icon
          type="warning"
          style={{
            color: '#FFA003',
          }}
        />
      ),
    },
  },

  // (可) 保留字段, 依赖组件
  components: {
    '@lugia/web/table': {},
  },

  // (可) 保留字段
  extra: {
    // 分词, 用于搜索
    participle: {
      /* ... */
    },
  },
};
