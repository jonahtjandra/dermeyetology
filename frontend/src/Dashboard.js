import axios from 'axios';
import {React, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import store from './redux/store.js'
import {ImageList, ImageListItem} from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Dashboard() {
    const [images, setImages] = useState([{}]);
    console.log(images.length)
    if (images.length === 1) {
        axios.get("http://127.0.0.1:5000/fetch-image", { 'headers': { 'id': store.getState().id }}).then((response) => {
            const arrImg = [];
            console.log(response.data)
            for (var i = 0; i < response.data['images'].length; ++i) {
                arrImg[i] = {'img': 'data:image/jpeg;base64,' + response.data['images'][i], 'pred': response.data['prediction'][i]}
            }
            if (arrImg != images) {
                setImages(arrImg);
                console.log(arrImg[0])
            }
        });
    }
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
    const linkStyle = {
        textDecoration: "none",
        color: "white"
    }
    return (
        <div>
            {/* <Button onClick = {refreshGallery} variant="contained">Refresh Galley</Button> */}
            <Link to='/upload' style={linkStyle}><Button variant="contained">Upload more images</Button></Link>
            <h1>Dashboard:</h1>
            <ImageList sx={{ width: 1350, height: 1000 }} cols={5} rowHeight={540}>
            {images.map((item) => (
                <ImageListItem>
                    <Card sx={{ maxWidth: 650 }}>
                        <CardMedia
                            component="img"
                            height="340"
                            image={item['img']}
                            alt="Image not found"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {item['pred']}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Delete</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                 </ImageListItem>
            ))}
            </ImageList>
        </div>
    )
}

export default Dashboard;