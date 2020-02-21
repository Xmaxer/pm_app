import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CompaniesIcon from '@material-ui/icons/Business';
import APIIcon from '@material-ui/icons/SettingsInputHdmi';
import SettingsIcon from '@material-ui/icons/Tune';
import LogoutIcon from '@material-ui/icons/ExitToApp';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.tertiary.main
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    titleContainer: {
        width: '100%',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: 10,
        marginTop: 'auto'
    },
    icon: {
        color: theme.palette.tertiary.main
    }
}));

const options = [
    {
        link: '/dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon/>
    },
    {
        link: '/companies',
        title: 'My Companies',
        icon: <CompaniesIcon/>
    },
    {
        link: '/api-settings',
        title: 'API Settings',
        icon: <APIIcon/>
    },
    {
        link: '/user-settings',
        title: 'Account Settings',
        icon: <SettingsIcon/>
    },
    {
        link: '/logout',
        title: 'Logout',
        icon: <LogoutIcon/>
    },
];

function SideBar({title, location}) {
    const classes = useStyles();
    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.titleContainer}>
                    <Typography variant={"h4"}>{title}</Typography>
                </div>
                <div>
                    <List>
                        {options.map((option, index) => (
                            <>
                                <ListItem button key={option.title} href={option.link} component={'a'}
                                          disabled={location === option.link}>
                                    <ListItemIcon className={classes.icon}>{option.icon}</ListItemIcon>
                                    <ListItemText primary={option.title}/>
                                </ListItem>
                                <Divider/>
                            </>
                        ))}
                    </List>
                </div>
                <div className={classes.footer}>
                    <Typography>About</Typography>
                    <Divider orientation={'vertical'}/>
                    <Typography>Contact</Typography>
                </div>
            </Drawer>
        </div>
    );
}

export default SideBar;
