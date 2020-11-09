import store from '@/store'

// function checkHas (arr, buttonCode) {
//     if (!Array.isArray) return false;
//     return arr.some(v => {
//         if (v.menuType === '2' && v.menuCode == buttonCode) {
//             return true;
//         }
//         let children = v.children;
//         if (children) {
//             if (checkHas(children)) return true;
//         }
//         return false;
//     })
// }

export function hasButton(buttonCode) {
  const arr = store.state.permission.buttonInfoList

  // return checkHas(arr, buttonCode);

  return arr.some(v => v.menuType === '2' && v.menuCode == buttonCode)
}
