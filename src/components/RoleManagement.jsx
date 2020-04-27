import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import {Button, Table, TableBody, TableHead, TextField} from '@material-ui/core'
import {useManualQuery, useMutation} from 'graphql-hooks'
import {COMPANY_ROLES_QUERY, CREATE_COMPANY_ROLE_MUTATION, DELETE_COMPANY_ROLE_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import {ADD_ERRORS, SET_INFO} from "../state/actions";
import {useGlobalState} from "../state/state";
import {SUCCESS} from "../assets/severities";
import {SketchPicker} from 'react-color'
import {Formik} from 'formik';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative'
    },
    swatch: {
        width: "30px",
        height: "30px",
        borderRadius: "15px",
        transition: "width 100ms, height 100ms, border-radius 100ms",
        "&:hover": {
            width: "35px",
            height: "35px",
            borderRadius: "17.5px",
            transition: "width 100ms, height 100ms, border-radius 100ms",
            cursor: "pointer"
        },
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    popover: {
        position: 'absolute',
        zIndex: '2',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
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
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function RoleManagement({open, company_id, closeHandler}) {
    const classes = useStyles();
    const [roles, setRoles] = useState([]);
    const [getRoles, {loading}] = useManualQuery(COMPANY_ROLES_QUERY, {
        variables: {
            company_id: company_id
        }
    });

    const [companyName, setCompanyName] = useState(null);
    const [swatchId, setSwatchId] = useState(null);
    const [colour, setColour] = useState("#ffffff");
    const [deleteRole, {loading2}] = useMutation(DELETE_COMPANY_ROLE_MUTATION);
    const [updateRole, {loading3}] = useMutation(CREATE_COMPANY_ROLE_MUTATION);
    const [{}, dispatch] = useGlobalState();

    useEffect(() => {
        if (open === true) {
            getRoles().then((res) => {
                if (res.data && res.data.company) {
                    setRoles(res.data.company.roles);
                    setCompanyName(res.data.company.name)
                }
            })
        }
    }, [open]);

    const addRole = (role) => {
        if (role && role.id) {
            setRoles([role, ...roles])
        }
    };

    const handleDelete = (id) => {
        deleteRole({
            variables: {
                id: id
            }
        }).then((res) => {
            let newRoles = [];
            roles.forEach((role) => {
                if (role.id !== id) {
                    newRoles.push(role)
                }

            });
            if (!res.error && res.data.deleteRole.role.id) {
                setRoles(newRoles)
            }
        })
    };

    const handleColourChange = (colour, id) => {
        console.log(typeof colour);
        setSwatchId(null);
        updateRole({variables: {id: id, colour: colour, company_id: company_id}}).then((res) => {
            if (res.error) {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                });
            } else {
                dispatch({
                    type: SET_INFO,
                    info: {type: SUCCESS, message: "Updated role"}
                });
                let newRoles = [];
                roles.forEach((role) => {
                    if (role.id === id) {
                        newRoles.push({...role, colour: colour})
                    } else newRoles.push(role)
                });
                setRoles(newRoles)
            }
        })
    };

    const handleColourSwitch = (colour, id) => {
        let newRoles = [];
        roles.forEach((role) => {
            if (role.id === id) {
                newRoles.push({...role, colour: colour})
            } else newRoles.push(role)
        });
        setRoles(newRoles)
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
                    <Typography variant={'h6'}>{"Role Management for company " + companyName}</Typography>
                </Toolbar>
            </AppBar>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Colour</StyledTableCell>
                        <StyledTableCell>Number of users</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {
                        roles.map((role) => {
                            return <StyledTableRow>
                                <StyledTableCell>{role.name}</StyledTableCell>
                                <StyledTableCell>
                                    <div style={{backgroundColor: role.colour}} className={classes.swatch}
                                         onClick={() => {
                                             setSwatchId(role.id)
                                         }}/>
                                    {
                                        swatchId === role.id ?
                                            <div className={classes.popover}>
                                                <div className={classes.cover} onClick={() => {
                                                    handleColourChange(role.colour, role.id)
                                                }}/>
                                                <SketchPicker color={role.colour} onChange={(color) => {
                                                    handleColourSwitch(color.hex, role.id)
                                                }} disableAlpha={true}/>
                                            </div> : null
                                    }
                                </StyledTableCell>
                                <StyledTableCell>{role.numberOfUsers}</StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title={"Delete"}>
                                        <StyledIconButton onClick={() => {
                                            handleDelete(role.id)
                                        }}>
                                            <DeleteIcon/>
                                        </StyledIconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        })
                    }
                </TableBody>
            </Table>
            <Formik initialValues={{name: '', colour: '#ffffff'}} onSubmit={(values, {setSubmitting, resetForm}) => {
                updateRole({
                    variables: {
                        ...values,
                        company_id: company_id
                    }
                }).then((res) => {
                    if (res.data.role && res.data.role.role)
                        addRole(res.data.role.role);
                    else {
                        dispatch({
                            type: ADD_ERRORS,
                            errors: res.error
                        })
                    }
                    setSubmitting(false);
                    resetForm();
                    setColour('#ffffff')
                });
            }}>
                {
                    ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue}) => (
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <TextField type={'text'} required={true}
                                       label={'Role Name'}
                                       style={{width: 'auto'}} name={"name"}
                                       onInput={handleChange}
                                       value={values.name} fullWidth={false}/>
                            <div style={{backgroundColor: colour}} className={classes.swatch}
                                 onClick={() => {
                                     setSwatchId('new')
                                 }}/>
                            {
                                swatchId === 'new' ?
                                    <div className={classes.popover}>
                                        <div className={classes.cover} onClick={() => {
                                            setSwatchId(null);
                                            setFieldValue('colour', colour)
                                        }}/>
                                        <SketchPicker color={colour} onChange={(color) => {
                                            setColour(color.hex)
                                        }} disableAlpha={true}/>
                                    </div> : null
                            }
                            <Button variant={'contained'} color={'primary'} type={'submit'}
                                    disabled={isSubmitting}>Create</Button>
                        </form>
                    )
                }
            </Formik>
        </Dialog>
    );
}

export default RoleManagement;
