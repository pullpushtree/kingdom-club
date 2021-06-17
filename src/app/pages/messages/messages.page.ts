import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {  
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '' ;
  image = "../../../assets/images/defaultProfile.jpg";
  currentUser: any;
  timeoutHandler: NodeJS.Timeout;
  count: any;
  $subs: Subscription

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() { }

  ngOnDestroy(){
    console.log("ngOnDestroy got hit  ")
    this.$subs.unsubscribe();    
  }

  ionViewWillEnter(){
    this.chatService.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;      
      this.messages = this.chatService.getChatMessageFB()
    });
  }

  goToContacts(){
    this.router.navigate(['/home/contacts'])
  }

  selectedConversation(selectedOtherUserDetails: any){
    
    localStorage.setItem('selectedConversationId', selectedOtherUserDetails.msgId);
    localStorage.setItem('otherUserDetails', JSON.stringify(selectedOtherUserDetails));
    let markOpen = selectedOtherUserDetails.recentMessage['isMarkedOpen']
    
    if(markOpen == false ){
      this.chatService.toggleMarkedOpened(selectedOtherUserDetails.msgId, true)
    }

   this.router.navigate(['/home/chats/', selectedOtherUserDetails.msgId])
  }

  viewSelectedProfile(val: any){
    this.chatService.navigatetoToSelectedProfile(val.participants)
  }

  goToNotifications(){
    this.router.navigate(['/home/notifications'])
  }

  deleteMessage(item){
  console.log("item", item)
  //this.chatService.deleteMessage(item.msgId);   
  }
}

