export interface Notifications {
  text: string;
  approved: boolean;
  approvedDate: firebase.default.firestore.Timestamp;
  archived: boolean;
  hasBeenOpened: boolean;
  contacts: [string, string];
  createdAt: firebase.default.firestore.Timestamp;
  requesterId: string;
  requesterPhoto: string;
  requesterDisplayName: string;
  requesterFirstLastName: string;
}
