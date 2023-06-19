import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useContext, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {passwordValidation, emailValidation} from "../utils/validators";

function SignIn() {
    const {store} = useContext(Context)
    const [email, setEmail] = useState({value: '', error: '', edited: false})
    const [password, setPassword] = useState({value: '', error: '', edited: false})
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
    }

    const validation = () => {
        return !(emailValidation(email.value) === ''
            && passwordValidation(password.value) === '')
    }

    if (store.isAuth) {
        return (
            navigate('/profile')
        )
    }

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Вход
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        onChange={e => {setEmail(email => ({
                            ...email,
                            value: e.target.value,
                            edited: true
                        }))}}
                        value={email.value}
                        error={email.error.length > 0 && email.edited}
                        helperText={email.edited ? email.error : ''}
                        onBlur={() => email.edited ? setEmail(email => ({
                            ...email,
                            error: emailValidation(email.value),
                        })) : null}
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email адресс'
                        name='email'
                        autoComplete='email'
                        autoFocus
                    />
                    <TextField
                        onChange={e => {setPassword(password => ({
                            ...password,
                            value: e.target.value,
                            edited: true
                        }))}}
                        value={password.value}
                        error={password.error.length > 0 && password.edited}
                        helperText={password.edited ? password.error : ''}
                        onBlur={() => password.edited ? setPassword(password => ({
                            ...password,
                            error: passwordValidation(password.value),
                        })) : null}
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Пароль'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <FormControlLabel
                        control={<Checkbox value={remember} onChange={e => setRemember(e.target.checked)} color='primary' />}
                        label='Запомнить меня'
                    />
                    <Typography sx={{ mt: 2}} component='h3' variant='body2' color='error.main'>{error}</Typography>
                    <Button
                        onClick={() => {
                            store.login(email.value, password.value, remember).then(() => null, err => {
                                if (err.response?.data?.detail[0]?.msg === 'Incorrect email or password') {
                                    setError('Неверный email или парль')
                                } else if (err.response?.data?.detail[0]?.msg === 'User with this email does not exist') {
                                    setError('Пользователь с таким email не найден')
                                } else {
                                    setError('Непредвиденная ошибка')
                                    console.log(err)
                                }
                            })
                        }}
                        disabled={validation()}
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Вход
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href='#' variant='body2'>
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='/signup' variant='body2'>
                                {'Нет аккаунта? Зарегистрируйтесь'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default observer(SignIn)