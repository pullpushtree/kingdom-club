import { Component, OnInit, Input } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  @Input() IMAGE_PATH: any;
  
  isRecording = false;
  constructor(private cameraService : CameraService) { }

  ngOnInit() {
    
  }

  toggleRecording(){

    console.log("Starting isRecording value : ", this.isRecording)

    if(!this.isRecording) {
      this.isRecording = true
      console.log("isRecording = true ", this.isRecording)
      this.IMAGE_PATH = this.cameraService.startRecordVideo()
    } else { 
      this.isRecording = false   
      console.log("isRecording = false ", this.isRecording)     
      this.IMAGE_PATH = this.cameraService.stopRecordVideo()       
    }   
  }
}
