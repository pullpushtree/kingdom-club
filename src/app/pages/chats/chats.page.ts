import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/Message';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  image = "../../../assets/images/defaultProfile.jpg"
  messages: Observable<Message[]>;
  otherUserData: any;  
  newMsg = '' ;
  currentUser: any;
  o_userRef: any;
  o_user: any;
  msgRef: any;
  otherUserData2: Promise<Observable<unknown>>;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
  ) { }
  
  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.chatService.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;
      this.getMessages();
      this.getOtherUserDetailsByMsgId()   
    });
  }

  getMessages(){
    const msgId = this.activatedRoute.snapshot.paramMap.get("id");
    this.messages = this.chatService.getConversationHistory(msgId);
  }

  // clearChat(){
  //   this.chatService.clearChat()
  // }

   getOtherUserDetailsByMsgId(){
    const msgId = this.activatedRoute.snapshot.paramMap.get("id");
    this.chatService.formatOtherUserDetails(msgId)
    .then(res => { res.forEach(res => {
      this.otherUserData = res;
    })})
  }

  getOtherUser(userId){
    return this.chatService.getUser(userId)
    .subscribe(res => {      
        this.otherUserData = {
          photoURL: res.photoURL,
          firstLastName: res.firstLastName,
          displayName: res.displayName,
          uid: res.uid
        }
        return this.otherUserData
    })
  }  

  ionViewDidEnter() {  
    this.scrollToBottomOnInit();
  }

  scrollToBottomOnInit() {    
    setTimeout(() => {      
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(0);
      }
    }, 500);
  }

  viewSelectedProfile(o_userRef : any){   
    this.router.navigate(['home/profile-view/', o_userRef.uid]);
  }

  sendMessage(){
    const msgId = this.activatedRoute.snapshot.paramMap.get("id");  
    this.chatService.addChatMessageToConversationHistory(this.newMsg, msgId)
    .then(()=> {
      this.newMsg = '';
      setTimeout(() => {      
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom(0);
        }
      }, 400);
    })
  }

}
