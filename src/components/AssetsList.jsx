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
import BarChartIcon from '@material-ui/icons/BarChart';
import {ADD_ERRORS} from "../state/actions";
import {useGlobalState} from "../state/state";
import Tooltip from '@material-ui/core/Tooltip';

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

function AssetsList({company_id}) {
    const classes = useStyles();

    const [renderForm, setRenderForm] = useState(false);
    const [assets, setAssets] = useState([]);
    const [dashboardUrl, setDashboardUrl] = useState(null);
    const [{}, dispatch] = useGlobalState();

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
            if (!res.error && res.data.company) {
                setAssets(res.data.company.assets);
                setDashboardUrl(res.data.company.dashboardUrl)
            }
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
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.description}</StyledTableCell>
            <StyledTableCell>{(row.files.totalSize / 1000000) + " MB"}</StyledTableCell>
            <StyledTableCell>{row.algorithm}</StyledTableCell>
            <StyledTableCell>
                <Tooltip title={"Delete"}>
                    <StyledIconButton onClick={() => {
                        handleDelete(row.id)
                    }}>
                        <DeleteIcon/>
                    </StyledIconButton>
                </Tooltip>
                <Tooltip title={"Details"}>
                    <StyledIconButton href={'/dashboard/company/' + company_id + '/asset/' + row.id}>
                        <SettingsIcon/>
                    </StyledIconButton>
                </Tooltip>
                <Tooltip title={"Grafana Dashboard"}>
                    <StyledIconButton href={"http://192.168.79.129:3000" + dashboardUrl}
                                      disabled={dashboardUrl === null}
                                      target={"_blank"}>
                        <BarChartIcon/>
                    </StyledIconButton>
                </Tooltip>
            </StyledTableCell>

        </StyledTableRow>
    )) : [];

    return (
        <div className={classes.container}>
            <GenericList headers={["Name", "Description", "Data Used", "Algorithm", "Actions"]} rows={rows}
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
                            else {
                                dispatch({
                                    type: ADD_ERRORS,
                                    errors: res.error
                                });
                            }
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
                    </Formik> : <Tooltip title={"Add"}><IconButton
                        style={{width: '100%', backgroundColor: 'transparent'}} disableRipple={true}
                        disableFocusRipple={true} onClick={() => {
                        setRenderForm(true)
                    }}><AddIcon/></IconButton></Tooltip>
            }
        </div>
    );
}

export default AssetsList;
