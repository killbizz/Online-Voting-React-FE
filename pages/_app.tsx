import "../styles/style.css";
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

//Binding events
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());  


import { AppProps } from "next/app";

export default function OnlineVotingReactFE({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}
