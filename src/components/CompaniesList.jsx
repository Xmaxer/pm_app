import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useMutation, useQuery} from 'graphql-hooks'
import {COMPANIES_QUERY, COMPANY_MUTATION, DELETE_COMPANY_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import GenericList from "./GenericList";
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import {TextField} from '@material-ui/core'

const useStyles = makeStyles(theme => ({}));

function CompaniesList() {
    const classes = useStyles();

    const [form, setForm] = useState({});
    const [deleteId, setDeleteId] = useState(null);
    const {loading, error, data} = useQuery(COMPANIES_QUERY, {
        variables: {
            first: 10
        },
        skipCache: true
    });

    const [updateCompany, {loading2}] = useMutation(COMPANY_MUTATION, {
        variables: {
            ...form
        }
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setForm({
            ...form,
            [name]: value
        })
    };

    const [deleteCompanyMutation, {loading3}] = useMutation(DELETE_COMPANY_MUTATION, {
            variables: {
                id: deleteId
            }
        }
    );

    useEffect(() => {
        if (deleteId !== null)
            deleteCompanyMutation().then(() => {
                setDeleteId(null)
            })
    }, [deleteId]);

    let rows = data && data.companies ? data.companies.map((row) => (
        <StyledTableRow key={row.id}>
            {
                Object.entries(row).map(([key, value]) => {
                        if (key !== 'id') return <StyledTableCell>{value}</StyledTableCell>;
                    }
                )
            }
            <StyledTableCell>DATA</StyledTableCell>
            <StyledTableCell>ACCURACY</StyledTableCell>
            <StyledTableCell>
                <StyledIconButton onClick={() => {
                    setDeleteId(row.id)
                }}>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    const newCompanyForm = [<StyledTableCell> <TextField type={'text'} required={true}
                                                         placeholder={'Company Name'}
                                                         style={{width: '100%'}} name={"name"}
                                                         onInput={handleChange}/></StyledTableCell>,
        <StyledTableCell> <TextField type={'text'} required={false}
                                     placeholder={'Description'}
                                     style={{width: '100%'}} name={"description"}
                                     onInput={handleChange}/></StyledTableCell>];

    return (
        <GenericList headers={["Company Name", "Description", "Number of Assets", "Data", "Avg Accuracy", "Actions"]}
                     rows={rows}
                     loading={loading || loading2} title={"Companies"} canAdd={true} newForm={newCompanyForm}
                     onSubmitAction={updateCompany}/>
    );
}

export default CompaniesList;
