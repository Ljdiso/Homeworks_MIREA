import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import {observer} from "mobx-react-lite";
import {useCallback, useContext, useState} from "react";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../http";
import Input from '@mui/material/Input';
import {useDropzone} from 'react-dropzone';
// import image from '../static/images/profile.jpg';

function Profile() {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const [image, setImage] = useState({
        imageSrc: store.user.avatar_uri
            ? `${API_URL}/${store.user.avatar_uri}`
            : `${API_URL}/static/avatars/default.png`,
        imageHash: Date.now()
    })
    const onDrop = useCallback(acceptedFiles => {
        let formData = new FormData()
        formData.append('image', acceptedFiles[0])
        store.updateAvatarCurrentUser(acceptedFiles[0]).then(() => {
            setImage(image => ({
                ...image,
                imageHash: Date.now()
            }))
        })
    }, [])
    const {getRootProps, getInputProps, open} = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        accept : {
            'image/png' : [ '.png' ]
        }
    });

    if (!store.isAuth) {
        return (
            navigate('/signin')
        )
    }

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`${image.imageSrc}?${image.imageHash}`}
                        onClick={open}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {store.user.first_name} {store.user.last_name} <br/>
                            {store.user.middle_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {store.user.email}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            onClick={() => store.logout()}
                            // onClick={() => console.log(acceptedFiles)}
                        >
                            Выйти
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Container>
    );
}

export default observer(Profile)