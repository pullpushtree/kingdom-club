import { Component, Input, OnInit } from "@angular/core";
import { MediaService } from "../../services/media.service";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-select-image",
  templateUrl: "./select-image.component.html",
  styleUrls: ["./select-image.component.scss"],
})
export class SelectImageComponent implements OnInit {
  @Input() data: any;
  @Input() image: string;
  constructor(    
    private popover: PopoverController,
    private media: MediaService
  ) {}
  ngOnInit() {}
  async addPhotoAction(source) {
    console.log("source", source);
    return await this.media.addPhoto(source);    
  }

  async closePopover() {
    await this.popover.dismiss();
  }
}
