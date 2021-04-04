import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, fromDocRef } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: Observable<any[]>;
  
  currentUser: any;
  image = "../../../assets/images/defaultProfile.png"
  o_userId: string;
  newChatId: string;
  currentUserObject: Observable<any>;

  constructor(
    private router: Router,
    private afauthSrv: AuthService,   
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private chatService: ChatService
  ) { 

  }
  
  ngOnInit() {
    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user;  
      
      this.currentUserObject = this.afs.collection("users").doc(this.currentUser.uid).valueChanges()
     
      this.loadCurrentUsersContacts();
    })
  }

   async loadCurrentUsersContacts(){
    return this.contacts = this.chatService.getContactsFromFireBase();
   }

  selectedContact(selectContactData: any){
    this.o_userId = selectContactData.uid
    this.afs.collection(`messages`).add( {      
      from: this.currentUser.uid,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
      participants: [
        this.currentUser.uid,
         this.o_userId,
        ],
      participantsDetails: [
        {
          displayName : this.currentUser.displayName,  
          photoURL: this.currentUser.photoURL, 
          uid: this.currentUser.uid
        },
        selectContactData
      ]
         
         
        
    }).then((docRef) => {
      this.newChatId = docRef.id
      this.afs.doc(`messages/${docRef.id}`)
      .update({ msgId : docRef.id})

      localStorage.setItem('selectedConversationId', docRef.id ); 
    }).then(() => 
    this.router.navigate(['/home/chats', this.newChatId ]))
  }

  async startSelectedChat(selectedContact, i){    
    return this.chatService.startNewChat(selectedContact, i)
    
  }


}
