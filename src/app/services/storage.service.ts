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
      await this.storage.set(storageKey, encryptedValue)

    } catch (error) {
      console.log("storage serivce tried to SET encrypt data but failed");
      console.dir(error);
      return false
    }
  }

  async get(storageKey: string ){
    try{
      //const result = await Storage.get({key: storageKey });
      const result = await this.storage.get(storageKey);   
      if (result.value){
        return JSON.parse(unescape(atob(result.value)));
      } else {
        return false;
      }
    } catch (error) {
      console.log("storage serivce tried to GET encrypt data but failed");
      console.dir(error);
    }
  }
  async removeItem(storageKey: string){
    //await Storage.remove({ key: storageKey});
    await this.storage.remove(storageKey);
  }

  async clear(){
    await this.storage.clear();
    //await Storage.clear();
  }
}
