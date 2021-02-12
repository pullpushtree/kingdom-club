import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  currentUser: any;
  user:any;

  image = "https://dummyimage.com/400";
  
  constructor( 
    private router: Router,
    private afauthSrv: AuthService,   
    ) { }

  ngOnInit() {

    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user;
      //console.log("profile.ts ngOnInit() this.currentUser value : ", this.currentUser)      
    });
  }
   editProfile(){
      this.router.navigate(['home/profile/edit/']);
  }

  followProfile(){
    console.log("follow was clicked")
  }
}
