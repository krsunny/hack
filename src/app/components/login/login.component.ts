import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userId : any;
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    ) { }

  ngOnInit() {
    if(this.authenticationService.getLoggedInUserDetails()){
      this.router.navigate(['home'])
    }
    // this.userId = 1;
  }

  login(){
    console.log(this.userId);
    if(this.authenticationService.login(this.userId) == true){
      console.log("logi");
      
      this.router.navigate(['/home']);
    }
    
  }
}
