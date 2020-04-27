import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {ADD_ERRORS, SET_INFO} from "../state/actions";
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import {Button, TextField} from '@material-ui/core'
import {useManualQuery, useMutation} from 'graphql-hooks'
import {GET_USER_QUERY, UPDATE_USER_MUTATION} from "../assets/queries";
import {useGlobalState} from "../state/state";
import {SUCCESS} from "../assets/severities";
import {Formik} from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& > *': {
            marginTop: 20
        },
        backgroundColor: theme.palette.secondary.dark,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    disabled: {
        backgroundColor: theme.palette.error.main
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AccountSettings({open, closeHandler}) {
    const [updateUser, {loading}] = useMutation(UPDATE_USER_MUTATION);
    const [getUser, {loading2}] = useManualQuery(GET_USER_QUERY);
    const [user, setUser] = useState(null);
    const [{}, dispatch] = useGlobalState();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        if (open === true) {
            getUser().then((res) => {
                if (!res.error && res.data && res.data.user) {
                    setUser(res.data.user)
                } else {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    })
                }
            })
        }
    }, [open]);

    const updateHandler = (values, {setSubmitting}) => {
        updateUser({
            variables: {
                ...values
            }
        }).then((res) => {
            if (!res.error && res.data.user && res.data.user.user) {
                dispatch({
                    type: SET_INFO,
                    info: {type: SUCCESS, message: "Updated profile"}
                });
                setUser(res.data.user.user)
            } else {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                })
            }
            setSubmitting(false);
        });
    };
    return (
        <Dialog fullScreen={true} open={open} TransitionComponent={Transition} onClose={closeHandler}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Tooltip title={"Close"}>
                        <IconButton onClick={closeHandler}>
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography variant={'h6'}>{"Account settings"}</Typography>
                </Toolbar>
            </AppBar>
            {
                user ? <Formik initialValues={{
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    phone_number: user.phoneNumber,
                    new_password: null,
                    password: null
                }} onSubmit={updateHandler}>
                    {
                        ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue}) => (
                            <form onSubmit={handleSubmit} className={classes.form}>
                                <TextField type={'text'} required={true}
                                           style={{width: 'auto'}} name={"first_name"}
                                           onInput={handleChange}
                                           value={values.first_name} fullWidth={false}
                                           defaultValue={user.firstName}
                                           label={'First name'}/>
                                <TextField type={'text'} required={false}
                                           label={'Last name'}
                                           style={{width: 'auto'}} name={"last_name"}
                                           onInput={handleChange}
                                           value={values.last_name} fullWidth={false}
                                           defaultValue={user.lastName}/>
                                <TextField type={'email'} required={true}
                                           label={'Email'}
                                           style={{width: 'auto'}} name={"email"}
                                           onInput={handleChange}
                                           value={values.email} fullWidth={false}
                                           defaultValue={user.email}/>
                                <TextField type={'text'} required={false}
                                           label={'Phone Number'}
                                           style={{width: 'auto'}} name={"phone_number"}
                                           onInput={handleChange}
                                           value={values.phone_number} fullWidth={false}
                                           defaultValue={user.phoneNumber}/>
                                <TextField type={'password'} required={false}
                                           label={'New password'}
                                           style={{width: 'auto'}} name={"new_password"}
                                           onInput={handleChange}
                                           value={values.new_password} fullWidth={false}/>
                                <TextField type={'password'} required={true}
                                           label={'Current password'}
                                           style={{width: 'auto'}} name={"password"}
                                           onInput={handleChange}
                                           value={values.password} fullWidth={false}/>
                                <Button variant={'contained'} color={'primary'} type={'submit'}
                                        disabled={isSubmitting}>Update</Button>
                                <Button variant={'contained'} className={classes.disable}
                                        disabled={isSubmitting} onClick={() => setOpenConfirmDialog(true)}>Disable
                                    account</Button>
                                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                                    <DialogTitle>{"Disable account permanently?"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            This will permanently disable your account. Are you sure?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color={"primary"} type={"submit"}
                                                onClick={() => setOpenConfirmDialog(false)}>
                                            Yes, disable it
                                        </Button>
                                        <Button color={"secondary"} autofocus
                                                onClick={() => setOpenConfirmDialog(false)}>
                                            No
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </form>
                        )
                    }
                </Formik> : null
            }

        </Dialog>
    );
}

export default AccountSettings;
