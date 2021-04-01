import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


export interface User {
  uid: string;
  
  displayName: string;
  photoURL: string;
}

export interface Message {
  createdAt: firebase.default.firestore.FieldValue;  
  msgId: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
  fromPhoto: string;
  sentBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  user2: any;
  o_user: any;
  currentUser: User = null;
  selectedChatId: string;  
  otherUserObjectDetails: any;
  userData: any;  

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    //private authService: AuthService,
    private router: Router,
    
  ) { 
    this.afAuth.onAuthStateChanged(user => {      
      this.currentUser = user;
    })    
  }  

  getUsers() {
    return this.afs.collection('users').valueChanges({idField: 'uid'}) as Observable<User[]>;
  }
 
  async setOtherDetails(participantsDetails){
    const participantDetails = JSON.parse(participantsDetails)
      if(participantDetails != null){        
        if(this.currentUser.uid !== participantDetails[0].uid){
          
          localStorage.setItem("otherUserObjectDetails", JSON.stringify(participantDetails[0]))          
          return await participantsDetails[0];
        } else {          
          localStorage.setItem("otherUserObjectDetails", JSON.stringify(participantDetails[1]))          
          return await participantsDetails[1];
        } 
      } else {
        console.log("Nothing was selected")
      }
  }

  getContactsFromFireBase(){    
      return this.afs.collection(`contacts/${this.currentUser.uid}/contact`)  
        .valueChanges();   
  }

  getOtherUserDetailsForChat(){
    this.otherUserObjectDetails = JSON.parse(localStorage.getItem("otherUserObjectDetails"));    
    if(this.currentUser.uid !== this.otherUserObjectDetails.uid ){
      return this.otherUserObjectDetails
    } 
  }

  getFBUserForImg(msgFromObject): string {
    for(let usr of msgFromObject.participantsDetails){
      if(this.currentUser.uid !== msgFromObject.participantsDetails[0].uid ){
        return msgFromObject.participantsDetails[0].photoURL;
      } else {
        return msgFromObject.participantsDetails[1].photoURL;
      }
    }
    return 'Deleted or Value Does Not Exist'
  }

  getFBUserForMsg(msgFromObject): string {
    for(let usr of msgFromObject.participantsDetails){
      if(this.currentUser.uid !== msgFromObject.participantsDetails[0].uid ){
        localStorage.setItem("otherUserObjectDetails", JSON.stringify(msgFromObject.participantsDetails[0]))
        
        return msgFromObject.participantsDetails[0].displayName;
      } else {
        localStorage.setItem("otherUserObjectDetails", JSON.stringify(msgFromObject.participantsDetails[1]))
        
        return msgFromObject.participantsDetails[1].displayName;
      }
    }
    return 'Deleted or Value Does Not Exist'
  }

  getChatMessageFB(){    
    let users = [];
    return this.getUsers()
    .pipe(
      switchMap(res => {
      users = res;
      return this.afs.collection('messages', ref => 
        ref.where('participants', 'array-contains', this.currentUser.uid )
        .orderBy('createdAt'))
        .valueChanges({idField: 'msgId'}) as Observable<Message[]>
    }),
    map (messages => {      
      for(let msg of messages){
        msg.fromName = this.getFBUserForMsg(msg);
        msg.fromPhoto = this.getFBUserForImg(msg);
        msg.myMsg = this.currentUser.uid === msg.sentBy
      }
      console.log('FB messages: ', messages)
      return messages;
    })
    )
  }

  getOtherUserDetails(){    
    const otherDetails  = this.getOtherUserDetailsForChat()    
    if(otherDetails.uid !== this.currentUser.uid){
      this.o_user = {
        displayName: otherDetails.displayName,
        uid:  otherDetails.uid,
        photoURL:  otherDetails.photoURL
      }
      
      return this.o_user;
      
    } else {        
      console.log("this.o_user", this.o_user)
      console.log("Error. .this.currentUser.uid == other user's UID")
      return this.o_user;
    }
  }

  getConversationHistory(msgId){    
    return this.afs.collection(`messages/${msgId}/chat`, ref => 
    ref.orderBy('createdAt'))
      .valueChanges() as Observable<Message[]>;
  }

  addChatMessage(msg){   
    console.log("msg", msg) 
    this.currentUser = JSON.parse(localStorage.getItem("userCredKey")).user;
    this.selectedChatId = localStorage.getItem("selectedConversationId");    
    
    const otherDetail = this.getOtherUserDetails();
   
    if (otherDetail.uid !== this.currentUser.uid){     
      localStorage.setItem('otherUser', otherDetail.uid)      
      this.o_user =  otherDetail
    }

    const dataPayload = {
      
      text: msg,      
      sentBy: this.currentUser.uid,      
      createdAt: firebase.default.firestore.Timestamp.now(),
      participants: [this.currentUser.uid, this.o_user.uid]
    }
   
    return this.afs.collection(`messages/${this.selectedChatId}/chat`)
    .add(dataPayload)
    .catch(error => {      
      console.dir(error);     
    });
  }

  startNewChat(selectedContact, i){ 
    localStorage.setItem("otherUserObjectDetails", JSON.stringify(selectedContact))
    this.userData = {
      displayName: this.currentUser.displayName,
      photoURL: this.currentUser.photoURL,
      uid: this.currentUser.uid
    }

    const selectedContactId = selectedContact.uid   
   
    this.afs.collection('messages', ref => ref
    .where('participants', 'array-contains', `${selectedContactId}`)    
    ).valueChanges({ idField: 'id' })
    .subscribe(val => { 
      if (val.length != 0) {
        console.log("chat already exist - sending user to existing chat")        
        val.map( existingChat => { 
          console.log("existingChat value : ", existingChat)
          localStorage.setItem('activatedChat', JSON.stringify(existingChat))
          const chatId =  existingChat.id  
          console.log("chatId value : ",chatId)        
          this.router.navigate(['home/chats/', chatId])    
        })

      } else {
        console.log("chat does not exist - creating a new chat and sending user to chatId")            
       
        const data = 
          {
            participantsDetails: [              
               {
                displayName: this.currentUser.displayName,
                photoURL: this.currentUser.photoURL,
                uid: this.currentUser.uid                
               },
               {
                 displayName: selectedContact.displayName,
                 photoURL: selectedContact.photoURL,
                 uid: selectedContact.uid,
               }              
            ],
            participants: [this.currentUser.uid, selectedContact.uid],
            lastMessageTimeStamp: new Date(),
            recentMessage: {
              messageText: '',
              readyBy: {
                sentAt: new Date(),
                sentBy: this.currentUser.uid
              }
            },            
            sentBy : this.currentUser.uid,
            text: '',            
            createdAt: firebase.default.firestore.Timestamp.now()
          }
        
       this.afs.collection("messages").add(data)
       .then(res => console.log("res startNewChat", res))
              localStorage.setItem('activatedChat', JSON.stringify(data))
            }
           this.router.navigate(['home/chats/', selectedContactId])
    })
  }
}
