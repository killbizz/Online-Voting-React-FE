import "../styles/style.css";
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { AppProps } from "next/app";
import RefreshTokenHandler from "../components/RefreshTokenHandler";

//Binding events
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());  

export default function OnlineVotingReactFE({ Component, pageProps }: AppProps) {

  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <Component {...pageProps} />
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}
