import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useMutation, useQuery} from 'graphql-hooks'
import {ASSET_MUTATION, COMPANY_ASSETS_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import {TextField} from '@material-ui/core'

const useStyles = makeStyles(theme => ({}));

function AssetsList({summary = true, company_id}) {
    const [form, setForm] = useState({});

    const {loading, data, error} = useQuery(COMPANY_ASSETS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    const [updateAsset, {loading2, error2, data2}] = useMutation(ASSET_MUTATION, {
        variables: {
            ...form,
            companyId: company_id
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

    if (error) return <h1>Errors</h1>;

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
    )) : [];

    const newAssetForm = [<StyledTableCell> <TextField type={'text'} required={true}
                                                       placeholder={'Asset Name'}
                                                       style={{width: '100%'}} name={"name"}
                                                       onInput={handleChange}/></StyledTableCell>,
        <StyledTableCell> <TextField type={'text'} required={false}
                                     placeholder={'Description'}
                                     style={{width: '100%'}} name={"description"}
                                     onInput={handleChange}/></StyledTableCell>];

    return (
        <GenericList headers={["Name", "Description", "Data Used", "Accuracy", "Algorithm", "Actions"]} rows={rows}
                     loading={loading || loading2} title={"Assets"} canAdd={true} onSubmitAction={updateAsset}
                     newForm={newAssetForm}/>
    );
}

export default AssetsList;
