import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
import {useMutation} from 'graphql-hooks'
import {REGISTER_MUTATION} from "../assets/queries";
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'
import {ADD_ERRORS} from "../state/actions";
import {useGlobalState} from "../state/state";

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

function Register(props) {
    const classes = useStyles();
    const [form, setForm] = useState({});
    const [{redirect, url}, setRedirect] = useState({redirect: false, url: null});
    const [register, {loading, error, data}] = useMutation(REGISTER_MUTATION, {
        variables: {
            ...form
        }
    });
    const [{}, dispatch] = useGlobalState();

    const handleSubmit = (event) => {
        event.preventDefault();
        register().then((res) => {
            if (res.error) {
                if (res.error) {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    });
                    return;
                }
                return;
            }
            const cookies = new Cookie();
            cookies.set('token', res.data.register.token);
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
            <Grid container alignItems={'center'} justify={'center'} spacing={2} className={classes.container}>

                <Grid container spacing={5} direction={'column'} alignItems={'center'} justify={'center'}>
                    <Grid item xs={12} className={classes.item}>
                        <Typography variant={'h4'}>Register</Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'email'} required={true} placeholder={'Email'} className={classes.textfield}
                                   name={"email"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'password'} required={true} placeholder={'Password'}
                                   className={classes.textfield} name={"password"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'password'} required={true} placeholder={'Confirm Password'}
                                   className={classes.textfield} name={"password_confirmation"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'text'} required={true} placeholder={'First name'}
                                   className={classes.textfield} name={"first_name"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'text'} required={true} placeholder={'Last name'}
                                   className={classes.textfield} name={"last_name"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextField type={'text'} required={true} placeholder={'Phone number'}
                                   className={classes.textfield} name={"phone_number"} onInput={handleChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"contained"} color={"primary"} className={classes.button} type={'submit'}
                                disabled={loading}>
                            Register
                        </Button>
                    </Grid>
                    <Grid container item direction={"row"} xs={12}>
                        <Grid item xs={12}>
                            <Button variant={"contained"} color={"primary"} className={classes.button} href={"/login"}>
                                Already registered? Login
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </form>
    );
}

export default Register;
