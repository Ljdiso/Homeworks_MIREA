import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Cloud from '@mui/icons-material/Cloud';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ThemeSelector from './ThemeSelector';
import { useLocation } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import {Context} from "../index";

const drawerWidth = 200

export default function MainDrawer() {
    const navigate = useNavigate()
    const location = useLocation()
    const {store} = useContext(Context)

    let data = [
        {
            name: 'Task 1',
            pages: [
                {
                    name: 'Погода',
                    icon: <Cloud />,
                    path: '/weather',
                    index: 0
                }
            ]
        },
        {
            name: 'Task 3',
            pages: []
        },
        {
            name: 'Task 4',
            pages: [
                {
                    name: 'Новости',
                    icon: <Calculate />,
                    path: '/news',
                    index: 5
                }
            ]
        }
    ]

    if (!store.isAuth) {
        data[2]['pages'].push(
            {
                name: 'Вход',
                icon: <LockOutlinedIcon />,
                path: '/signin',
                index: 2
            },
            {
                name: 'Регистрация',
                icon: <PersonAddIcon />,
                path: '/signup',
                index: 3
            }
        )
    } else {
        data[2]['pages'].push(
            {
                name: 'Profile',
                icon: <PersonIcon />,
                path: '/profile',
                index: 4
            }
        )
        data[3]['pages'].push(
            {
                name: 'Chat',
                icon: <Calculate />,
                path: '/chat',
                index: 6
            },
        )
    }

    const findIndex = () => {
        let index = null
        data.forEach(group => {
            group.pages.forEach(item => {
                if (item.path === location.pathname) {
                    index = item.index
                }
            })
        })
        return index
    }

    const [selectedIndex, setSelectedIndex] = React.useState(findIndex())
    const handleListItemClick = (index, path) => {
        setSelectedIndex(index)
        navigate(path)
    }

    return (
        <Drawer
            variant='permanent'
            anchor='left'
            sx = {{
                width: drawerWidth,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    // backgroundImage: `url(${image})`,
                    position: 'absolute',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                }
            }}
        >
            {data.map((group) => (
                <List>
                    <Typography
                        sx={{ mt: 0.5, ml: 2 }}
                        color="text.secondary"
                        display="block"
                        variant="caption"
                    >
                        {group.name}
                    </Typography>
                    {group.pages.map((item) => (
                        <ListItemButton
                            key={item.index}
                            onClick={() => handleListItemClick(item.index, item.path)}
                            selected={selectedIndex === item.index}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>{item.name}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            ))}
            <Box sx={{flex: 1}} />
            <Divider sx={{ marginX: 2 }} />
            <ThemeSelector />
        </Drawer>
    )
}


