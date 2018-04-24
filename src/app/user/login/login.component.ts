import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;
  constructor(public appservice: AppService, public router: Router, private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  //method to login
  public logInFunction = (): any => {
    let data = {
      'email': this.email,
      'password': this.password
    }
    
    this.appservice.logIn(data).subscribe(
      Response => {
        
        if (Response.status === 200) {
          Cookie.set('authtoken', Response.data.authToken);
            
          Cookie.set('receiverId', Response.data.userDetails.userId);
         
          Cookie.set('receiverName', Response.data.userDetails.firstName + ' ' + Response.data.userDetails.lastName);
        
          this.appservice.setUserInfoInLocalStorage(Response.data.userDetails)
         
          this.router.navigate(['/chat']);


        }
        else {
          this.toastr.error(Response.message);
        }
      },
      (err) => {
    
        this.toastr.error(this.appservice.handleError(err));
      });
  }//end
}
