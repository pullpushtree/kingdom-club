import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  currentUser: any;
  otherUserDetails: any;  
  private oUserSource = new BehaviorSubject<string>("");
  currentOUserStatus = this.oUserSource.asObservable();

  constructor(private afauthSrv: AuthService, private afs: AngularFirestore) {
    this.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });    
  } 

  changeOtherUser(oUser: string) {
    this.oUserSource.next(oUser);
  }

  getCurrentUser() {
    return this.afauthSrv.user$;
  }

  getUsers() {
    return this.afs
      .collection("users")
      .valueChanges({ idField: "uid" }) as Observable<any[]>;
  }

  setOtherUserData(o_user_data: any) {
    this.otherUserDetails = o_user_data;
  }

  getOtherUserData() {
    if (this.otherUserDetails != null) {
      return this.otherUserDetails;
    }
  }
}
