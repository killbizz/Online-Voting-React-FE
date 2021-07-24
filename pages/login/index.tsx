import Link from 'next/link'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { signIn } from '../../services/auth';
import { useState } from 'react';
import Router from 'next/router'

const login = () => {
    const [errors, setErrors] = useState(new Map<string,string>());

    // passing a clone o errors map to setErrors in order to trigger the state update
    const updateErrors = (key: string, value: string) => {
        setErrors(new Map<string,string>(errors.set(key,value)));
    }

    const signInHandling = async (event: any) => {
        event.preventDefault();

        const email: string = event.target.email.value;
        const password: string = event.target.password.value;

        const valid: boolean = formValidation(email, password);

        if(valid){
            const result: boolean = await signIn(email, password);
            Router.push("/");
        }
    }

    const formValidation = (email: string, password: string): boolean => {
        let isValid: boolean = true;
        const emailRegexp = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        if (email === "") {
        updateErrors("emailError", "The email field is required");
        isValid = false;
        }
        else if (!emailRegexp.test(email)) {
            updateErrors("emailError", "This field must contain a valid email");
            isValid = false;
        }
        else {
            updateErrors("emailError", "");
        }
        if (password === "") {
        updateErrors("passwordError", "The password field is required");
        isValid = false;
        }
        else if (password.length < 6) {
        updateErrors("passwordError", "The password must be at least 6 characters");
        isValid = false;
        }
        else {
            updateErrors("passwordError", "");
        }
        return isValid;
    }

    return (
        <Layout title="Login page">
            <div className="container">
                <div className="login">
                        <h1 className="my-4">Login</h1>
                        <Image className="loginSignUpImages" src="/images/login.png" alt="Login Image" width="180" height="180" />  
                        <form method="POST" name="loginForm" className="my-3" onSubmit={signInHandling}>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="email" name="email" placeholder="name@example.com" />
                            <label htmlFor="email">Email address</label>
                            {errors.has("emailError") && errors.get("emailError") !== "" &&
                                <small className="text-danger">
                                    {errors.get("emailError")}
                                </small>
                            }
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                            <label htmlFor="password">Password</label>
                            {errors.has("passwordError") && errors.get("passwordError") !== "" &&
                                <small className="text-danger">
                                    {errors.get("passwordError")}
                                </small>
                            }
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                        </form>
                        <Link href="/sign-up">
                            <a className="mt-3">Sign Up</a>
                        </Link>
                </div>
            </div>
        </Layout>
    );
};

export default login