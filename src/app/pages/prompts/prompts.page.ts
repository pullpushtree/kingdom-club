
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter  } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';


@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.page.html',
  styleUrls: ['./prompts.page.scss'],
})
export class PromptsPage implements OnInit {

  @Input() text: string;

  items: Observable<any[]>;
  da:any;
  selectedQuestion: string;
  promtId: string;

  
  constructor(
    private router: Router,
    private afs: AngularFirestore,    
    private profSrv: ProfileSetupService,
    private activatedRoute: ActivatedRoute,
  ) { 
    
    this.promtId = this.activatedRoute.snapshot.paramMap.get('id');    
    this.items = this.afs.collection('profile-questions').valueChanges();
  }

  async ngOnInit() {
  }
  
  userSelectedQuestion(event: any){        
    if (event.target != undefined){
      this.selectedQuestion  = event.target.innerHTML
      let selectedValue = {
        'text': this.selectedQuestion,
        'id': this.promtId
      }      
      this.profSrv.setProfData(selectedValue);      
      this.router.navigate(['home/profile/edit/']);
      
    }   
  }
}
