import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  @Input() IMAGE_PATH: any;
  
  isRecording = false;
  constructor() { }

  ngOnInit() {
    
  }

  toggleRecording(){

    console.log("Starting isRecording value : ", this.isRecording)

    if(!this.isRecording) {
      this.isRecording = true
      console.log("isRecording = true ", this.isRecording)
    } else { 
      this.isRecording = false   
      console.log("isRecording = false ", this.isRecording)     
    }   
  }
}
