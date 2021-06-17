export interface Message {
  createdAt: firebase.default.firestore.Timestamp;
  participants: [string, string];
  recentMessage: {
    lastMessage: string;
    sentAt: string;
    sentBy: string;
    isMarkedOpen: boolean;
  };
  msgId: string;
  myMsg: boolean;
  otherUserPhoto: string;
  otherDisplayName: string;
  otherUserUID: string;
  otherFirstLastName: string;
}
