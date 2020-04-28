import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useParams} from 'react-router-dom'
import AssetsList from "../components/AssetsList";
import UsersList from "../components/UsersList";
import {Button} from '@material-ui/core'
import RoleManagement from "../components/RoleManagement";

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%',
        '& > *': {
            marginBottom: 20,
            flexBasis: '100%'
        },
        display: 'flex',
        flexWrap: 'wrap',
    },
    rolebutton: {
        color: theme.palette.tertiary.main,
        height: '50px'
    }
}));

function Company() {
    const {company_id} = useParams();
    const classes = useStyles();

    const [openRoleManagement, setOpenRoleManagement] = useState(false);

    return (
        <div className={classes.content}>
            <Button onClick={() => setOpenRoleManagement(true)} className={classes.rolebutton} color={'secondary'}
                    variant={'contained'}>Role Management</Button>
            <AssetsList company_id={company_id} summary={false}/>
            <UsersList company_id={company_id} summary={false}/>

            <RoleManagement open={openRoleManagement} closeHandler={() => {
                setOpenRoleManagement(false)
            }} company_id={company_id}/>
        </div>
    );
}

export default Company;
