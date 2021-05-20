import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-gallery',
  templateUrl: './profile-gallery.page.html',
  styleUrls: ['./profile-gallery.page.scss'],
})
export class ProfileGalleryPage implements OnInit {

  gallery: Observable<any[]>;  
  currentUser: any;
  image = "../../../assets/images/logo_square.png";
  userData = {
    displayName: "",
    firstLastName: "",
    photoURL: ""
  }
  bulkEdit = false;
  selected = false;
  
  selectedItems = [];
  pictureCount: number;
  noPictures: boolean;
  
  

  constructor(
    private router: Router,
    private afauthSrv: AuthService,
    private gallerySetup: ProfileSetupService,
  ) { 
    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user    
      this.userData = {
        displayName: this.currentUser.displayName,
        firstLastName: this.currentUser.firstLastName,
        photoURL: this.currentUser.photoURL
      };
      this.getGalleryPictures();
    })
  }

  ngOnInit() { }

  gotToProfile(){
    this.router.navigateByUrl('home/profile');
  }

  getGalleryPictures(){ 
    this.gallery = this.gallerySetup.getUserGalleryPictures()
  
    this.gallery.subscribe((res) => {
      this.pictureCount = res.length;
      console.log("this.pictureCount # : ", this.pictureCount );

      if (this.pictureCount > 0){
        this.noPictures = true;
      } else {
        this.noPictures = false;
      }
    })
  }

  openSelectedPicture(index: any){
    this.router.navigateByUrl('home/profile-roll/' + index )
  }
  
  toggleBulkEdit(){
    this.bulkEdit = !this.bulkEdit;
  }

  toggleCirlce(){
    this.selected = !this.selected;
  }
  toggleCirlce2(item: any){
    item.isSelected = false;
  }

  toggleIcon(item: any){
    item.icon = false;
  }

  selectedItem(item: any){
    item.isSelected = !item.isSelected;
    item.icon = !item.icon;

    if(!item.isSelected){
      const selectedItemsArray = this.selectedItems 

      for ( var i = 0; i < selectedItemsArray.length; i++){
        if(selectedItemsArray[i].uid == item.uid) {
          selectedItemsArray.splice(i, 1);
        }
      }
    } else {      
      //Add selected item 
      this.selectedItems.push(item);
    }
  }  

  delete(){
    this.selectedItems
    if(this.selectedItems.length !== 0){      
      this.gallerySetup.deleteSelected(this.selectedItems)
      this.unselectAllItems();
      this.toggleBulkEdit();
    }    
  }
  
  unselectAllItems(){
    this.selectedItems.forEach(res => {
      this.toggleIcon(res);
      this.toggleCirlce2(res);
    });    
    
    this.selectedItems = [];
    this.selected = false;
    console.log("unselectAllItems()  this.selectedItems[] value : ", this.selectedItems)
  }



}
