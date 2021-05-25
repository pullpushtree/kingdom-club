import { Component, Input, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { ProfileSetupService } from 'src/app/services/profile-setup.service';

@Component({
  selector: "app-gallery-roll-card",
  templateUrl: "./gallery-roll-card.component.html",
  styleUrls: ["./gallery-roll-card.component.scss"],
})
export class GalleryRollCardComponent implements OnInit {
  @Input() currentUser: any;
  @Input() img: any;

  constructor(    
    private profileSetup: ProfileSetupService,
    private toastr: ToastController,
  ) {}

  ngOnInit() {}

  toggleHeart(img: any) {
    
    if (img.liked !== undefined && img.liked.includes(this.currentUser.uid)) {     
      this.profileSetup.toggleHeartRemove(img);
    } 
    else if (img.liked == undefined || !img.liked.includes(this.currentUser.uid)) {      
      this.profileSetup.toggleHeartAdd(img);
    } else {
      this.toast("Like didn't work!", "danger");
      console.log("Liked attempt didn't work.");
    }
  }
  
  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      position: "bottom",
      color: status,
      duration: 2000,
    });
    toast.present();
  }
}