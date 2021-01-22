export interface WinUserInterface {
  State: string | number;
  AwardId: string | number;
  LevelDesc: string | number;
  ParticipantId: string | number;
  Participation: Array<{ Id: string; Name: string }>;
}
