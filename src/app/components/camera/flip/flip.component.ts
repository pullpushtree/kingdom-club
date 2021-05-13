import { Component, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.scss'],
})
export class FlipComponent implements OnInit {
  isBackCamera: boolean = false ;
  
  constructor(
    private cameraService : CameraService,
    private toastr: ToastController, 
    ) { }

  ngOnInit() {}

  async toast(message, status){
    const toast = await this.toastr.create({
      message: message,
      position: 'bottom',
      color: status, 
      duration: 2000
    });
    toast.present();
  }

  toggleCamera( flip: any ){
    if (flip == true ){
      this.cameraService.stopCamera()
      .then( () => {
        this.cameraService.startCameraBack()
        .then( () => this.isBackCamera = true )
      })  
    } else {
      this.cameraService.stopCamera()
      .then( () => {
        this.cameraService.startCameraFront()
        .then( () => this.isBackCamera = false )
      })
    }
  }

  ionWillLeave(){
    this.cameraService.stopCamera()
      .then( () => {       
       this.isBackCamera = false        
      })
  }  
}
