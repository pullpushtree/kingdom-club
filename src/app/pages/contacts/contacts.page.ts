import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: Observable<any[]>;
  
  currentUser: any;
  image = "https://dummyimage.com/400";
  o_userId: string;

  constructor(
    private router: Router,
    private afauthSrv: AuthService,   
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user;

      console.log("this.currentUser.uid value", this.currentUser.uid)
      this.getContactsFromFireBase()
    })
  }

   async getContactsFromFireBase(){
     this.contacts = this.afs
       .collection(`contacts/${this.currentUser.uid}/contact`)  
       .valueChanges();
       console.log("Contacts: from getContactsFromFireBase ",this.contacts)
   }

//create new chat with selected contact
  selectedContact(selCon: any){    
    const selectContactUid = selCon.uid
    console.log("this.contacts.ts selectedContact(selCon) selCon value : ",selectContactUid)
    
    this.o_userId = selCon.uid
    const mesg = this.afs.collection(`messages`).add( {      
      from: this.currentUser.uid,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
      participants: [this.currentUser.uid, this.o_userId]
    }).then((docRef) => {
      docRef.id
      this.afs.doc(`messages/${docRef.id}`)
      .update({ msgId : docRef.id})
      console.log("message res id is : ", docRef.id)
    }).then(() => this.router.navigate(['/home/chats']))
  }


}
