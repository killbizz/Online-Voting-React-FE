import Link from 'next/link'
import Image from 'next/image'
import { AuthService } from '../../services/auth.service';
import { NextRouter, useRouter } from 'next/dist/client/router';

type Props = {
    authService: AuthService
  };

const NavigationBar = ({ authService }: Props) => {
    const router: NextRouter = useRouter();
    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light mid" style={{background: "#c2c2c2"}} aria-label="Synthesizers Showcase Navbar">
                <div className="container-fluid">
                    <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            <Link href="/">
                                <a className="nav-link active" aria-current="page">
                                    <Image id="VotingOnlineWebApplication" src="/images/voting-box.png" alt="Online Voting Web Application Logo" width="60" height="60" />
                                </a>
                            </Link>
                        </div>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarControl" aria-controls="navbarControl" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-md-center" id="navbarControl">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            
                        </li>
                        <li className="nav-item">
                            <Link href="/">
                                <a className="nav-link" >Homepage</a>
                            </Link>
                            
                        </li>
                        {authService.isUserLoggedIn() &&
                        <li className="nav-item">
                            <Link href="user-dashboard">
                                <a className="nav-link">Elections</a>
                            </Link>
                        </li>}
                        {authService.isUserLoggedIn() && authService.isUserAdmin() &&
                        <li className="nav-item">
                            <Link href="admin-dashboard">
                                <a className="nav-link">Admin Dashboard</a>
                            </Link>
                        </li>}
                    </ul>
                    </div>
                    {!authService.isUserLoggedIn() && !(router.pathname === "/login" || router.pathname === "/sign-up") &&
                    <div className="navbar-nav">
                        <div className="nav-item text-nowrap px-3">
                            <Link href="/login">
                            <a className="nav-link">Login</a>
                            </Link>
                        </div>
                    </div>}
                    {authService.isUserLoggedIn() && !(router.pathname === "/login" || router.pathname === "/sign-up") &&
                    <div className="navbar-nav">
                        <div className="nav-item text-nowrap px-3">
                            <Link href="/logout">
                                <a className="nav-link">Logout</a>
                            </Link>
                        </div>
                    </div>}
                </div>
            </nav>
        </>
    );
};

export default NavigationBar