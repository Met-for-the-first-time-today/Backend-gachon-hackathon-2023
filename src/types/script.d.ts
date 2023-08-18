export type CreateScriptInfo = {
  title: string;
  token: string;
  data: string;
  speed: number;
};
export type EditScriptInfo = {
  index: number;
  token: string;
  title: string;
  data: string;
  speed: number;
};
export type EditSpeedInfo = {
  token: string;
  index: number;
  speed: number;
};
