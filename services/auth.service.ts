import { User } from '../classes/User';
import getBackendResponse from '../pages/api/lib/endpoints';

// SINGLETON PATTERN

export class AuthService {

  static instance: AuthService;

  private RUNNING_ON_SERVER = typeof window === "undefined";

  private userLogged: boolean | null = !this.RUNNING_ON_SERVER ? !!localStorage.getItem("jwtToken") : null;
  private userRole: String | null = !this.RUNNING_ON_SERVER && !!localStorage.getItem("jwtToken") ? localStorage.getItem("userRole") : null;

  static getInstance() {
    if (AuthService.instance === undefined) {
        AuthService.instance = new AuthService();
    }

    return this.instance;
}

  isUserLoggedIn() : boolean | null {
    return this.userLogged;
  }

  isUserAdmin() : boolean | null {
    return this.isUserLoggedIn() && this.userRole === "admin";
  }

  signIn = async (email: string, password: string): Promise<boolean> => {
    const credentials = {
      email: email,
      password: password
    };
    const { response } = (
      await getBackendResponse("login", "POST", JSON.stringify(credentials))
    ).props;
    if (response.jwtToken === undefined) {
      return false;
    }
    this.userLogged = true;
    this.userRole = response.role;
    localStorage.setItem("jwtToken", response.jwtToken);
    // TODO : creo un endpoint nel backend che mi restituisca il ruolo dato un JWT
    localStorage.setItem("userRole", response.role);
    // TODO : creo un endpoint nel backend che mi restituisca lo userId dato un JWT
    localStorage.setItem("userId", response.userId);
    return true;
  }

  signUp = async (user: User) : Promise<boolean> => {
    const { response } = (
      await getBackendResponse("user", "POST", JSON.stringify(user))
    ).props;
    if (response.code !== undefined) {
      return false;
    }
    return true;
  }

  logout(): void {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    this.userLogged = false;
    this.userRole = null;
  }

  getUserId() {
    return localStorage.getItem("userId");
  }
}
