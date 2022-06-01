import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface RefreshTokenHandlerProps {
    setInterval: Dispatch<SetStateAction<number>>
}

const RefreshTokenHandler = (props : RefreshTokenHandlerProps) => {
    const { data: session } = useSession();

    useEffect(() => {
        if(!!session) {
            // We did set the token to be ready to refresh after 23 hours, here we set interval of 23 hours 30 minutes.
            // const timeRemaining = Math.round((((session.accessTokenExpiry - 30 * 60 * 1000) - Date.now()) / 1000));
            // TODO : settare timeRemaining per refresh del refreshToken ??
            const timeRemaining = 
            props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
        }
    }, [session]);

    return null;
}

export default RefreshTokenHandler;