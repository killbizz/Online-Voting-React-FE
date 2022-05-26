import { startLoadingBar, stopLoadingBar } from '../lib/loading';
import { User } from '../classes/User';
import getBackendResponse from '../lib/endpoints';
import { signIn as authSignIn, signOut, getSession } from 'next-auth/react';
import { useEffect } from "react";
import { Session } from 'next-auth';

export const signIn = async (email: string, password: string): Promise<boolean> => {

  const credentials = {
    email: email,
    password: password,
    redirect: false
  };

  startLoadingBar();

  const response: any = await authSignIn('credentials', credentials);
  if (response?.error !== null) {
    stopLoadingBar();
    return false;
  }

  stopLoadingBar();

  return true;
}

export const signUp = async (user: User) : Promise<boolean> => {

  startLoadingBar();

  const { response } = await getBackendResponse("user", "POST", JSON.stringify(user), undefined);

  if (response.statusCode !== 201) {
    stopLoadingBar();
    return false;
  }

  stopLoadingBar();

  return true;
}

export const logout = (): void => {
  
  startLoadingBar();
  
  signOut({redirect: false});

  stopLoadingBar();
}

export const isUserLoggedIn = (session: Session | null, shouldRedirect: boolean = true) => {
  let isAuthenticated: boolean = false;

  // useEffect(() => {
  //     if (session?.error === "RefreshAccessTokenError") {
  //         signOut({ callbackUrl: '/login', redirect: shouldRedirect });
  //     }

  //     if (session === null) {
  //         // if (router.route !== '/login') {
  //         //     router.replace('/login');
  //         // }
  //         isAuthenticated = false;
  //     } else if (session !== undefined) {
  //         // if (router.route === '/login') {
  //         //     router.replace('/');
  //         // }
  //         isAuthenticated = true
  //     }
  // }, [session]);

  if (session?.error !== undefined) {
      signOut({ callbackUrl: '/login', redirect: shouldRedirect });
  }

  if (session === null) {
      // if (router.route !== '/login') {
      //     router.replace('/login');
      // }
      isAuthenticated = false;
  } else if (session !== undefined) {
      // if (router.route === '/login') {
      //     router.replace('/');
      // }
      isAuthenticated = true
  }

  return isAuthenticated;
}

export const isUserAdmin = (session: Session | null) : boolean | undefined => {
  return isUserLoggedIn(session) && session?.roles.includes("ROLE_ADMIN");
}

export const getUsername = (session: Session | null) : string | null | undefined => {
  return  session?.user?.name;
}