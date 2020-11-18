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

1. 打卡规则，根据用户与项目的距离进行判断
2. 打卡地点切换
3. 登录
4. 界面
5. 测试

# Release

## V0.000002 - 2020-11-18

### FEAT

- 完成
  - 本地打卡 ( 地图绘制 / 权限多次拉取 / 打卡重置规则 )
  - 重新定位
  - 本地清楚打卡信息 ( 测试用 )

## V0.000001 - 2020-11-12

### FEAT ( request / layouts / assets )

- 完善，模板搭建，还剩下 request / router
