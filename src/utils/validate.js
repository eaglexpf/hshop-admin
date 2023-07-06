/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // 验证手机号
  let reg = /^1[3456789]\d{9}$/
  // ^1  以1开头
  // [3456789] 第2位，使用原子表里的任意一个原子都可以
  // \d{9}$  第三位  朝后可以是任意数字  并且最后结尾必须是数字
  if (reg.test(str)) {
    return true
  }
  // 验证邮箱
  reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (reg.test(str)) {
    return true
  }
  // 验证账号
  reg = /^[a-zA-z]\w{3,15}$/
  return reg.test(str)
}
