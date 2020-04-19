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
        }
    }
}));

function CompaniesList() {
    const classes = useStyles();

    const [renderForm, setRenderForm] = useState(false);
    const [companies, setCompanies] = useState([]);

    const [getCompanies, {loading, error}] = useManualQuery(COMPANIES_QUERY, {
        variables: {
            first: 10
        }
    });

    const addCompany = (company) => {
        if (company && company.id) {
            setCompanies([company, ...companies])
        }
    };
    const [updateCompany, {loading2}] = useMutation(COMPANY_MUTATION);

    const [deleteCompanyMutation, {loading3}] = useMutation(DELETE_COMPANY_MUTATION);

    useEffect(() => {
        getCompanies().then((res) => {
            setCompanies(res.data.companies)
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

    let rows = companies.length !== 0 ? companies.map((row) => (
        <StyledTableRow key={row.id}>

            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.description}</StyledTableCell>
            <StyledTableCell>{row.numberOfAssets}</StyledTableCell>
            <StyledTableCell>{row.dashboardUrl}</StyledTableCell>
            <StyledTableCell>{(row.totalSize / 1000000) + " MB"}</StyledTableCell>
            <StyledTableCell>
                <StyledIconButton onClick={() => {
                    handleDelete(row.id)
                }}>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
                <StyledIconButton href={"http://192.168.79.129:3000" + row.dashboardUrl}
                                  disabled={row.dashboardUrl === null} target={"_blank"}>
                    <BarChartIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    return (
        <div className={classes.container}>
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
                            if (res.data.company)
                                addCompany(res.data.company.company);
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
        </div>
    );
}

export default CompaniesList;
