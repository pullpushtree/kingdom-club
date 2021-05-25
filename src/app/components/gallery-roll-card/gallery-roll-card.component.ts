import { Component, Input, OnInit } from "@angular/core";
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
    private profileSetup: ProfileSetupService
  ) {}

  ngOnInit() {}

  toggleHeart(img: any) {
    if (img.liked !== undefined && img.liked.includes(this.currentUser.uid)) {
      this.profileSetup.toggleHeartRemove(img);
    } 
    else if (!img.liked.includes(this.currentUser.uid)) {
      this.profileSetup.toggleHeartAdd(img);
    }
  }
}