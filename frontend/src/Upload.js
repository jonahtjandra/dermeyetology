import axios from 'axios';
import React,{useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';

function Upload() {

    //Response after logged in
    const responseGoogleLogIn = (response) => {
        console.log(response.profileObj);
        setProfile(response.profileObj);
    }

    //Response after logged out
    const responseGoogleLogOut = (response) => {
        console.log(response);
        setProfile(
            {
                name : null
            }
        )
    }

    const [profile, setProfile] = useState(
        {
            name : " "
        }
    );

    const [state, setState] = useState({
        selectedFile : null
    })
    const onFileChange = (event) => {
    // Update the state
        setState({ selectedFile: event.target.files[0] });
    };

    const [msg, setMsg] = useState("");

    const [fileName, setFileName] = useState("");

    // On file upload (click the upload button)
    const onFileUpload = () => {
        if (state.selectedFile === null) {
            alert("Please upload an image");
            return;
        }
        // Create an object of formData
        const formData = new FormData();
        
        // Update the formData object
        formData.append(
            "myImage",
            state.selectedFile,
            state.selectedFile.name
        );
        
        // Details of the uploaded file
        console.log(state.selectedFile);
        
        // Request made to the backend api
        // Send formData object
        axios.post("http://127.0.0.1:5000/upload-image", formData).then((response) => {
            setMsg("Upload succeeded");
            setFileName(": " + state.selectedFile.name);
        }, (error) => {
            console.log(error);
        });
    }; 
    return(
        <div>
            <GoogleLogin
                clientId="241925853564-8cdksrgjfum3hila55sb29jm6dnhn121.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogleLogIn}
                onFailure={responseGoogleLogIn}
                cookiePolicy={'single_host_origin'}
            />
            <GoogleLogout
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Logout of Google"
                onLogoutSuccess={responseGoogleLogOut}
                onFailure={responseGoogleLogOut}
            />
            <p>{profile.name}</p>
            <h1>Upload your image:</h1>
            <input type = "file" onChange = {onFileChange} />
            <button onClick = {onFileUpload}>Upload!</button>
            <p>{msg} {fileName}</p>
        </div>
    )
}

export default Upload;