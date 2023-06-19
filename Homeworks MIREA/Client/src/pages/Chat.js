import { observer } from "mobx-react-lite";
import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from "react";
import { Context } from "../index";
import { Avatar, Button, Divider, ListItemAvatar, Fab, Paper, InputBase, IconButton } from "@mui/material";
import {API_URL} from "../http";


const MESSAGE_TYPES = {
    MESSAGE: 'message',
    // CONNECTION: 'connection',
    // DISCONNECTION: 'disconnection'
}

const MONTHS = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'окрября',
    10: 'ноября',
    11: 'декабря',
}


function Chat() {
    const { store } = useContext(Context)
    const [ws, setWs] = useState()
    const [textValue, setTextValue] = useState('')
    const [history, setHistory] = useState([])

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/chat?token=${store.readAccessToken()}`)
        setWs(ws)

        ws.onmessage = (e) => {
            const message = JSON.parse(e.data)
            setHistory((history) => [
                ...history,
                message
            ])
        }

        setWs(ws)
        return () => ws.close()
    }, [])

    const sendMessage = () => {
        ws.send(textValue)
        ws.onmessage = (e) => {
            const message = JSON.parse(e.data)
            setHistory((history) => [
                ...history,
                message
            ])
        }
        setTextValue('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            sendMessage()
        }
    }

    const MessageComponent = React.memo(({ item }) => {
        try {
            item = JSON.parse(item)
        }
        catch (e) {
            item = item
        }
        if (item.type === MESSAGE_TYPES.MESSAGE) {
            const now = new Date(Date.now())
            const textDate = `${now.getHours()}:${now.getMinutes()}`
            if (item.email === store.user.email) return (
                <Grid item xs={12}>
                    <ListItem>
                        <ListItemText align='right' primary={item.text} secondary={textDate} />
                        <Divider sx={{ marginLeft: 1 }} orientation="vertical" flexItem />
                        <ListItemAvatar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar src={item.avatar_uri ? `${API_URL}/${item.avatar_uri}` : `${API_URL}/static/avatars/default.png`}/>
                        </ListItemAvatar>
                    </ListItem>
                </Grid>
            )
            return (
                <Grid item xs={12}>
                    <ListItem>
                        <ListItemAvatar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar display='flex' src={item.avatar_uri ? `${API_URL}/${item.avatar_uri}` : `${API_URL}/static/avatars/default.png`}/>
                        </ListItemAvatar>
                        <Divider sx={{ marginRight: 1 }} orientation="vertical" flexItem />
                        <ListItemText align='left' primary={item.text} secondary={`${item.email} ${textDate}`} />
                    </ListItem>
                </Grid>
            )
        }
        // if (item.type === MESSAGE_TYPES.CONNECTION) return (
        //     <Grid item xs={12}>
        //         <ListItemText align='center' secondary={`${item.email} подключился к чату`} />
        //     </Grid>
        // )
        // if (item.type === MESSAGE_TYPES.DISCONNECTION) return (
        //     <Grid item xs={12}>
        //         <ListItemText align='center' secondary={`${item.email} отключился от чата`} />
        //     </Grid>
        // )
    })

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <Grid item xs={9} width='40vw' sx={{maxHeight: '70%'}}>
                <List sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                    {history.map((item, index) => (
                        <ListItem key={index}>
                            <Grid container>
                                <MessageComponent item={item} />
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Введите сообщение"
                        value={textValue}
                        onChange={(e) => { setTextValue(e.target.value) }}
                        onKeyDown={handleKeyDown}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                        <SendIcon />
                    </IconButton>
                </Paper>
            </Grid>
        </Box>
    )    
}

export default observer(Chat)