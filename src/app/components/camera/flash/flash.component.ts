import { AfterViewInit, Component, OnInit, Renderer2,  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CameraService } from '../../../services/camera.service';

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.scss'],
})
export class FlashComponent implements OnInit, AfterViewInit {
  isFlashOn = false;
  flashMode = 'off'
  constructor(
    private cameraService : CameraService,
    private toastr: ToastController,
    private renderer: Renderer2
  ) { }

  ngOnInit() {}

  ngAfterViewInit(){
    if(this.isFlashOn == true) {
      this.renderer.setAttribute(this.isFlashOn, 'isFlashOn', 'true')
    }
  }

  toggleFlashMode(){
    
    if(this.flashMode == 'off') {
      this.flashMode = 'on';
      this.isFlashOn = true;
      this.cameraService.changeFlashMode(this.flashMode) 
    
    } else { 
      this.flashMode = 'off';
      this.isFlashOn = false;
      this.cameraService.changeFlashMode(this.flashMode)
    }
  } 

  async toast(message,status){
    const toast = await this.toastr.create({
      message: message,
      position: 'bottom',
      color: status, 
      duration: 2000
    });
    toast.present();
  }
  ionWillLeave(){    
    this.flashMode = 'off';
    this.isFlashOn = false;
    this.cameraService.changeFlashMode(this.flashMode)
  }
}
