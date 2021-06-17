import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: Observable<any[]>;
  
  currentUser: any;
  image = "../../../assets/images/defaultProfile.jpg"
  o_userId: string;
  newChatId: string;
  currentUserObject: Observable<User>;

  constructor(
    private afauthSrv: AuthService,
    private chatService: ChatService
  ) { 

  }
  
  ngOnInit() {
    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user;  
      this.loadCurrentUsersContacts();
    })
  }

   async loadCurrentUsersContacts(){
    return this.contacts = this.chatService.getUserContactsForMessages();
   }

  
  async startSelectedChat(selectedContact : any){
    return this.chatService.startNewChat(selectedContact)
    
  }


}
