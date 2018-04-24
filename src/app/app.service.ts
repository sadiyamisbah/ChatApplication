import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AppService {
  private baseUrl="https://chatapi.edwisor.com/api/v1";
  constructor(public http:HttpClient) { }

  //Method to signup functionality
  public signUp=(data):Observable<any> =>{

     const param=new HttpParams()
     .set('firstName',data.firstName)
     .set('lastName',data.lastName)
     .set('email',data.email)
     .set('mobileNumber',data.mobile)
     .set('password',data.password)
     .set('apiKey',data.apiKey)
    
     return this.http.post(`${this.baseUrl}/users/signup`,param);
     }//end 

//method for login functionality

public logIn=(data):Observable<any> => {
   const param=new HttpParams()
   .set('email',data.email)
   .set('password',data.password)
  
   return this.http.post(`https://chatapi.edwisor.com/api/v1/users/login`,param);
}//end

public handleError(err: HttpErrorResponse) {

  let errorMessage = '';

  if (err.error) {

    errorMessage = `${err.error.message}`;

  } else {

    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

  } // end condition *if

  
 
  return errorMessage;

}  // END handleError

public getUserInfoFromLocalstorage = () => {

  return JSON.parse(localStorage.getItem('userInfo'));

} // end getUserInfoFromLocalstorage


public setUserInfoInLocalStorage = (data) =>{

  localStorage.setItem('userInfo', JSON.stringify(data))


}



public logout(): Observable<any> {

  const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))

  return this.http.post(`${this.baseUrl}/users/logout`, params);

} // end logout function




  }



