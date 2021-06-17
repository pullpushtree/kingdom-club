export interface RequestSent {
  text: string;
  approved: boolean;
  approvedDate: firebase.default.firestore.Timestamp;
  archived: boolean;
  hasBeenOpened: boolean;
  contacts: [string, string];
  createdAt: firebase.default.firestore.Timestamp;
  requestSentToId: string;  
}
