import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useParams} from 'react-router-dom'
import AssetsList from "../components/AssetsList";
import UsersList from "../components/UsersList";

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%'
    }
}));

function Company() {
    const {company_id} = useParams();
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <AssetsList company_id={company_id} summary={false}/>
            <UsersList company_id={company_id} summary={false}/>
        </div>
    );
}

export default Company;
