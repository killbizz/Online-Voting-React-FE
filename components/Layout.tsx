import "bootstrap/dist/css/bootstrap.min.css";

import React, { ReactNode } from 'react'
import Head from 'next/head'
import NavigationBar from './navbar/NavigationBar'
import Footer from './footer/Footer'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'e-Voting Web Application' }: Props) => (
  <div className="wrap">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" type="image/x-icon" href='/public/favicon.ico' />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
    </Head>
    <header>
      <NavigationBar />
    </header>
    {children}
    <Footer />
  </div>
)

export default Layout
