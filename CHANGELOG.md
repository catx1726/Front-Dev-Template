# 目录

> [toc]

# 如何写

- [CHANGELOG 参考文档](https://keepachangelog.com/zh-CN/1.0.0/)

- [Commitizen 参考文档](https://juejin.im/post/6844903831893966856#heading-21)

- [编写工具](https://typora.io)

- [为什么不用 git log](https://keepachangelog.com/zh-CN/1.0.0/)

建议配合 commitizen 一起编写，如下：

```javascript
types: [
    {value: 'feat',     name: 'feat:     A new feature'},
    {value: 'fix',      name: 'fix:      A bug fix'},
    {value: 'docs',     name: 'docs:     Documentation only changes'},
    {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'perf',     name: 'perf:     A code change that improves performance'},
    {value: 'test',     name: 'test:     Adding missing tests'},
    {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
    {value: 'revert',   name: 'revert:   Revert to a commit'},
    {value: 'WIP',      name: 'WIP:      Work in progress'}
  ],

scopes: [
    {name: 'accounts'},
    {name: 'admin'},
    {name: 'exampleScope'},
    {name: 'changeMe'}
  ]

```

# Unreleased

1. ~~打卡规则，根据用户与项目的距离进行判断~~
2. 打卡地点切换，进行中
3. 登录
   1. ~~本地登录~~
   2. 有后端的登录
   3. ~~登录逻辑修复，校验有无登录以 Name 为主也就是 Id，公司用的 Id，且没有 userInfo 的接口，无法根据 token 拿到 userInfo 也没必要。~~
4. 界面，进行中
5. 测试

# Release

## V0.000004 - 2020-11-27 / 28

### FEAT

> 完善，代码拆分，将 index.vue 中按照模块拆分成组件，减少文件压力

### PREF

> 完善，界面修改 index.vue 已基本完成，实现原型图上的样式

### FIX

> 修复，登录之后还需要登录，是因为没有 getUserInfo 的接口，所以无法 token 更新信息，所以需要重新登录，这里将 userInfo 也保存到 localStorage (在 store.getUserInfo 方法中)

### FEAT

## V0.000003 - 2020-11-19

### FEAT

- 完成，登录界面的简单本地逻辑以及权限认证
- 完成，打卡的规则不调用其他地图的 API，自己通过经纬度计算出两点的距离，返回值以公里为单位，但因为地图的 `radius` 是米为单位，所以在 `if` 时将返回值 `* 1000`后进行判断

## V0.000002 - 2020-11-18

### FEAT

- 完成
  - 本地打卡 ( 地图绘制 / 权限多次拉取 / 打卡重置规则 )
  - 重新定位
  - 本地清楚打卡信息 ( 测试用 )

## V0.000001 - 2020-11-12

### FEAT ( request / layouts / assets )

- 完善，模板搭建，还剩下 request / router
