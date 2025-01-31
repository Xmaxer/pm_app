import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, CircularProgress, Grid, TextField, Typography} from '@material-ui/core';
import {useMutation} from 'graphql-hooks'
import {LOGIN_MUTATION} from "../assets/queries";
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'
import {useGlobalState} from "../state/state";
import {ADD_ERRORS} from "../state/actions";

const useStyles = makeStyles(theme => ({
    container: {
        padding: 20,
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 500,
        background: theme.palette.secondary.main,
        borderRadius: 5
    },
    button: {
        width: '100%',
        borderRadius: 0
    },
    textfield: {
        width: '100%'
    },
    item: {
        justifyContent: 'center'
    }
}));

function Login(props) {
    const [{}, dispatch] = useGlobalState();
    const classes = useStyles();
    const [form, setForm] = useState({});
    const [{redirect, url}, setRedirect] = useState({redirect: false, url: null});
    const [login, {loading, error, data}] = useMutation(LOGIN_MUTATION, {
        variables: {
            ...form
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        login().then((res) => {
            if (res.error) {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                });
                return;
            }
            const cookies = new Cookie();
            cookies.set('token', res.data.login.token, {path: '/'});
            const old_loc = props.location.state ? props.location.state.from.pathname : null;

            setRedirect({redirect: true, url: old_loc})
        });
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setForm({
            ...form,
            [name]: value
        })
    };

    return redirect ? (<Redirect to={{pathname: url ? url : '/'}}/>) : (
        <form onSubmit={handleSubmit} className={classes.container}>
            <Grid container={true} alignItems={'center'} justify={'center'} spacing={2} className={classes.container}>
                <Grid container={true} spacing={5} direction={'column'} alignItems={'center'} justify={'center'}>
                    <Grid item xs={12} className={classes.item}>
                        <Typography variant={'h4'}>Login</Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'email'} required={true} label={'Email'} className={classes.textfield}
                                   name={"email"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'password'} required={true} label={'Password'}
                                   className={classes.textfield} name={"password"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"contained"} color={"primary"} className={classes.button} type={'submit'}
                                disabled={loading}>
                            {
                                loading ? <CircularProgress/> : "Login"
                            }
                        </Button>
                    </Grid>
                    <Grid container={true} item={true} direction={"row"} xs={12}>
                        <Grid item xs={6}>
                            <Button variant={"contained"} color={"primary"} className={classes.button}
                                    href={"/register"}>
                                Register
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant={"contained"} color={"primary"} className={classes.button}>
                                Forgot Password
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}

export default Login;
