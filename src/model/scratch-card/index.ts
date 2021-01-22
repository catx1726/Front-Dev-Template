export interface GiftsLevelInfoTypes {
  Id: string;
  Amount: number | string; // 后端返回,奖品总数
  ImgSrc: string;
  Level: number | string;
  LevelDesc: string;
  Name: string;
  Value: string | number;
  Year: string | number;
  Rest: string | number; // 后端返回奖品的剩余数
  Round?: number | string; // 前端计算,奖品总数 ÷ 每轮中奖人数
  Numbers?: number | string; // 前端计算,每轮中奖人数
  Done?: boolean; // 用来检测是否抽完
}
