import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, IconButton} from '@material-ui/core'
import {useManualQuery, useMutation} from 'graphql-hooks'
import {ADD_ROLE_TO_USER_MUTATION, COMPANY_USERS_QUERY, REMOVE_ROLE_FROM_USER_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import {ADD_ERRORS, SET_INFO} from "../state/actions";
import {Formik} from 'formik';
import AddIcon from '@material-ui/icons/Add';
import {useGlobalState} from "../state/state";
import UserSelect from "./UserSelect";
import RoleSelect from "./RoleSelect";
import {SUCCESS} from "../assets/severities";

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& > *': {
            marginTop: 20
        },
        padding: '20px'
    }
}));

function UsersList({company_id}) {
    const classes = useStyles();
    const [renderForm, setRenderForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [addUserRole, {loading2}] = useMutation(ADD_ROLE_TO_USER_MUTATION);
    const [removeUserRole, {loading3}] = useMutation(REMOVE_ROLE_FROM_USER_MUTATION);
    const [{}, dispatch] = useGlobalState();

    const [getUsers, {loading}] = useManualQuery(COMPANY_USERS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    const addUser = (user) => {
        if (user && user.id) {
            setUsers([user, ...users])
        }
    };

    useEffect(() => {
        getUsers().then((res) => {
            if (!res.error && res.data.company) {
                setUsers(res.data.company.users)
            }

        })
    }, []);

    const handleRemoveAllRoles = () => {

    };

    const handleUpdateRoles = (roles, oldRoles, user_id) => {
        if (roles.length > oldRoles.length) {
            roles = roles.filter(role => !oldRoles.find(oldRole => oldRole.id === role.id));
            addUserRole({
                variables: {
                    company_id: company_id,
                    user_id: user_id,
                    role_ids: roles.map((role) => parseInt(role.id))
                }
            }).then((res) => {
                if (!res.error && res.data.addRole && res.data.addRole.success)
                    dispatch({
                        type: SET_INFO,
                        info: {type: SUCCESS, message: "Updated roles"}
                    });
                else {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    })
                }
            });
        } else {
            roles = oldRoles.filter(role => !roles.find(oldRole => oldRole.id === role.id));
            removeUserRole({
                variables: {
                    company_id: company_id,
                    user_id: user_id,
                    role_ids: roles.map((role) => parseInt(role.id))
                }
            }).then((res) => {
                if (!res.error && res.data.removeRole && res.data.removeRole.success)
                    dispatch({
                        type: SET_INFO,
                        info: {type: SUCCESS, message: "Updated roles"}
                    });
                else {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    })
                }
            });
        }
    };

    let rows = users.map((row) => (
        <StyledTableRow key={row.id}>
            <StyledTableCell>{row.firstName}</StyledTableCell>
            <StyledTableCell>{row.lastName}</StyledTableCell>
            <StyledTableCell><RoleSelect company_id={company_id} defaultValues={row.roles}
                                         updateHandler={(newVal, oldVal) => handleUpdateRoles(newVal, oldVal, row.id)}/></StyledTableCell>
            <StyledTableCell>
                <StyledIconButton onClick={() => {
                    handleRemoveAllRoles(row.id)
                }}>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + company_id + "/user/" + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    ));

    return (
        <div className={classes.container}>
            <GenericList headers={["First Name", "Last Name", "Roles", "Actions"]} rows={rows}
                         loading={loading} title={"Users"}/>
            {
                renderForm ?
                    <Formik initialValues={{user_id: null, role_ids: []}} onSubmit={(values, {setSubmitting}) => {
                        addUserRole({
                            variables: {
                                ...values,
                                company_id: company_id
                            }
                        }).then((res) => {
                            if (!res.error && res.data.addRole)
                                addUser(res.data.addRole.user);
                            else {
                                dispatch({
                                    type: ADD_ERRORS,
                                    errors: res.error
                                })
                            }
                            setSubmitting(false)
                        });
                    }}>
                        {
                            ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue}) => (
                                <form onSubmit={handleSubmit} className={classes.form}>
                                    <UserSelect ignore={users.map((user) => parseInt(user.id))}
                                                setFieldValue={setFieldValue}/>
                                    <RoleSelect company_id={company_id} setFieldValue={setFieldValue}/>
                                    <Button variant={'contained'} color={'primary'} type={'submit'}
                                            disabled={isSubmitting}>Add user</Button>
                                    <Button variant={'contained'} color={'primary'} onClick={() => {
                                        setRenderForm(false)
                                    }}>Cancel</Button>
                                </form>
                            )
                        }
                    </Formik> : <IconButton
                        style={{width: '100%', backgroundColor: 'transparent'}} disableRipple={true}
                        disableFocusRipple={true} onClick={() => {
                        setRenderForm(true)
                    }}><AddIcon/></IconButton>
            }
        </div>
    );
}

export default UsersList;
