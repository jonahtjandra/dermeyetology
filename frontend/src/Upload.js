import axios from 'axios';
import React,{useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {GoogleLogout} from 'react-google-login';
import store from './redux/store.js'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

function Upload() {
    const [profile, setProfile] = useState(
        {
            name : " "
        }
    );
    //Response after logged out
    const responseGoogleLogOut = (response) => {
        store.dispatch({ type: 'logIn/logout', payload: {id:0, secret:0} })
        setProfile({name: " "})
    }
    const [state, setState] = useState({
        selectedFile : null
    })
    const onFileChange = (event) => {
    // Update the state
        setState({ selectedFile: event.target.files[0] });
    };

    console.log(store.getState().secret)

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

        formData.append(
            "myImage",
            state.selectedFile,
            state.selectedFile.name
        );

        console.log(state.selectedFile);

        var header = {
            id: store.getState().id
        }
        
        // Request made to the backend api
        // Send formData object
        axios.post("http://127.0.0.1:5000/upload-image", formData, {
            headers: header
          }).then((response) => {
            setMsg("Upload succeeded");
            setFileName(": " + state.selectedFile.name);
        }, (error) => {
            console.log(error);
        });
    }; 
    if (store.getState().value === false) {
        console.log("logout");
        return <Redirect to="/"/>
    }
    return(
        <div>
            <GoogleLogout
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Logout of Google"
                onLogoutSuccess={responseGoogleLogOut}
                onFailure={responseGoogleLogOut}
            />
            {/* <p>{profile.name}</p> */}
            <h1>Upload your image:</h1>
            <input accept="image/*" id="contained-button-file" multiple type="file" onChange = {onFileChange}/>
            <Button onClick = {onFileUpload} variant="contained" >Upload!</Button>
            <p>{msg} {fileName}</p>
            <Link to="/dashboard" style = {{textDecoration : "none"}}><Button variant="contained">Dashboard</Button></Link>
        </div>
    )
}

export default Upload;