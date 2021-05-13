import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-hide',
  templateUrl: './hide.component.html',
  styleUrls: ['./hide.component.scss'],
})
export class HideComponent implements OnInit {

  isHidden = false;
  constructor(private cameraService : CameraService) { }

  ngOnInit() {}

  togglePreview(){

    console.log("Starting isHidden value : ", this.isHidden)
    if(this.isHidden) {
      this.isHidden = false    
      console.log("hide to false - show preview", this.isHidden)     
      this.cameraService.show()  
    } else { 
      this.isHidden = true
      console.log("hide to true - hide preview", this.isHidden)
      this.cameraService.hide()    
    }
  }
}
