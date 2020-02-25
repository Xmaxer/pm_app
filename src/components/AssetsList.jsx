import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useQuery} from 'graphql-hooks'
import {COMPANY_ASSETS_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";

const useStyles = makeStyles(theme => ({}));

function AssetsList({summary = true, company_id}) {

    const {loading, data, error} = useQuery(COMPANY_ASSETS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    if (error) return <h1>Errors</h1>;
    /*if (data.company === null) return <Redirect to={'/dashboard'}/>;*/

    let rows = data && data.company && data.company.assets ? data.company.assets.map((row) => (
        <StyledTableRow key={row.id}>
            {
                Object.entries(row).map(([key, value]) => {
                        if (key !== 'id') return <StyledTableCell>{value}</StyledTableCell>;
                    }
                )
            }
            <StyledTableCell>DATA</StyledTableCell>
            <StyledTableCell>ACCURACY</StyledTableCell>
            <StyledTableCell>ALGORITHM</StyledTableCell>
            <StyledTableCell>
                <StyledIconButton>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + company_id + '/asset/' + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    return (
        <GenericList headers={["Name", "Description", "Data Used", "Accuracy", "Algorithm", "Actions"]} rows={rows}
                     loading={loading} title={"Assets"}/>
    );
}

export default AssetsList;
