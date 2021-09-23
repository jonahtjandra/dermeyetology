import axios from 'axios';
import {React, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import store from './redux/store.js'
import {ImageList, ImageListItem} from '@mui/material'

function Dashboard() {
    const [images, setImages] = useState([]);

    const refreshGallery = () => {
        axios.get("http://127.0.0.1:5000/fetch-image", { 'headers': { 'id': store.getState().id }}).then((response) => {
            const arrImg = [];
            for (var i = 0; i < response.data.images.length; ++i) {
                arrImg[i] = 'data:image/jpeg;base64,' + response.data.images[i];
            }
            if (arrImg != images) {
                setImages(arrImg);
                console.log(arrImg[0])
            }
        });
    }
    if (store.getState().value === false) {
        console.log("logout");
        return <Redirect to="/"/>
    }
    return (
        <div>
            <button onClick = {refreshGallery}>Refresh Galley</button>
            <Link to='/upload'>Upload more images</Link>
            <h1>Dashboard:</h1>
            <ImageList sx={{ width: 1350, height: 1000 }} cols={5} rowHeight={100}>
            {images.map((item) => (
                <ImageListItem>
                <img
                    src={item}
                    alt="Image not found"
                    loading="lazy"
                />
                </ImageListItem>
            ))}
            </ImageList>
        </div>
    )
}

export default Dashboard;