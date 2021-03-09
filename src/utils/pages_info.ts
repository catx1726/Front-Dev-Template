/* 
  DES 👳‍♀️
  起因: 直接使用 pages.json 的配置，做一个简单的路由权限
  方法: 
  1. 直接引用 json 文件 ——> 失败，报空
  2. 写脚本生成 .ts 文件
  3. 手动维护一个 .ts 文件，也就是从 json 文件中复制 
*/
// import * as data from '@/pages.json'

const data = {
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: '首页'
      },
      public: true
    },
    {
      path: 'pages/about/index',
      style: {
        navigationBarTitleText: '关于我'
      },
      public: true
    }
  ],
  subpackages: [
    {
      root: 'pages/sub-packages-one-pages',
      pages: [
        {
          path: 'login-page/index',
          style: {
            navigationBarTitleText: '登录界面',
            'app-plus': {
              titleNView: {
                autoBackButton: 'false'
              }
            }
          },
          public: true
        },
        {
          path: 'need-auth-page/index',
          style: {
            navigationBarTitleText: '登录解锁更多功能',
            'app-plus': {
              titleNView: {
                autoBackButton: 'false'
              }
            }
          },
          public: true
        }
      ]
    }
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['__APP__']
    },
    'pages/about/index': {
      network: 'all',
      packages: ['__APP__']
    },
    'pages/sub-packages-one-pages/need-auth-page/index': {
      network: 'all',
      packages: ['pages/sub-packages-one-pages']
    }
  },
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'tacomall',
    navigationBarBackgroundColor: '#fff',
    backgroundColor: '#F8F8F8'
  },
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#845d32',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/icon/tab-bar/home.png',
        selectedIconPath: 'static/icon/tab-bar/active-home.png',
        text: '首页'
      },
      {
        pagePath: 'pages/about/index',
        iconPath: 'static/icon/tab-bar/happy.png',
        selectedIconPath: 'static/icon/tab-bar/active-happy.png',
        text: '关于我'
      }
    ]
  }
}

export let pages: Array<Object | String> = handlePages(data.pages)

export let subPages: Array<Object | String> = handleSubPages(data.subpackages)

/**
 *
 * @description 传入 pages 然后只保存其 path 部分到数组
 * @param {Array<Object>} pages
 * @returns {Array<Object>}
 */
function handlePages(pages: Array<any>): Array<Object | String> {
  let pathList = pages.map((i) => {
    return { path: '/' + i.path, rule: i.rule, public: i.public || false }
  })
  return pathList
}

function handleSubPages(pages: Array<any>): Array<Object | String> {
  let pathList: (Object | String)[] = []
  pages.forEach((i) => {
    let root = '/' + i.root
    i.pages.forEach((e: any) => {
      pathList.push({ path: root + '/' + e.path, rule: e.rule, public: e.public || false })
    })
  })
  return pathList
}

export default {
  Pages: pages.concat(subPages)
}
