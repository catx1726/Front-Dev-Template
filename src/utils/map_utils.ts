/* 
  TODO
  1. 禁止点击定位
  2. 修改打卡地点，选择项目之后修改中心点
  3. 点击打卡，根据项目地点的半径( 自己指定 )进行判断
*/

export let locationInfo = {}

export function mapDisableClickLocate(map: any) {
  console.log('mapDisableClickLocate:', map)
}

export function mapInitCenter(map: any, center: object) {}

export function mapChangeCenter(map: any, center: object) {}

export function mapSpanUser(map: any, uLoca: object, mCenter: object) {}

export function mapGetUserLocation() {
  let backInfo = {}
  console.log('授权成功，地址拉取中!')
  // 获取地理位置
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success(res) {
        backInfo = { ...res }
        console.log('地址获取成功!', locationInfo)
        resolve(backInfo)
      }
    })
  })
}

export async function mapGetUserAuthorizeInfo() {
  console.log('授权开始!')
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success(res) {
        // 允许授权
        console.log('授权成功!')
        resolve(mapGetUserLocation())
      },
      fail(res) {
        // 拒绝授权
        console.log('你拒绝了授权，无法获得地址信息!')
        reject('no auth')
      }
    })
  })
}
