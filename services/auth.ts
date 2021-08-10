import { User } from '../classes/User';
import getBackendResponse from '../pages/api/lib/endpoints';
import cookie from 'js-cookie';

export const isUserLoggedIn = () : boolean | undefined => {
  return !!cookie.get("userId");
}

export const isUserAdmin = () : boolean | undefined => {
  return isUserLoggedIn() && cookie.get("userRole") === "admin";
}

export const signIn = async (email: string, password: string): Promise<boolean> => {
  const credentials = {
    email: email,
    password: password
  };
  const { response } = (
    await getBackendResponse("login", "POST", JSON.stringify(credentials))
  ).props;
  if (response.userId === undefined) {
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
  cookie.set("username", response.username);
  cookie.set("userRole", response.role);
  cookie.set("userId", response.userId);
  return true;
}

export const signUp = async (user: User) : Promise<boolean> => {
  const { response } = (
    await getBackendResponse("user", "POST", JSON.stringify(user))
  ).props;
  if (response.code !== undefined) {
    return false;
  }
  return true;
}

export const logout = (): void => {
  // API calls to delete cookies
  // fetch("/api/auth/logout", {
  //   method: "post",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({})
  // });
  // dummy cookie delete
  cookie.remove("username");
  cookie.remove("userRole");
  cookie.remove("userId");
}

export const getUserId = (): string | undefined => {
  return cookie.get("userId");
}

export const getUsername = (): string | undefined => {
  return cookie.get("username");
}
