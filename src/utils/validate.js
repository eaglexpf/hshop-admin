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
  let reg = /^1[3456789]\d{9}$/
  // ^1  以1开头
  // [3456789] 第2位，使用原子表里的任意一个原子都可以
  // \d{9}$  第三位  朝后可以是任意数字  并且最后结尾必须是数字
  console.log(reg.test(str))
  if (reg.test(str)) {
    return true
  }
  reg = /^[a-zA-z]\w{3,15}$/
  console.log(reg.test(str))
  return reg.test(str)
}
