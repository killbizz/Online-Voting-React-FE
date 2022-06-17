import Link from 'next/link'
import Layout from '../../components/Layout'
import { isUserLoggedIn, signUp } from '../../services/auth';
import { useState } from 'react';
import Router from 'next/router'
import { Alert } from 'react-bootstrap';
import { User } from '../../classes/User';
import { useSession } from 'next-auth/react';

const SignUp = () => {

    const { data: session } = useSession();

    if(isUserLoggedIn(session)) {
        Router.push("/");
    }
    
    const [errors, setErrors] = useState(new Map<string,string>());

    // passing a clone o errors map to setErrors in order to trigger the state update
    const updateErrors = (key: string, value: string) => {
        setErrors(new Map<string,string>(errors.set(key,value)));
    }

    const signUpHandling = async (event: any) => {
        event.preventDefault();

        const email: string = event.target.email.value;
        const username: string = event.target.username.value;
        const password: string = event.target.password.value;

        const valid: boolean = formValidation(email, username, password);

        if(valid){
            const user: User = new User(email, password, username);
            const result: boolean = await signUp(user);
            if(result) {
                Router.push("/login");
            } else {
                setShowAlert(true);
            }
        }
    }

    const formValidation = (email: string, username: string, password: string): boolean => {
        let isValid: boolean = true;
        const emailRegexp = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        const rejectEmojiRegexp = /[\ud800-\udbff][\udc00-\udfff]|[^\0-\x7f]/;
        if (email === "") {
        updateErrors("emailError", "The email field is required");
        isValid = false;
        }
        else if (!emailRegexp.test(email)) {
            updateErrors("emailError", "This field must contain a valid email");
            isValid = false;
        }
        else if(email.match(rejectEmojiRegexp)) {
            updateErrors("emailError", "This field cannot contain emojis");
            isValid = false;
        }
        else {
            updateErrors("emailError", "");
        }
        if (username === "") {
            updateErrors("usernameError", "The Username field is required");
            isValid = false;
        }
        else if (username.length < 6) {
            updateErrors("usernameError", "The Username must be at least 6 characters");
            isValid = false;
        }
        else if(username.match(rejectEmojiRegexp)) {
            updateErrors("usernameError", "This field cannot contain emojis");
            isValid = false;
        }
        else {
            updateErrors("usernameError", "");
        }
        if (password === "") {
        updateErrors("passwordError", "The password field is required");
        isValid = false;
        }
        else if (password.length < 6) {
        updateErrors("passwordError", "The password must be at least 6 characters");
        isValid = false;
        }
        else if(password.match(rejectEmojiRegexp)) {
            updateErrors("passwordError", "This field cannot contain emojis");
            isValid = false;
        }
        else {
            updateErrors("passwordError", "");
        }
        return isValid;
    }

    const [showAlert, setShowAlert] = useState(false);

    return (
        <Layout title="SignUp page">
            <div className="container">
                <div className="sign-up">
                        <h1 className="my-3">Sign Up</h1>
                        <img className="loginSignUpImages" src="/images/sign_up2.png" alt="Login Image" width="180" height="180" />  
                        <form method="POST" name="loginForm" className="my-3" onSubmit={signUpHandling}>
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
                            <input type="text" className="form-control" id="username" name="username" placeholder="Example" />
                            <label htmlFor="username">Username</label>
                            {errors.has("usernameError") && errors.get("usernameError") !== "" &&
                                <small className="text-danger">
                                    {errors.get("usernameError")}
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
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign Up</button>
                        </form>
                        <Link href="/login">
                            <a className="mt-3">Login</a>
                        </Link>
                        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading className="text-center">
                                This Email is linked to an already existing account!
                            </Alert.Heading>
                        </Alert>
                </div>
            </div>
        </Layout>
    );
};

export default SignUp;