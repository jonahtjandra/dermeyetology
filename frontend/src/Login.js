import {GoogleLogin} from 'react-google-login';
import { Redirect } from "react-router-dom";
import React,{useState} from 'react';
import store from './redux/store.js'
  
function Login() {
    //Response after logged in
    const responseGoogleLogIn = (response) => {
        console.log(typeof(response))
        store.dispatch({ type: 'logIn/login', payload: {id:response.profileObj.googleId, secret:response.tokenId} })
        setProfile(response.profileObj);
    }
    const [profile, setProfile] = useState(
        {
            name : " "
        }
    );

    if (store.getState().value) {
        return <Redirect to='/upload' />
    }
    return(
        <div>
            <h1>Dermeyetology</h1>
            <GoogleLogin
                clientId="241925853564-8cdksrgjfum3hila55sb29jm6dnhn121.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogleLogIn}
                onFailure={responseGoogleLogIn}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}
export default Login