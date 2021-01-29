import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(public storage: Storage) { }

  async set(storageKey: string, value: any){
    try{
      const encryptedValue = btoa(escape(JSON.stringify(value)));
      await this.storage.set(storageKey, encryptedValue);      
      return true;
    } catch (error) {      
      console.dir(error);
      return false
    }
  }

  async get(storageKey: string ){
    try{     
      const result = await this.storage.get(storageKey);         
      if (result){
        return JSON.parse(unescape(atob(result)));        
      } else {        
        return false;
      }
    } catch (error) {
      console.dir(error);
    }
  }
  async removeItem(storageKey: string){    
    await this.storage.remove(storageKey);
  }

  async clear(){
    await this.storage.clear();    
  }
}
