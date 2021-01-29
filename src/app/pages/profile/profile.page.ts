import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from 'src/app/config/auth-constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  currentUser: any;
  constructor(    
    private localStorageService: StorageService,
    ) { }

  image: any;


  ngOnInit() {
    this.currentUser = this.localStorageService.get(AuthConstants.AUTH);
    if(this.currentUser != null){
      console.log("profile.ts ngOnInit current user : ", this.currentUser)
    } else {
      console.log("profile.ts ngOnInit currentUser is null")
    }
  }
}
