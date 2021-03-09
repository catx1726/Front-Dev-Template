import { PageRuleEnum } from '../page-rule'

export default class User {
  public name: string
  public age: number
  public id: string

  constructor(name: string, age: number, id: string) {
    this.name = name
    this.age = age
    this.id = id
  }
}

export interface userTypes {
  id?: string // 数据库生成的ID
  userName: string // 用户微信的名称，非真实姓名
  realName: string // 用户的真实姓名
  uniId: string // 后端返回的用户相对于所有小程序以及公众号等平台的唯一值
  openId: string // 后端返回的用户对于当前小程序的唯一值
  avatar?: string // 用户的头像
  rule: PageRuleEnum // 用户的权限
}
