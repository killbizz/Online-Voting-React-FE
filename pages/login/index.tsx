import Link from 'next/link'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { AuthService } from '../../services/auth.service';
import { useState } from 'react';

//passing both event and function
const signIn = (updateError: any) => (event:any) => {
    // fetch parameters
    // validation
    // authService
    updateError("emailError","DAGHE");
    event.preventDefault();
}

const login = () => {
    const authService: AuthService = AuthService.getInstance();
    const [showAlert, setShowAlert] = useState(true);
    const [errors, setErrors] = useState(new Map<string,string>());

    // passing a clone o errors map to setErrors in order to trigger the state update
    const updateErrors = (key: string, value: string) => {
        setErrors(new Map<string,string>(errors.set(key,value)));
    }

    return (
        <Layout title="Login page">
            <div className="container">
                <div className="login">
                        <h1 className="my-4">Login</h1>
                        <Image className="loginSignUpImages" src="/images/login.png" alt="Login Image" width="180" height="180" />  
                        <form name="loginForm" className="my-3" onSubmit={signIn(updateErrors)}>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="email" name="email" placeholder="name@example.com" />
                            <label htmlFor="email">Email address</label>
                            {errors.has("emailError") &&
                                <small className="text-danger">
                                    {errors.get("emailError")}
                                </small>
                            }
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                            <label htmlFor="password">Password</label>
                            {/* validation errors */}
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                        </form>
                        <Link href="/sign-up">
                            <a className="mt-3">Sign Up</a>
                        </Link>
                    <div>
                        {/*alert */}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default login