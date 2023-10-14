export default class GroupChatObject {
  id_chat_group: string;
  chat_name: string;
  memberData: Array<{ email: any; nickname: any; photoUserUrl: any }>;
  last_chat_content: string;
  last_chat_update: Date;
  photoGroupChatUrl: string;
  validateGroup: string;

  constructor(
    id_chat_group: string,
    chat_name: string,
    memberData: Array<{ email: any; nickname: any; photoUserUrl: any }>,
    last_chat_content: string,
    last_chat_update: Date,
    photoGroupChatUrl: string,
    validateGroup: string
  ) {
    this.id_chat_group = id_chat_group;
    this.last_chat_update = last_chat_update;
    this.chat_name = chat_name;
    this.memberData = memberData;
    this.last_chat_content = last_chat_content;
    this.photoGroupChatUrl = photoGroupChatUrl;
    this.validateGroup = validateGroup;
  }
}
