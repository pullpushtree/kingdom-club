export interface Chat {
  createdAt: firebase.default.firestore.Timestamp;
  sentBy: string;
  text: string;
  isMarkedOpen: boolean;
  participants: [string, string];
  isDeleted: boolean;
}
