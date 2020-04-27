import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useManualQuery, useMutation} from 'graphql-hooks'
import {Button, IconButton, TextField} from '@material-ui/core'
import {API_KEYS_QUERY, DELETE_API_KEY_MUTATION, UPDATE_API_KEY_MUTATION} from "../assets/queries";
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import {ADD_ERRORS, SET_INFO} from "../state/actions";
import {Formik} from 'formik';
import AddIcon from '@material-ui/icons/Add';
import {useGlobalState} from "../state/state";
import {SUCCESS} from "../assets/severities";
import CompanySelect from "./CompanySelect";
import SettingsIcon from '@material-ui/icons/Build';
import ApiKeyHistory from "./ApiKeyHistory";

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

function ApiKeysList() {
    const [getApiKeys, {loading, error}] = useManualQuery(API_KEYS_QUERY, {
        variables: {
            first: 10
        }
    });
    const classes = useStyles();
    const [updateApiKey, {loading2}] = useMutation(UPDATE_API_KEY_MUTATION);
    const [renderForm, setRenderForm] = useState(false);
    const [openHistory, setOpenHistory] = useState(null);
    const [apiKeys, setApiKeys] = useState([]);
    const [deleteApiKeyMutation, {loading3}] = useMutation(DELETE_API_KEY_MUTATION);
    const [{}, dispatch] = useGlobalState();

    useEffect(() => {
        getApiKeys().then((res) => {
            setApiKeys(res.data.apiKeys)
        })
    }, []);

    const handleDelete = (id) => {
        deleteApiKeyMutation({variables: {id: id}}).then((res) => {
            let newApiKeys = [];
            apiKeys.forEach((apiKey) => {
                if (apiKey.id !== id) {
                    newApiKeys.push(apiKey)
                }
            });
            if (res.data.deleteApiKey && res.data.deleteApiKey.apiKey) {
                setApiKeys(newApiKeys)
            }

        })
    };

    const addApiKey = (key) => {
        if (key && key.id) {
            setApiKeys([key, ...apiKeys])
        }
    };

    let rows = apiKeys.length !== 0 ? apiKeys.map((row) => (
        <StyledTableRow key={row.id}>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.companyName}</StyledTableCell>
            <StyledTableCell>{row.apiKey}</StyledTableCell>
            <StyledTableCell>{row.lastUsed ? row.lastUsed : "Never"}</StyledTableCell>
            <StyledTableCell>
                <Tooltip title={"Delete"}>
                    <StyledIconButton onClick={() => {
                        handleDelete(row.id)
                    }}>
                        <DeleteIcon/>
                    </StyledIconButton>
                </Tooltip>
                <Tooltip title={"History"}>
                    <StyledIconButton onClick={() => {
                        setOpenHistory(row.id)
                    }}>
                        <SettingsIcon/>
                    </StyledIconButton>
                </Tooltip>
            </StyledTableCell>
        </StyledTableRow>
    )) : null;

    return (
        <div className={classes.container}>
            <GenericList headers={["API Key Name", "Owner", "API Key", "Last Used", "Actions"]} rows={rows}
                         loading={loading} title={"API Keys"}/>
            <ApiKeyHistory open={openHistory !== null} closeHandler={() => setOpenHistory(null)}
                           api_key_id={openHistory}/>
            {
                renderForm ?
                    <Formik initialValues={{user_id: null, role_ids: []}} onSubmit={(values, {setSubmitting}) => {
                        updateApiKey({
                            variables: {
                                ...values
                            }
                        }).then((res) => {
                            if (!res.error && res.data.apiKey && res.data.apiKey.apiKey) {
                                addApiKey(res.data.apiKey.apiKey);
                                dispatch({
                                    type: SET_INFO,
                                    info: {type: SUCCESS, message: "Added new API Key"}
                                });
                            } else {
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
                                    <TextField type={'text'} required={true}
                                               label={'API Key Name'}
                                               style={{width: '100%'}} name={"name"}
                                               onInput={handleChange}
                                               value={values.name} fullWidth={false}/>
                                    <CompanySelect setFieldValue={setFieldValue} required={true}/>
                                    <Button variant={'contained'} color={'primary'} type={'submit'}
                                            disabled={isSubmitting}>Add API Key</Button>
                                    <Button variant={'contained'} color={'primary'} onClick={() => {
                                        setRenderForm(false)
                                    }}>Cancel</Button>
                                </form>
                            )
                        }
                    </Formik> : <Tooltip title={"Add"}><IconButton
                        style={{width: '100%', backgroundColor: 'transparent'}} disableRipple={true}
                        disableFocusRipple={true} onClick={() => {
                        setRenderForm(true)
                    }}><AddIcon/></IconButton></Tooltip>
            }
        </div>
    );
}

export default ApiKeysList;
