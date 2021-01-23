import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  constructor(
    private aftauth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout(){
    this.aftauth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    });
  }

}
