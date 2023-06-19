import {observer} from "mobx-react-lite";
import TgwPost from "../components/TgwPost";
import TgwDiscussion from "../components/TgwDiscussion";
import {Alert, Box, Button, Container, DialogContent, Snackbar, TextField} from "@mui/material";
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {useContext, useEffect, useMemo, useState} from "react";
import {Context} from "../index";
import { useSearchParams } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

function News() {
    const {store} = useContext(Context)
    const [news, setNews] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [openAlert, setOpenAlert] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    
    const [searchParams, setSearchParams] = useSearchParams()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenAlert(false);
    };

    const dialogOpen = (id) => {
        searchParams.set('post', id)
        setSearchParams(searchParams)
        setOpenDialog(true)
    }

    const dialogClose = (event, reason) => {
        setOpenDialog(false)
    };

    const newsList = useMemo(() => {
        return news?.map((post) => {
            return (
                <Grid item xs='auto' key={post.id}>
                    <TgwPost key={post.id} link={`m2_uitiia_channel/${post.id}`}/>
                    <Button
                        onClick={() => {dialogOpen(post.id)}}
                        size='small'
                    >
                        Показать комментарии
                    </Button>
                </Grid>
            )
        })
    }, [news])

    useEffect(() => {
        store.getAllNews().then((result) => {
            setNews(result)
        })
    }, [])

    const sendPost = () => {
        if (title && content) {
            store.createNews(title, content).then(() => {
                store.getAllNews().then((result) => {
                    setNews(result)
                })
            })
        } else {
            setOpenAlert(true);
        }
    }

    return (
        <Container maxWidth='lg'>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {
                    store.isAuth ? (
                        <div>
                            <TextField
                                onChange={e => {setTitle(e.target.value)}}
                                value={title}
                                margin='normal'
                                required
                                fullWidth
                                id='title'
                                label='Заголовок'
                            />
                            <TextField
                                onChange={e => {setContent(e.target.value)}}
                                value={content}
                                margin='normal'
                                required
                                fullWidth
                                multiline
                                rows={2}
                                id='content'
                                label='Текст'
                            />
                            <Button
                                onClick={() => {sendPost()}}
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Опубликовать
                            </Button>
                        </div>
                    ) : (
                        <Link href='/signin' variant='body1' margin={4}>
                            Чтобы оставлять новые посты авторизуйтесь
                        </Link>
                    )
                }
            </Box>
            <Grid container spacing={2} padding={5} justifyContent='center'>
                {newsList}
            </Grid>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity="error" sx={{ width: '100%' }}>Заполните все поля, позязя</Alert>
            </Snackbar>
            <BootstrapDialog
                onClose={dialogClose}
                aria-labelledby="customized-dialog-title"
                open={openDialog}
            >
                <DialogContent dividers>
                <TgwDiscussion link={`m2_uitiia_channel/${searchParams.get('post')}`}/>
                </DialogContent>
            </BootstrapDialog>
        </Container>
    )
}

export default observer(News)