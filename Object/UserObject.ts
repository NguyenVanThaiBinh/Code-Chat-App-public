export default class UserObject {
  email: string;
  fullname: string;
  nickname: string;
  last_active: Date;
  isOnline: boolean;
  photoUserUrl: string;
  playerId_Onesignal: string;
  refresh_token: string;
  access_token: string;
  constructor(
    email: string,
    fullname: string,
    nickname: string,
    last_active: Date,
    isOnline: boolean,
    photoUserUrl: string,
    playerId_Onesignal: string,
    refresh_token: string,
    access_token: string
  ) {
    this.email = email;
    this.fullname = fullname;
    this.nickname = nickname;
    this.last_active = last_active;
    this.isOnline = isOnline;
    this.photoUserUrl = photoUserUrl;
    this.playerId_Onesignal = playerId_Onesignal;
    this.refresh_token = refresh_token;
    this.access_token = access_token;
  }
}
