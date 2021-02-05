import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileSetupService {
  
  profData: any;

  constructor() { }


  setProfData(profObj: any){
    this.profData = profObj
  }

  getProfData(){
    if(this.profData != null){
      return this.profData
    }
  }
}


