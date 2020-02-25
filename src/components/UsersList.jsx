import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Chip} from '@material-ui/core'
import {useQuery} from 'graphql-hooks'
import {COMPANY_USERS_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";

const useStyles = makeStyles(theme => ({}));

function UsersList({company_id}) {
    const classes = useStyles();

    const {loading, data, error} = useQuery(COMPANY_USERS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    if (error) return <h1>Errors</h1>;

    let rows = data && data.company && data.company.users ? data.company.users.map((row) => (
        <StyledTableRow key={row.id}>
            {
                Object.entries(row).map(([key, value]) => {
                        if (key !== 'id' && key !== 'roles') return <StyledTableCell>{value}</StyledTableCell>;
                    }
                )
            }
            <StyledTableCell>X</StyledTableCell>
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
                <StyledIconButton>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + company_id + "/user/" + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : null;

    return (
        <GenericList headers={["First Name", "Last Name", "Stuff", "Roles", "Actions"]} rows={rows}
                     loading={loading} title={"Users"}/>
    );
}

export default UsersList;
