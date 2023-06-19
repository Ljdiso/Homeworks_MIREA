import React from 'react';
import Box from '@mui/material/Box';
import { colors } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useCookies } from 'react-cookie';

export default function ThemeSelector() {
    const [cookies, setCookie] = useCookies(['mode', 'primary']);

    const setCookieAndRefresh = (name, value) => {
        setCookie(name, value)
        window.location.reload()
    }

    const changeMode = () => {
        if (cookies.mode === 'dark') {
            setCookieAndRefresh('mode', 'light')
        } else {
            setCookieAndRefresh('mode', 'dark')
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: 1
            }}
        >
            <RadioGroup
                row
                sx={{paddingY: 2, alignItems: 'center', justifySelf: 'center'}}
                defaultValue={cookies.primary['500']}

            >
                {cookies.mode !== 'dark'
                    ? <Brightness7Icon sx={{ margin: 1 }} onClick={() => changeMode()}/>
                    : <Brightness4Icon sx={{ margin: 1 }} onClick={() => changeMode()}/>
                }
                <Radio
                    value={colors.pink["500"]}
                    sx={{ color: colors.pink["600"], '&.Mui-checked': {color: colors.pink["800"]} }}
                    onClick={() => {setCookieAndRefresh('primary', colors.pink)}}
                />
                <Radio
                    value={colors.blue["500"]}
                    sx={{ color: colors.blue["600"], '&.Mui-checked': {color: colors.blue["800"]} }}
                    onClick={() => {setCookieAndRefresh('primary', colors.blue)}}
                />
                <Radio
                    value={colors.orange["500"]}
                    sx={{ color: colors.orange["600"], '&.Mui-checked': {color: colors.orange["800"]} }}
                    onClick={() => {setCookieAndRefresh('primary', colors.orange)}}
                />
                {/*<Radio*/}
                {/*    value={colors.green["500"]}*/}
                {/*    sx={{ color: colors.green["600"], '&.Mui-checked': {color: colors.green["800"]} }}*/}
                {/*    onClick={() => {setCookieAndRefresh('primary', colors.green)}}*/}
                {/*/>*/}
            </RadioGroup>
        </Box>
    )
}