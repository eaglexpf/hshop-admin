import { asyncRoutes, constantRoutes, notFoundRoutes, resetAsyncRouter } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param menu_alias
 * @param route
 */
function hasPermission(menu_alias, route) {
  if (route.meta && route.meta.alias) {
    return menu_alias.some(alias => route.meta.alias.includes(alias))
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menu_alias
 */
export function filterAsyncRoutes(routes, menu_alias) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menu_alias, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menu_alias)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes).concat(notFoundRoutes)
    resetAsyncRouter(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, userInfo) {
    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, userInfo.menu_alias)
      if (userInfo.is_support_user) {
        accessedRoutes = asyncRoutes
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
