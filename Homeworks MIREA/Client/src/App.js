 import './App.css';
import Weather from './pages/Weather';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import News from "./pages/News";
import Chat from "./pages/Chat";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate } from 'react-router-dom';
import MainDrawer from './components/MainDrawer';
import React, {useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
import {CookiesProvider, useCookies} from 'react-cookie';
import {Context} from "./index";
import {observer} from 'mobx-react-lite';

function App() {
    const [cookies, setCookie] = useCookies(['mode', 'primary']);
    const {store} = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            store.checkAccess()
        }
    }, [])

    if (!cookies.mode) {setCookie('mode', 'dark')}
    if (!cookies.primary) {setCookie('primary', colors.pink)}
    const theme = createTheme({
        palette: {
            mode: cookies.mode,
            primary: cookies.primary,
            secondary: cookies.primary
        }
    })

    if (store.isLoading) {
        return null
    }

    return (
        <CookiesProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Box sx={{ display: 'flex' }}>
                    <MainDrawer />
                    <Routes>
                        <Route path='/' element={ <Navigate to='/weather' /> } />
                        <Route path='/weather' element={ <Weather/> } />
                        <Route path='/signin' element={ <SignIn /> } />
                        <Route path='/signup' element={ <SignUp /> } />
                        <Route path='/profile' element={ <Profile /> } />
                        <Route path='/news' element={ <News /> } />
                        <Route path='/chat' element={ <Chat /> } />
                    </Routes>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
        </CookiesProvider>
    )
}

export default observer(App);