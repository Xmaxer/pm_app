import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Chip, IconButton, TextField} from '@material-ui/core'
import {useManualQuery, useMutation} from 'graphql-hooks'
import {ADD_ROLE_TO_USER_MUTATION, COMPANY_ROLES_QUERY, COMPANY_USERS_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import {ADD_ERRORS} from "../state/actions";
import {Formik} from 'formik';
import AddIcon from '@material-ui/icons/Add';
import {useGlobalState} from "../state/state";

const useStyles = makeStyles(theme => ({}));

function UsersList({company_id}) {
    const classes = useStyles();
    const [renderForm, setRenderForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [addUserRole, {loading2}] = useMutation(ADD_ROLE_TO_USER_MUTATION);
    const [{}, dispatch] = useGlobalState();

    const [getUsers, {loading}] = useManualQuery(COMPANY_USERS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    const [getCompanyRoles, {loading3}] = useManualQuery(COMPANY_ROLES_QUERY, {
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
    let rows = users.map((row) => (
        <StyledTableRow key={row.id}>
            <StyledTableCell>{row.firstName}</StyledTableCell>
            <StyledTableCell>{row.lastName}</StyledTableCell>
            <StyledTableCell>{row.roles.map(role => (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    {
                        role.name === null ?
                            <Chip label={"Owner"} style={{backgroundColor: "red"}}/> :
                            <Chip label={role.name} style={{backgroundColor: role.colour}}/>
                    }

                </div>
            ))}</StyledTableCell>
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
        <>
            <GenericList headers={["First Name", "Last Name", "Stuff", "Roles", "Actions"]} rows={rows}
                         loading={loading} title={"Users"}/>
            {
                renderForm ?
                    <Formik initialValues={{name: '', description: ''}} onSubmit={(values, {setSubmitting}) => {
                        addUserRole({
                            variables: {
                                ...values,
                                company_id: company_id
                            }
                        }).then((res) => {
                            if (res.data.addRole.user)
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
                            ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                                <form onSubmit={handleSubmit} className={classes.form}>
                                    <TextField type={'text'} required={true}
                                               placeholder={'Company Name'}
                                               style={{width: '100%'}} name={"name"}
                                               onInput={handleChange}
                                               value={values.name} fullWidth={false}/>
                                    <TextField type={'text'} required={false}
                                               placeholder={'Description'}
                                               style={{width: '100%'}} name={"description"}
                                               onInput={handleChange}
                                               value={values.description}/>
                                    <Button variant={'contained'} color={'primary'} type={'submit'}
                                            disabled={isSubmitting}>Create</Button>
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
        </>
    );
}

export default UsersList;
