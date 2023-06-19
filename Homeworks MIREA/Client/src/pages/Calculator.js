import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Textfield from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import * as math from 'mathjs';
import {Typography} from '@mui/material';

export default function Calculator(props) {
    const [result, setResult] = useState('')
    const [history, setHistory] = useState([])

    useEffect(() => {
        let historyData = JSON.parse(localStorage.getItem('history'))
        if (historyData && historyData.length > 0) {
            setHistory(historyData)
        }
        let resultData = localStorage.getItem('result')
        if (resultData) {
            setResult(resultData)
        }
    }, [])

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('history', JSON.stringify(history))
        }
    }, [history])

    useEffect(() => {
        if (result !== 'Ошибка') {
            localStorage.setItem('result', result)
        }
    }, [result])

    const equal = () => {
        try {
            let answer = math.evaluate(result)
            setHistory((history) => [...history, {equation: result.replaceAll(' ', ''), answer: answer}])
            localStorage.setItem('history', JSON.stringify(history))
            setResult(answer.toString())
        } catch (e) {
            setResult('Ошибка')
            setTimeout(() => setResult(''), 1000)
        }
    }

    const calculate = () => {
        if (result === result.toString().match(/\-?[0-9.]+/)[0]) {
            if (history) {
                setResult(result + history.at(-1).equation.match(/[/*\-+%][0-9.]+/g).at(-1))
            }
        } else {
            equal()
        }
    }

    const signChange = () => {
        const allArg = [...result.matchAll(/[0-9.]+/g)]
        if (allArg) {
            const lastArgIndex = allArg.at(-1).index
            if (result.slice(lastArgIndex - 2, lastArgIndex) === '(-') {
                setResult(result.substring(0, lastArgIndex - 2) + result.substring(lastArgIndex))
            } else {
                setResult(result.substring(0, lastArgIndex) + '(-' + result.substring(lastArgIndex))
            }
        }
    }

    const data = [
        {label: '(', action: setResult.bind(this,result + '('), variant: 'outlined'},
        {label: ')', action: setResult.bind(this,result + ')'), variant: 'outlined'},
        {label: '%', action: setResult.bind(this,result + '%'), variant: 'outlined'},
        {label: '/', action: setResult.bind(this,result + '/'), variant: 'outlined'},
        {label: '7', action: setResult.bind(this,result + '7'), variant: 'contained'},
        {label: '8', action: setResult.bind(this,result + '8'), variant: 'contained'},
        {label: '9', action: setResult.bind(this,result + '9'), variant: 'contained'},
        {label: '*', action: setResult.bind(this,result + '*'), variant: 'outlined'},
        {label: '4', action: setResult.bind(this,result + '4'), variant: 'contained'},
        {label: '5', action: setResult.bind(this,result + '5'), variant: 'contained'},
        {label: '6', action: setResult.bind(this,result + '6'), variant: 'contained'},
        {label: '-', action: setResult.bind(this,result + '-'), variant: 'outlined'},
        {label: '1', action: setResult.bind(this,result + '1'), variant: 'contained'},
        {label: '2', action: setResult.bind(this,result + '2'), variant: 'contained'},
        {label: '3', action: setResult.bind(this,result + '3'), variant: 'contained'},
        {label: '+', action: setResult.bind(this,result + '+'), variant: 'outlined'},
        {label: '0', action: setResult.bind(this,result + '0'), variant: 'contained'},
        {label: '+/-', action: signChange.bind(this), variant: 'outlined'},
        {label: '.', action: setResult.bind(this,result + '.'), variant: 'outlined'},
        {label: '=', action: calculate.bind(this), variant: 'outlined'},
        {label: 'AC', action: setResult.bind(this,''), variant: 'outlined'},
        {label: 'C', action: setResult.bind(this, result.toString().trim().slice(0, -1)), variant: 'outlined'},
    ]

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
            <Box sx={{ display: 'flex' }}>
                <Box sx={{width: '360px'}}>
                    <Textfield
                        variant='standard'
                        value={result}
                        onChange={(event) => {setResult(event.target.value)}}
                        onKeyDown={(event) => {if (event.key === 'Enter') {equal()}}}
                        sx={{ width: '100%', padding: 2}}
                        inputProps={{ sx: { fontSize: 46, textAlign: 'right' } }}
                    />
                    <Grid
                        container
                        alignItems='center'
                        justifyContent='end'
                        spacing={2}
                        padding={2}
                    >
                        {data.map((item) => (
                            <Grid item xs={3}>
                                <Box sx={{ display:'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button
                                        variant={item.variant}
                                        onClick={item.action}
                                        sx={{width:'70px', height:'70px', borderRadius: '50%', fontSize: 34}}
                                    >
                                        {item.label}
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <List sx={{ marginTop: 5 }}>
                    {history.slice(-7).map((item, index) => (
                        <ListItem key={index}>
                            <box>
                                <Typography variant='h6' color='text.secondary'>
                                    {item.equation}
                                </Typography>
                                <Typography variant='h5' color='primary.main'>
                                    ={item.answer}
                                </Typography>
                            </box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    )
}