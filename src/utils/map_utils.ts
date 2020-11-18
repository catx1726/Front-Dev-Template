/* 
  TODO
  1. 禁止点击定位
  2. 修改打卡地点，选择项目之后修改中心点
  3. 点击打卡，根据项目地点的半径( 自己指定 )进行判断
*/

import { MapSettings, MapRenderMarkerType, markerType, locationInfo } from '@/model/map-settings/index'

/* 绘制Icon*/
/**
 *
 *
 * @export
 * @description 绘制Icon
 * @param {MapRenderMarkerType} type
 * @param {MapSettings} mapSettings
 * @param {locationInfo} localInfo
 * @returns
 */
export function mapRenderLocationIcon(type: MapRenderMarkerType, mapSettings: MapSettings, localInfo: locationInfo) {
  let markerTemplate: markerType = {
    rotate: 0,
    width: 20,
    height: 20,
    id: '',
    latitude: localInfo.lat,
    longitude: localInfo.lnt,
    iconPath: '',
    label: { content: '', textAlign: 'center', fontSize: '12' }
  }

  if (type === MapRenderMarkerType.USER) {
    markerTemplate.label.content = '你'
    markerTemplate.iconPath = '../../static/icon/map/person.png'
    mapSettings.marker[1] = markerTemplate
  }

  if (type === MapRenderMarkerType.PROJECT) {
    markerTemplate.label.content = '打卡地址'
    markerTemplate.iconPath = '../../static/icon/map/local.png'
    mapSettings.marker[0] = markerTemplate
    mapSettings.circles[0] = {
      latitude: localInfo.lat,
      longitude: localInfo.lnt,
      radius: '100',
      fillColor: '#42b98375'
    }
  }

  return mapSettings
}

export function mapDisableClickLocate(map: any) {
  console.log('mapDisableClickLocate:', map)
}

export function mapInitCenter(map: any, center: object) {}

export function mapChangeCenter(map: any, center: object) {}

export function mapSpanUser(map: any, uLoca: object, mCenter: object) {}

export function mapGetUserLocation() {
  let backInfo = {}
  console.log('地址拉取中!')
  // 获取地理位置
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success(res) {
        backInfo = { ...res }
        console.log('地址获取成功!', backInfo)
        resolve({ ...backInfo, authState: true })
      },
      fail(res) {
        reject(false)
      }
    })
  })
}

/* 
  第一次权限获取，自动触发 
*/
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
        reject({ msg: 'no auth', latitude: '', longitude: '', authState: false })
      }
    })
  })
}

/* 
  再次获取授权，手动触发
  当用户第一次拒绝后再次请求授权 
*/
// TODO 用户如果已经授权
export function mapGetUserAuthorizeInfoClick() {
  return new Promise((resolve, reject) => {
    mapGetUserLocation()
      .then((res) => {
        // 已经有权限了，静默无声
        resolve(res)
      })
      .catch((res) => {
        // 没权限，弹窗
        uni.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success(res) {
                  console.log('map utils mapGetUserAuthorizeInfoClick openSetting sucess:', res)
                  resolve(mapGetUserLocation())
                }
              }) // 打开地图权限设置
            } else if (res.cancel) {
              uni.showToast({
                title: '你拒绝了授权，无法获得地址信息',
                icon: 'none',
                duration: 1000
              })
              reject({ msg: 'no auth', latitude: '', longitude: '', authState: false })
            }
          }
        })
      })
  })
}
