import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";



@Injectable({
  providedIn: "root",
})
export class ChatService {
  user2: any;
  o_user: any;
  currentUser: any;
  selectedChatId: string;
  otherUserObjectDetails: any;
  userData: any;
  otherUserData: any = {
    photoURL: "",
    displayName: "",
    firstLastName: "",
    uid: "",
  };
  otherUserData2: Observable<User[]>;
  newDateToUser: firebase.default.firestore.Timestamp;

  constructor(
    private authService: AuthService,    
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.authService.user$
    .subscribe((res) => {
      this.currentUser = res;    
    });
  }

  getCurrentUser() {
    return this.authService.user$;
  }

  getUsers() {
    return this.afs
      .collection<User>("users")
      .valueChanges({ idField: "uid" }) as Observable<User[]>;
  }

  getUser(uid: string) {
    return this.afs
      .collection<User>(`users`)
      .doc(uid)
      .valueChanges() as Observable<User>;
  }
  
  deleteMessage(msgId) {
    this.afs.collection<Chat>(`messages`).doc(msgId).delete();
  }
  
  navigatetoToSelectedProfile(participants: any) {    
    if (this.currentUser.uid !== participants[0]) {      
      this.router.navigate([`/home/profile-view/${participants[0]}`]);
    } else {
      this.router.navigate([`/home/profile-view/${participants[1]}`]);
    }
  }

  getUserContactsForMessages(){
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.afs
        .collection(`contacts/${this.currentUser.uid}/contact`)
        .valueChanges();
      }),
      map(contacts => {
        contacts.map(badSideResonseJuseUseItforUID => {          
          users.forEach(oUser => {
            if(oUser.uid == badSideResonseJuseUseItforUID['uid']){              
              this.otherUserData = {
                photoURL: oUser.photoURL,
                displayName: oUser.displayName,
                firstLastName: oUser.firstLastName,
                uid: oUser.uid,
              };
            }
          })
        })

        return contacts
      })
    )
  }

  getOtherUserDetailsForChat() {
    this.otherUserObjectDetails = JSON.parse(
      localStorage.getItem("otherUserDetails")
    );
    if (this.currentUser.uid !== this.otherUserObjectDetails.uid) {
      return this.otherUserObjectDetails;
    }
  }

  getChatMessageFB() {    
    let users = [];
    return this.getUsers().pipe(
      switchMap((res) => {
        users = res;

        return this.afs
          .collection("messages", (ref) =>
            ref
              .where("participants", "array-contains", this.currentUser.uid)
              .orderBy("createdAt")
          )
          .valueChanges({ idField: "msgId" }) as Observable<Message[]>;
      }),
      map((messages) => {
        for (let msg of messages) {
          let otherUserDetail = [];
          users.forEach((res) => {            
            if (
              (msg.participants[0] == res.uid &&
                this.currentUser.uid !== res.uid) ||
              (msg.participants[1] == res.uid &&
                this.currentUser.uid !== res.uid)
            ) {
              this.otherUserData = {
                photoURL: res.photoURL,
                displayName: res.displayName,
                firstLastName: res.firstLastName,
                uid: res.uid,
              };

              otherUserDetail.push(this.otherUserData);
            }
          });
          msg.msgId,
          (msg.otherUserPhoto = otherUserDetail[0].photoURL),
          (msg.otherDisplayName = otherUserDetail[0].displayName),
          (msg.otherFirstLastName = otherUserDetail[0].firstLastName),
          (msg.otherUserUID = otherUserDetail[0].uid),            
          (msg.participants = [msg.participants[0], msg.participants[1]]);
          msg.myMsg = this.currentUser.uid === msg.recentMessage["sentBy"];
          msg.recentMessage = {
            sentBy: msg.recentMessage["sentBy"],
            sentAt: msg.recentMessage["sentAt"],
            lastMessage: msg.recentMessage["lastMessage"],
            isMarkedOpen: msg.recentMessage["isMarkedOpen"],
          };          
        }
        return messages;
      })
    );
  }

  getConversationHistory(msgId: string) {
    return this.afs
      .collection(`messages/${msgId}/chat`, (ref) => ref.orderBy("createdAt"))
      .valueChanges() as Observable<Message[]>;
  }

  async getMessageById(msgId: string) {
    return this.afs.collection<Chat>(`messages/${msgId}/chat`)
      .valueChanges() as Observable<Chat[]>;    
  }

  async toggleMarkedOpened(msgId: string,  toggleValue : boolean){
    const chatBubblePayload = {      
      recentMessage :{
        isMarkedOpen: toggleValue
      }
    };

    this.afs.doc(`messages/${msgId}`)
    .set(chatBubblePayload, {merge: true})
    .catch((error) => {
      console.dir(error);
    });
  }

  async setOtherDetails(participants: any) {    
    if (this.currentUser.uid !== participants[0].uid) {      
      let tempVal = this.afs.collection<User>("users").doc(participants[0].uid);
      return tempVal;
    } else {
      let tempVal = this.afs.collection<User>("users").doc(participants[1].uid);
      return tempVal;
    }
  }

  async getOtherDetails(msgObj: string) {
    return await this.setOtherDetails(msgObj);
  }

  async getOtherSingleUserData(o_user_uid) {
    return this.afs
      .doc<User>(`users/${o_user_uid}`)
      .valueChanges() as Observable<User>;
  }

  async getOtherUserbyMessageId(msgId: string) {
    return this.afs.doc(`messages/${msgId}`).valueChanges() as Observable<Message[]>;
  }

  async formatOtherUserDetails(msgId: string) {
    let users = [];
    return this.getUsers().pipe(
      switchMap((res) => {
        users = res;        
        return this.afs.doc<Message>(`messages/${msgId}`).valueChanges() as Observable<Message>
      }),
  
      map((bubble) => {       
          bubble.participants.forEach((res) => {            
            if (res !== this.currentUser.uid) {              
              users.filter((oUser) => {
                if (oUser.uid == res) {                  
                  this.otherUserData = {
                    otherPhotoURL: oUser.photoURL,
                    otherDisplayName: oUser.displayName,
                    otherFirstLastName: oUser.firstLastName,
                    otherUid: oUser.uid,
                  };
                  return this.otherUserData;
                }
              });
            }
            return this.otherUserData
          });
        return bubble =  this.otherUserData;
      })
    );
  }

  async clearChat(msgId){    
    this.afs.collection(`messages`).doc(msgId)
    .set({
      createdAt: firebase.default.firestore.Timestamp.now()
    });
  }

  async addChatMessageToConversationHistory(msgText: string, msgId: string) {
    let oUserObj =  this.getOtherUserDetailsForChat()
    const chatBubblePayload = {
      createdAt: firebase.default.firestore.Timestamp.now(),
      participants: [this.currentUser.uid, oUserObj.otherUserUID],
      sentBy: this.currentUser.uid,
      text: msgText,
      isDeleted: false
    };

    this.afs.collection(`messages/${msgId}/chat`)
    .add(chatBubblePayload)
    .catch((error) => {
      console.dir(error);
    });

    const messagePayLoad = {
      recentMessage: {
        lastMessage: msgText,
        sentAt: firebase.default.firestore.Timestamp.now(),
        sentBy: this.currentUser.uid,
        isMarkedOpen: false
      }
    }   
    this.afs.doc(`messages/${msgId}`)
      .update(messagePayLoad) 
    .catch((error) => {
      console.dir(error);
    });    
  }

  async startNewChatFormater(newContactObj: any){
    let newSelectedContactRef = {
            createdAt: this.newDateToUser,
            participants: [this.currentUser.uid, newContactObj.requesterId],
            recentMessage: {
              lastMessage: '',
              seen: null,
              sentOn: null,
              sentBy: this.currentUser.uid,
              isMarkedOpen: false,
            },
            uid: newContactObj.requesterId
    }

    this.startNewChat(newSelectedContactRef)
  }

  async startNewChat(selectedContact : any) {
    localStorage.setItem("otherUserObjectDetails", JSON.stringify(selectedContact));

    const selectedContactId = selectedContact.uid;

    this.afs.collection("messages", (ref) =>
        ref.where("participants", "array-contains", `${selectedContactId}`)
      )
      .valueChanges({ idField: "msgId" })
      .subscribe((result) => {
        if (result.length > 0 ) {
          result.map((msgObj) => {
            localStorage.setItem("activatedChat", JSON.stringify(msgObj));
            const chatId = msgObj.msgId;
            this.router.navigate(["home/chats/", chatId]);
          });
        } else {
         const data ={
           createdAt: firebase.default.firestore.Timestamp.now(),
           participants: [ this.currentUser.uid, selectedContact.requesterId ],
           recentMessage: {
              lastMessage: '',
              seen: null,
              sentOn: null,
              sentBy: this.currentUser.uid,
              isMarkedOpen: false,
            },
            uid: selectedContact.requesterId,
            type: 'text'
         }

          this.afs
            .collection("messages")
            .add(data)
            .then((res) => {
              this.afs.doc(res.id).update({msgId: res.id})              
            })
            .catch(error => console.log(error));
          localStorage.setItem("activatedChat", JSON.stringify(data));
        }
      });
  }

  async sendSelectedProfileViewUserMessage(oUserObj :any, newMsg: string , selectedMedia: string, type: string){
    
    const chatBubblePayload = {
      createdAt: firebase.default.firestore.Timestamp.now(),
      isDeleted: false,
      media: selectedMedia,      
      participants: [this.currentUser.uid, oUserObj.uid],
      sentBy: this.currentUser.uid,
      text: newMsg,
      type: type
    };

    this.afs.collection(`messages/`, ref => 
    ref.where("participants", "array-contains", this.currentUser.uid))
    .ref.where("participants", "array-contains",  oUserObj.uid)
    .get()
 
    .then((querySnapshot) => {

      if( querySnapshot !== null ){
        querySnapshot.forEach((doc) => {           
            this.afs.collection(`messages/${doc.id}/chat`)            
          .add(chatBubblePayload)
          console.log("new stuff added ")
        });
      }    
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
  }
}
