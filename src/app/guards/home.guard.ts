import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constant';


@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private localStoreService: StorageService, 
    private router: Router
    ){ }

  canActivate(    
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    return new Promise(resolve => {
      this.localStoreService
      .get(AuthConstants.AUTH)
      .then(userIsLoggedInAndStored => {
        if (userIsLoggedInAndStored) {
          console.log("HomeGuard.ts // allows user to load home component - resolve(true)")
          //console.log(userIsLoggedInAndStored.user)
          resolve(true);          
          return 
        }else {
          console.log("HomeGuard.ts // Don't allow user to load home component - resolve(false)")                    
          resolve(false);  
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});        
          //this.router.navigate(['']);          
          console.log("Redirect user to '' ")
          return 
        }
      })
      .catch(err => {
        console.error("HomeGuard.ts ERROR. Resolve is false .", err)
        resolve(false);
      });
    });
  }
  
}
