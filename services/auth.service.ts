import { User } from '../classes/User';
import getBackendResponse from '../pages/api/lib/endpoints';
import cookie from 'js-cookie';

// SINGLETON PATTERN

export class AuthService {

  static instance: AuthService;

  static getInstance() {
    if (AuthService.instance === undefined) {
        AuthService.instance = new AuthService();
    }

    return this.instance;
}

  isUserLoggedIn() : boolean | undefined {
    return !!cookie.get("jwtToken");
  }

  isUserAdmin() : boolean | undefined {
    return this.isUserLoggedIn() && cookie.get("userRole") === "admin";
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
    // API calls to set secure cookies
    // fetch("/api/auth/login", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ jwtToken: response.jwtToken })
    // });
    // fetch("/api/auth/login", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userRole: response.role })
    // });
    // fetch("/api/auth/login", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userId: response.userId })
    // });
    // dummy cookie set
    cookie.set("jwtToken", response.jwtToken);
    cookie.set("userRole", response.role);
    cookie.set("userId", response.userId);
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
    // API calls to delete cookies
    fetch("/api/auth/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    });
    // dummy cookie delete
    cookie.remove("jwtToken");
    cookie.remove("userRole");
    cookie.remove("userId");
  }

  getUserId(): string | undefined {
    return cookie.get("userId");
  }
}
