import Layout from '@/layout'
import { getAuthorizedById } from '@/api/home/second'
import { getRoute } from '@/utils/auth'

// 保存用户可以看到的按钮
const buttonInfoList = []

function convertItem(item) {
  item.hidden = item.isshow !== '1'
  item.name = item.menuName
  item.path = item.menuRoute
  item.meta = {}
  item.meta.title = item.menuName
  item.meta.icon = item.fileKey || ''
  item.component = () => import(`@/pages${item.componentPath}`)
  return item
}

function convertSingleFatherRoute(item) {
  item = convertItem(item)
  item.component = Layout
  item.redirect = item.path + '/index'
  item.children = []
  item.children.push({
    path: 'index',
    component: () => import(`@/pages${item.componentPath}`),
    meta: item.meta,
    name: item.name,
    icon: item.fileKey || ''
  })
  item.meta = undefined
  item.name = undefined
  return item
}

function convertFatherRoute(item) {
  item = convertItem(item)
  item.component = Layout
  item.children = []
  return item
}

function sortBy(a, b) {
  return Number(a.power_sort) - Number(b.power_sort)
}

function loopRoute(arr, level = 1) {
  const promiseList = []
  arr.forEach((v) => {
    promiseList.push(
      new Promise((resolve) => {
        getAuthorizedById({
          pageSize: 10000,
          pageNumber: 1,
          powerBelongsToMenu: v.id
        })
          .then(res => {
            const list = res.list

            // 把按钮筛选出去，存在buttonInfoList
            for (let i = list.length - 1; i >= 0; i--) {
              const item = list[i]
              if (item.menuType === '2') {
                list.splice(i, 1)
                buttonInfoList.push(item)
              }
            }

            // 筛选掉按钮以后，长度为0代表没有子元素
            if (list.length === 0) {
              if (level === 1) {
                convertSingleFatherRoute(v)
              } else {
                convertItem(v)
              }
              resolve()
            } else {
              convertFatherRoute(v)
              list.forEach(item => {
                v.children.push(item)
              })
              loopRoute(v.children, level + 1)
                .then(() => {
                  resolve()
                })
            }
          })
      })
    )
  })
  return Promise.all(promiseList)
}

export function convert() {
  let origin = getRoute()
  if (!origin) return
  origin = origin.filter(v => v.menuType === '0')
  const route = origin

  // 获取到的是所有主菜单，循环获取子菜单
  return loopRoute(route)
    .then(res => {
      route.map(v => {
        const children = v.children
        if (children) {
          children.sort(sortBy)
        }
      })
      route.sort(sortBy)

      route.push({ path: '*', redirect: '/404', hidden: true })
      return {
        route,
        buttonInfoList
      }
    })
}
