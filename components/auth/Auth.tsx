import { useSession } from "next-auth/react";
import Router from 'next/router'

const Auth = ({ children } : any) => {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession(
        {   
            required: true, 
            onUnauthenticated() {
                // The user is not authenticated, handle it here.
                Router.push("/");
            }
        });
  
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
    
    return children;
};

export default Auth;