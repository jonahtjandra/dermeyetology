import axios from 'axios';
import {React, useState} from 'react';

function Dashboard() {
    const [images, setImages] = useState([]);

    const refreshGallery = () => {
        axios.get("http://127.0.0.1:5000/fetch-image").then((response) => {
            const arrImg = [];
            for (var i = 0; i < response.data.images.length; ++i) {
                arrImg[i] = 'data:image/jpeg;base64,' + response.data.images[i];
            }
            setImages(arrImg);
            console.log(arrImg[0])
        });
    }
    return (
        <div>
            <button onClick = {refreshGallery}>Refresh Galley</button>
            <h1>Dashboard:</h1>
            {images.map(e => {
                return (
                    <img src={e}></img>
                )
            })}
        </div>
    )
}

export default Dashboard;