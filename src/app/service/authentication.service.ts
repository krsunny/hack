import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  users = [
    {
      id: 1,
      username: "11111",
      firstName: "Sunny",
      lastName: "Kumar",
      type: 'manager'
    },
    {
      id: 2,
      username: "22222",
      firstName: "Test",
      lastName: "User1",
      type: 'user'
    },
    {
      id: 3,
      username: "33333",
      firstName: "Test",
      lastName: "User2",
      type: 'user'
    }
  ];

  constructor() { }


  login(username: string) {

    for (var i in this.users) {
      if (this.users[i].username == username) {
        localStorage.setItem('currentUser', JSON.stringify(this.users[i]))
        return true;
      }
    }

    return false;

  }

  getLoggedInUserDetails(){
    return JSON.parse((localStorage.getItem('currentUser')as any));
  }
}
