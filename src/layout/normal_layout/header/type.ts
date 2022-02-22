export interface LayoutHeaderInterface {
  eventContainer: Array<LayoutHeaderEventInterface>
}

export interface LayoutHeaderEventInterface {
  type: string
  dom: Node
  callBack: EventListenerOrEventListenerObject | null
}

const LayoutHeaderComp: LayoutHeaderInterface = {
  eventContainer: []
}

/**
 *
 * @description 执行入口函数
 * @param {EventListenerOrEventListenerObject | null} loadedCallBack
 * @param {EventListenerOrEventListenerObject | null} playedCallBack
 * @export
 */
export function handleVideoEntry(
  loadedCallBack: EventListenerOrEventListenerObject | null,
  playedCallBack: EventListenerOrEventListenerObject | null
) {
  const DOC = document,
    videoDOMList = DOC.querySelectorAll('video')
  handleVideoLoaded(videoDOMList, loadedCallBack)
  handleVideoPlayed(videoDOMList, playedCallBack)
}

/**
 *
 * @description 监听视频加载完成
 * @param {NodeList} domList
 * @export
 */
export function handleVideoLoaded(domList: NodeList, callBack: EventListenerOrEventListenerObject | null) {
  handleAddEventListener(domList, 'canplaythrough', callBack)
}

/**
 *
 * @description 监听视频播放完成
 * @param {NodeList} domList
 * @export
 */
export function handleVideoPlayed(domList: NodeList, callBack: EventListenerOrEventListenerObject | null) {
  // 这里需要注意一点，就是当 audio 组件设置了 loop，在注册之前先要将 loop 关掉
  handleAddEventListener(domList, 'ended', callBack)
}

/**
 *
 * @description 统一注册事件，并存入一个容器中，方便释放
 * @param {NodeList} domList
 * @param {string} type
 * @param {EventListenerOrEventListenerObject | null} callBack
 * @export
 */
export function handleAddEventListener(
  domList: NodeList,
  type: string,
  callBack: EventListenerOrEventListenerObject | null
) {
  console.log('handleAddEventListener:', type)
  domList.forEach((i) => {
    LayoutHeaderComp.eventContainer.push({ type, dom: i, callBack })
    i.addEventListener(type, callBack, false)
  })
}

/**
 *
 * @description 统一清理已经注册的事件
 * @param {Array<LayoutHeaderEventInterface>} layoutEventList
 * @export
 */
export function handleRemoveEventListener(
  layoutEventList: Array<LayoutHeaderEventInterface> = LayoutHeaderComp.eventContainer
) {
  layoutEventList.forEach((i) => {
    i.dom.removeEventListener(i.type, i.callBack)
    console.log('removeEventListener:', i.type)
  })
}
