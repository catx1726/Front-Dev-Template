export type MarkerType = {
  rotate: number
  width: number
  height: number
  id: string
  latitude: number
  longitude: number
  iconPath: string
  label: { content: string; fontSize: string; textAlign: string }
}

export interface MapSettings {
  marker: {
    rotate: number
    width: number
    height: number
    id: string
    latitude: number
    longitude: number
    iconPath: string
    label: { content: string; fontSize: string; textAlign: string }
  }[]

  circles: {
    latitude: number
    longitude: number
    radius: string
    fillColor: string
  }[]

  scale: number
  latitude: number
  longitude: number
}

export interface LocationInfo {
  lat: number
  lnt: number
}

export enum MapRenderMarkerType {
  USER = 0,
  PROJECT = 1
}

export enum MapBtnSwitchType {
  NORMAL = 0,
  TRAVAL = 1
}
