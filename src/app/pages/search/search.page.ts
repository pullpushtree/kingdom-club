import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { IonSearchbar } from '@ionic/angular';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', { static : false } ) search : IonSearchbar;  
  @Input() currentUser;

  platformUserId : string
  platformUser: any;
  image = "../../../assets/images/defaultProfile.jpg";
  searchTerm: any;
  
  list: any = []; 
  following: any;
  isFollowing: boolean;
  o_userRef: string;

  constructor(
    private router: Router,    
    private afs: AngularFirestore,
    private followSvc: FollowService
  ) { }

  ngOnInit() {    
    
    this.getListOfUsers();
  }

  ionViewDidEnter(){    
    this.currentUser = JSON.parse(localStorage.getItem("userCredKey"));    
    setTimeout(() => {
      this.search.setFocus();
    });

    this.o_userRef = localStorage.getItem("otherUserObjectDetails")
    const o_userId = JSON.parse(this.o_userRef).uid

    this.following = this.followSvc.getFollowing(this.currentUser.uid, o_userId)
    .then(following => {      
      this.isFollowing = following.exists      
      console.log("this.isFollowing pv : ", this.isFollowing)      
    })
  }

  getListOfUsers(){
    this.list = this.afs.collection('users')
    this.list.valueChanges().subscribe(val => {
      this.platformUser = val 
    })
    this.searchTerm = this.list;
  }
  filterList(event){
    const val = event.target.value;
    console.log("event val : ", val) 
    this.searchTerm = this.platformUser;
    if(val && val.trim() != ''){
      this.searchTerm = this.searchTerm.filter((item: any) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }   
  }
 

  goToSelectedProfile(event: any){
    const val = event;
    const userData = {
      displayName: val.displayName, 
      photoURL: val.photoURL,
      uid: val.uid,
      firstLastName: val.firstLastName
    }
    localStorage.setItem('selectedUserProfileView', val.uid)
    localStorage.setItem('otherUserObjectDetails', JSON.stringify(userData))
    this.router.navigate(['home/profile-view/']);
  }
}
