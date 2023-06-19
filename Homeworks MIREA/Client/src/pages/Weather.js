import React, {useEffect} from 'react';
import {useState} from 'react';
import {Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

const key = '36acb600fe361ef276c02cdf7c38fa0a'

export default function Weather() {
    const [searchTerm, setSearchTerm] = useState('')
    const [weathers, setWeathers] = useState([])

    useEffect(() => {
        let weathersData = JSON.parse(localStorage.getItem('weathers'))
        if (weathersData && weathersData.length > 0) {
            setWeathers(weathersData)
        }
        let searchTermData = localStorage.getItem('searchTerm')
        if (searchTermData) {
            setSearchTerm(searchTermData)
        }
    }, [])

    useEffect(() => {
        if (weathers.length > 0) {
            localStorage.setItem('weathers', JSON.stringify(weathers))
        }
    }, [weathers])

    useEffect(() => {
        if (searchTerm !== '') {
            localStorage.setItem('searchTerm', searchTerm)
        }
    })

    const searchPressed = () => {
        setWeathers([])
        searchTerm.split(',').forEach(function (i) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${i.trim()}&lang=ru&units=metric&APPID=${key}`)
                .then((response) => response.json())
                .then((result) => {
                    setWeathers((weather) =>
                        [...weather.filter((el) => el.name !== result.name), result]
                    )
                })
        })
    }

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                id='search'
                autoComplete='off'
                label='Перечислите города...'
                value={searchTerm}
                onChange={(event) => {setSearchTerm(event.target.value)}}
                onKeyDown={(event) => {if (event.key === 'Enter') {searchPressed()}}}
                sx={{
                    minWidth: '50vw',
                    margin: 2,
                    flexGrow: 1
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <SearchIcon/>
                        </InputAdornment>
                    )
                }}
            />
            <Grid container spacing={2} padding={3} justifyContent='center'>
                {weathers.map((weather) => (
                    typeof weather.main !== 'undefined' ? (
                        <Grid item xs='auto' key={weather.name}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant='h5'
                                        component='div'
                                        display='flex'
                                        alignItems='center'
                                        flexWarp='warp'
                                    >
                                        {weather.name}
                                        <img
                                            width={50}
                                            height={50}
                                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                        />
                                        {Math.round(weather.main.temp)}°C
                                    </Typography>
                                    <Typography color='text.secondary' variant="body1">
                                        {Math.round(weather.main.temp) !== Math.round(weather.main.feels_like)
                                            ? `ощущается как ${Math.round(weather.main.feels_like)}°C`
                                            : 'Ощущается так же'}
                                        <br />
                                        {weather.weather[0].description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : null
                ))}
            </Grid>
        </Box>
    )
}