import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useManualQuery, useMutation} from 'graphql-hooks'
import {COMPANIES_QUERY, COMPANY_MUTATION, DELETE_COMPANY_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import GenericList from "./GenericList";
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import {Button, IconButton, TextField} from '@material-ui/core'
import {Formik} from 'formik';
import AddIcon from '@material-ui/icons/Add';
import BarChartIcon from '@material-ui/icons/BarChart';
import {useGlobalState} from "../state/state";
import {ADD_ERRORS} from "../state/actions";
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

function CompaniesList() {
    const classes = useStyles();
    const [renderForm, setRenderForm] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [{}, dispatch] = useGlobalState();
    const [openGrafanaDialog, setOpenGrafanaDialog] = useState(null);
    const [getCompanies, {loading, error}] = useManualQuery(COMPANIES_QUERY, {
        variables: {
            first: 10
        }
    });
    const [editField, setEditField] = useState(null);

    const addCompany = (company) => {
        if (company && company.id) {
            setCompanies([company, ...companies])
        }
    };
    const [updateCompany, {loading2}] = useMutation(COMPANY_MUTATION);

    const [deleteCompanyMutation, {loading3}] = useMutation(DELETE_COMPANY_MUTATION);

    useEffect(() => {
        getCompanies().then((res) => {
            if (!res.error && res.data) {
                setCompanies(res.data.companies)
            }

        })
    }, []);

    const handleDelete = (id) => {
        deleteCompanyMutation({variables: {id: id}}).then((res) => {
            let newCompanies = [];
            companies.forEach((company) => {
                if (company.id !== id) {
                    newCompanies.push(company)
                }

            });
            if (res.data.deleteCompany && res.data.deleteCompany.company) {
                setCompanies(newCompanies)
            }

        })
    };

    const handleOnTextFieldSubmit = (event) => {
        let company = companies.find((company) => company.id === editField.id);
        company[editField.field] = event.target.value;
        console.log(company[editField.field]);
        const key = event.key;
        if (key === "Enter" || key === undefined) {
            updateCompany({
                variables: {
                    name: company.name,
                    description: company.description,
                    id: company.id
                }
            }).then((res) => {
                if (!res.error && res.data.company && res.data.company.company) {
                    company = res.data.company.company;
                    let newCompanies = [];
                    companies.forEach((c) => {
                        if (c.id !== company.id) {
                            newCompanies.push(c)
                        } else {
                            newCompanies.push(company)
                        }
                    });
                    setCompanies([...newCompanies])
                } else {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    })
                }
            });
            setEditField(null)
        }
    };

    let rows = companies.length !== 0 ? companies.map((row) => (
        <StyledTableRow key={row.id}>

            <StyledTableCell onClick={() => setEditField({field: "name", id: row.id})}>{
                editField && editField.id === row.id && editField.field === "name" ?
                    <TextField label={editField.field} defaultValue={row.name} onKeyPress={handleOnTextFieldSubmit}
                               autoFocus onBlur={handleOnTextFieldSubmit}/> : row.name

            }</StyledTableCell>
            <StyledTableCell onClick={() => setEditField({
                field: "description",
                id: row.id
            })}>{editField && editField.id === row.id && editField.field === "description" ?
                <TextField label={editField.field} defaultValue={row.description ? row.description : ""}
                           onKeyPress={handleOnTextFieldSubmit} autoFocus onBlur={handleOnTextFieldSubmit}/> :
                row.description ? row.description : "No description"}</StyledTableCell>
            <StyledTableCell>{row.numberOfAssets}</StyledTableCell>
            <StyledTableCell>{row.dashboardUrl}</StyledTableCell>
            <StyledTableCell>{(row.totalSize / 1000000) + " MB"}</StyledTableCell>
            <StyledTableCell>
                <Tooltip title={"Delete"}>
                    <StyledIconButton onClick={() => {
                        handleDelete(row.id)
                    }}>
                        <DeleteIcon/>
                    </StyledIconButton>
                </Tooltip>
                <Tooltip title={"Details"}>
                    <StyledIconButton href={'/dashboard/company/' + row.id}>
                        <SettingsIcon/>
                    </StyledIconButton>
                </Tooltip>
                <Tooltip title={"Grafana Dashboard"}>
                    <StyledIconButton disabled={row.dashboardUrl === null} onClick={() => setOpenGrafanaDialog({
                        url: "http://192.168.79.129:3000" + row.dashboardUrl,
                        password: row.grafanaPassword,
                        username: row.grafanaUsername
                    })}>
                        <BarChartIcon/>
                    </StyledIconButton>
                </Tooltip>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    return (
        <div className={classes.container}>
            {
                openGrafanaDialog &&
                <Dialog open={openGrafanaDialog !== null} onClose={() => setOpenGrafanaDialog(null)}>
                    <DialogTitle>{"Redirect to Grafana"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"Credentials: "}
                            <br/>
                            {"Username: " + openGrafanaDialog.username}
                            <br/>
                            {"Password: " + openGrafanaDialog.password}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color={'primary'} onClick={() => setOpenGrafanaDialog(null)}>
                            Cancel
                        </Button>
                        <Button autofocus color={'secondary'} onClick={() => setOpenGrafanaDialog(null)}
                                href={openGrafanaDialog.url} target={"_blank"}>
                            Open
                        </Button>
                    </DialogActions>
                </Dialog>
            }

            <GenericList
                headers={["Company Name", "Description", "Number of Assets", "Dashboard URL", "Data", "Actions"]}
                rows={rows}
                loading={loading || loading2} title={"Companies"}/>
            {
                renderForm ?
                    <Formik initialValues={{name: '', description: ''}} onSubmit={(values, {setSubmitting}) => {
                        updateCompany({
                            variables: {
                                ...values
                            }
                        }).then((res) => {
                            if (!res.error && res.data && res.data.company)
                                addCompany(res.data.company.company);
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
                                               label={'Company Name'}
                                               style={{width: '100%'}} name={"name"}
                                               onInput={handleChange}
                                               value={values.name} fullWidth={false}/>
                                    <TextField type={'text'} required={false}
                                               label={'Description'}
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
                    </Formik> : <Tooltip title={"Add"}><IconButton
                        style={{width: '100%', backgroundColor: 'transparent'}} disableRipple={true}
                        disableFocusRipple={true} onClick={() => {
                        setRenderForm(true)
                    }}><AddIcon/></IconButton></Tooltip>
            }
        </div>
    );
}

export default CompaniesList;
