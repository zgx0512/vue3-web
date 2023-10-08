// 自定义密码校验规则
export const validatePassword = (_: any, value: any, callback: any) => {
  // 密码正则：至少六位，且至少包含一个字母跟一个数字
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  if (reg.test(value)) {
    // 符合正则规则，放行
    callback()
  } else {
    // 不符合，提示信息
    callback(new Error('密码长度至少为六位，且至少包含一个字母跟一个数字'))
  }
}

// 自定义角色名校验规则
export const validateRoleName = (_: any, value: any, callback: any) => {
  // 角色名正则: 不能全是数字
  const reg = /^(?!\d+$)[\u4e00-\u9fa5\w]+$/
  if (reg.test(value)) {
    // 符合正则规则, 放行
    callback()
  } else {
    // 不符合, 提示信息
    callback(new Error('角色名不能全是数字'))
  }
}
