//用户登录接口携带参数的ts类型
export interface loginFormData {
    username: string,
    password: string
}
//定义全部接口返回数据都拥有ts类型
export interface responseData {
    code: number,
    message: string,
    ok: boolean
}
// 定义登录接口返回值的类型
export interface loginResponseData extends responseData {
    data: string,
}

export type dataResponseData = {
    avatar: string,
    buttons: string[],
    name: string,
    roles: string[],
    routes: string[],
}

// 定义获取用户信息接口返回值的类型
export interface userInfoResponseData extends responseData {
  data: dataResponseData
}