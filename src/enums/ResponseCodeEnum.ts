export enum ResponseCodeEnum {
  //操作结果
  SUCCESS = -1,
  FAILED = 1,
  UNEXPECTED_EXCEPTION = 2,
  OTHER = 3,
  EXPIRED_DATA = 4,
  ILLEGAL = 5,
  OUT_OF_PERIOD = 6,
  //权限验证
  ERROR_LOGIN_INFO = 100,
  TOKEN_EXPIRATION = 101,
  INVALID_TOKEN = 102,
  //状态
  FINISHED = 200
}
