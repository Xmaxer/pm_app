import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useManualQuery, useMutation} from 'graphql-hooks'
import {ASSET_MUTATION, COMPANY_ASSETS_QUERY, DELETE_ASSET_MUTATION} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import {Button, IconButton, TextField} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import {Formik} from 'formik';

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

function AssetsList({company_id}) {
    const classes = useStyles();

    const [renderForm, setRenderForm] = useState(false);
    const [assets, setAssets] = useState([]);

    const [getAssets, {loading, error}] = useManualQuery(COMPANY_ASSETS_QUERY, {
        variables: {
            first: 10,
            companyId: company_id
        }
    });
    const [updateAsset, {loading2}] = useMutation(ASSET_MUTATION);
    const [deleteAsset, {loading3}] = useMutation(DELETE_ASSET_MUTATION);

    const addAsset = (asset) => {
        if (asset && asset.id) {
            setAssets([asset, ...assets])
        }
    };


    useEffect(() => {
        getAssets().then((res) => {
            if (!res.error)
                setAssets(res.data.company.assets)
        })
    }, []);

    const handleDelete = (id) => {
        deleteAsset({variables: {id: id}}).then((res) => {
            let newAssets = [];
            assets.forEach((asset) => {
                if (asset.id !== id) {
                    newAssets.push(asset)
                }
            });
            if (res.data.deleteAsset && res.data.deleteAsset.asset) {
                setAssets(newAssets)
            }

        })
    };

    if (error) return <h1>Errors</h1>;

    let rows = assets.length !== 0 ? assets.map((row) => (
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
                <StyledIconButton onClick={() => {
                    handleDelete(row.id)
                }}>
                    <DeleteIcon/>
                </StyledIconButton>
                <StyledIconButton href={'/dashboard/company/' + company_id + '/asset/' + row.id}>
                    <SettingsIcon/>
                </StyledIconButton>
            </StyledTableCell>

        </StyledTableRow>
    )) : [];

    return (
        <div className={classes.container}>
            <GenericList headers={["Name", "Description", "Data Used", "Accuracy", "Algorithm", "Actions"]} rows={rows}
                         loading={loading || loading2} title={"Assets"}/>
            {
                renderForm ?
                    <Formik initialValues={{name: '', description: ''}} onSubmit={(values, {setSubmitting}) => {
                        updateAsset({
                            variables: {
                                ...values,
                                companyId: company_id
                            }
                        }).then((res) => {
                            if (res.data.asset)
                                addAsset(res.data.asset.asset);
                            setSubmitting(false)
                        });
                    }}>
                        {
                            ({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                                <form onSubmit={handleSubmit} className={classes.form}>
                                    <TextField type={'text'} required={true}
                                               placeholder={'Asset Name'}
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

export default AssetsList;
