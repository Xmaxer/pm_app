import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useMutation, useQuery} from 'graphql-hooks'
import {COMPANIES_QUERY, COMPANY_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import GenericList from "./GenericList";
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";

const useStyles = makeStyles(theme => ({}));

function CompaniesList() {
    const classes = useStyles();

    const [form, setForm] = useState({});

    const {loading, error, data} = useQuery(COMPANIES_QUERY, {
        variables: {
            first: 10
        }
    });

    const [updateCompany, {loading2, error2, data2}] = useMutation(COMPANY_MUTATION, {
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
                <StyledIconButton>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    return (
        <GenericList headers={["Company Name", "Description", "Number of Assets", "Data", "Avg Accuracy", "Actions"]}
                     rows={rows}
                     loading={loading} title={"Companies"}/>
    );
}

export default CompaniesList;
