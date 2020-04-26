import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {GET_USERS_QUERY} from "../assets/queries";
import {useManualQuery} from 'graphql-hooks'
import {ADD_ERRORS} from "../state/actions";
import {useGlobalState} from "../state/state";

const useStyles = makeStyles(theme => ({}));

function UserSelect({ignore, setFieldValue}) {

    const [getAllUsers, {loading4}] = useManualQuery(GET_USERS_QUERY);

    const [users, setUsers] = useState([]);
    const [{}, dispatch] = useGlobalState();

    const handleTyped = (event) => {
        const value = event.target.value;
        getAllUsers({
            variables: {
                contains: value,
                ignore: ignore
            }
        }).then((res) => {
            if (!res.error && res.data.users) {
                setUsers(res.data.users)
            } else {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                });
            }
        })

    };

    return (
        <Autocomplete options={users}
                      getOptionLabel={(option) => option.firstName + " " + option.lastName}
                      disableClearable={true}
                      onChange={(event, newValue) => {
                          setFieldValue('user_id', newValue.id)
                      }}
                      renderInput={(params) => <TextField {...params} label={"Search users"} margin={"normal"}
                                                          onChange={handleTyped}/>}
        />
    );
}

export default UserSelect;
