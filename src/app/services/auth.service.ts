import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null | undefined;
  user: UserModel = new UserModel();
  responseString: string | null | undefined;
  decode: JwtPayload | any;
  constructor(
    private router: Router
  ) { }

  JsonParse() {
    if (this.responseString === null) {
      this.router.navigateByUrl("/sign-in");
      return false;
    }
    this.responseString = localStorage.getItem("token");
    this.token = this.responseString;
    this.decode = jwtDecode(this.token!);

    this.user.id = this.decode["Id"];
    this.user.email = this.decode["Email"];
    // this.user.firstName = this.decode["FirstName"];
    // this.user.lastName = this.decode["LastName"];
    this.user.userName = this.decode["UserName"];
    this.user.role = this.decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    // this.role(this.user.userRole)
    // console.log(this.user.role);
    return true;
  }

  isAdmin() {
    this.isAuthenticated();
    if (this.user.role === "Admin" || this.user.role === "Super Admin") {
      return true;
    }
    return false
  }

  // isAdminOrManager() {
  //   this.isAuthenticated();
  //   return this.user.role === "Super Admin" || this.user.role === "Admin" || this.user.role === "Proje Yöneticisi";
  // }

  // isUser() {
  //   this.isAuthenticated();
  //   if (this.user.role === "User") {
  //     return true;
  //   }
  //   return false
  // }

  isAuthenticated() {
    const responseString: string | null = localStorage.getItem("token");
    if (responseString != null) {
      try {
        this.JsonParse();
        const now: number = new Date().getTime() / 1000;
        const exp: number | undefined = this.decode.exp;


        if (exp == undefined) {
          this.router.navigateByUrl("/sign-in");
          return false;
        }

        if (exp < now) {
          this.router.navigateByUrl("/sign-in");
          return false;
        }

        return true;

      } catch (error) {
        console.warn(error);
        this.router.navigateByUrl("/sign-in");
        return false;
      }
    }
    else {
      this.router.navigateByUrl("/sign-in");
      return false;
    }
  }
}
