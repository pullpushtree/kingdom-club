import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';


export interface User {
  uid: string; 
  email: string;
  displayName: string;
}

export interface Message {
  createdAt: firebase.default.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  o_user: any;
  currentUser: User = null;


  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private authService: AuthService
  ) { 
    
    this.afAuth.onAuthStateChanged(user => {
      console.log('User changed : ', user);
      this.currentUser = user;
    })
  }

  addChatMessage(msg){
    return this.afs
    .collection(`messages/${this.currentUser.uid}/chat`)
    .add({
      msg: msg,
      from: this.currentUser.uid,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
      participants: [this.currentUser.uid, this.o_user.uid]
    });
  }

 

  getConversationsListToPutInMessagesInBox(){    
    const user2 =  JSON.parse(localStorage.getItem("userCredKey"));
    const userUID = user2.user.uid

    //const user2 = firebase.default.auth().currentUser;

  console.log("user2 I made : ", user2)
  console.log("userUID I made : ", userUID)

    
    //this.user
    //console.log('User id 2  : ', this.currentUser.uid);
    //const user = this.currentUser
    //console.log(this.currentUser)
    const converSations =  this.afs.collection('messages'
    //)
    , ref => 
    ref.where('participants', 'array-contains', userUID)
    .orderBy('createdAt'))
    .valueChanges() as Observable<Message[]>

    console.log("conversations : ", converSations)
    return converSations
  }

  getChatMessages(){
    let users = [];
    return this.getUsers().pipe(
      switchMap(results => {
        users = results;
        console.log("all users :", users);
        return this.afs.collection('messages', ref => 
        ref.where('participants', 'array-contains', this.currentUser.uid )
        .orderBy('createdAt'))
        .valueChanges({idField: 'id'}) as Observable<Message[]>
      }),
      map(messages => {
        for (let m of messages){
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        console.log("all messages : ", messages);
        return messages;
      })
    )
  }

  getUsers() {
    return this.afs.collection('users').valueChanges({idField: 'uid'}) as Observable<User[]>;
  }

  getUserForMsg(msgFromId, users: User[]): string {
    for (let usr of users){
      if(usr.uid == msgFromId) {
        return usr.displayName;
      }
    }
    return 'Deleted';
  }



  
}
