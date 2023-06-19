import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import {emailValidation, nameValidation, passwordValidation} from "../utils/validators";

function SignUp() {
    const {store} = useContext(Context)
    const [email, setEmail] = useState({value: '', error: '', edited: false})
    const [password, setPassword] = useState({value: '', error: '', edited: false})
    const [firstName, setFirstName] = useState({value: '', error: '', edited: false})
    const [lastName, setLastName] = useState({value: '', error: '', edited: false})
    const [middleName, setMiddleName] = useState({value: '', error: '', edited: false})
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        })
    }

    const validation = () => {
        return !(emailValidation(email.value) === ''
            && passwordValidation(password.value) === ''
            && nameValidation(firstName.value) === ''
            && nameValidation(middleName.value) === ''
            && nameValidation(lastName.value) === '')
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
                    Регистрация
                </Typography>
                <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={e => {setFirstName(firstName => ({
                                    ...firstName,
                                    value: e.target.value,
                                    edited: true
                                }))}}
                                value={firstName.value}
                                error={firstName.error.length > 0 && firstName.edited}
                                helperText={firstName.edited ? firstName.error : ''}
                                onBlur={() => firstName.edited ? setFirstName(firstName => ({
                                    ...firstName,
                                    error: nameValidation(firstName.value),
                                })) : null}
                                autoComplete='given-name'
                                name='firstName'
                                required
                                fullWidth
                                id='firstName'
                                label='Имя'
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={e => {setLastName(lastName => ({
                                    ...lastName,
                                    value: e.target.value,
                                    edited: true
                                }))}}
                                value={lastName.value}
                                error={lastName.error.length > 0 && lastName.edited}
                                helperText={lastName.edited ? lastName.error : ''}
                                onBlur={() => lastName.edited ? setLastName(lastName => ({
                                    ...lastName,
                                    error: nameValidation(lastName.value),
                                })) : null}
                                required
                                fullWidth
                                id='lastName'
                                label='Фамилия'
                                name='lastName'
                                autoComplete='family-name'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onChange={e => {setMiddleName(middleName => ({
                                    ...middleName,
                                    value: e.target.value,
                                    edited: true
                                }))}}
                                value={middleName.value}
                                error={middleName.error.length > 0 && middleName.edited}
                                helperText={middleName.edited ? middleName.error : ''}
                                onBlur={() => middleName.edited ? setMiddleName(middleName => ({
                                    ...middleName,
                                    error: nameValidation(middleName.value),
                                })) : null}
                                required
                                fullWidth
                                id='middleName'
                                label='Отчество'
                                name='middleName'
                                autoComplete='additional-name'
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                required
                                fullWidth
                                id='email'
                                label='Email ардесс'
                                name='email'
                                autoComplete='email'
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                required
                                fullWidth
                                name='password'
                                label='Пароль'
                                type='password'
                                id='password'
                                autoComplete='new-password'
                            />
                        </Grid>
                    </Grid>
                    <Typography sx={{ mt: 2}} component='h3' variant='body2' color='error.main'>{error}</Typography>
                    <Button
                        onClick={() => {
                            store.createUser(
                                email.value,
                                password.value,
                                firstName.value,
                                lastName.value,
                                middleName.value).then(() => null, err => {
                                if (err.response?.data?.detail[0]?.msg === 'User with this email already exists') {
                                    setError('Пользователь с тами email уже существует')
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
                        Зарегистрироваться
                    </Button>
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Link href='/signin' variant='body2'>
                                Уже есть аккаунт? Авторизуйтесь
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default observer(SignUp)