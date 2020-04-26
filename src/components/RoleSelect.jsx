import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {COMPANY_ROLES_QUERY} from "../assets/queries";
import {useManualQuery} from 'graphql-hooks'
import {ADD_ERRORS} from "../state/actions";
import {useGlobalState} from "../state/state";
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({}));

function RoleSelect({company_id, setFieldValue, defaultValues, updateHandler}) {

    const [getRoles, {loading}] = useManualQuery(COMPANY_ROLES_QUERY, {
        variables: {
            company_id: company_id
        }
    });

    const [roles, setRoles] = useState([]);
    const [selected, setSelected] = useState(defaultValues ? defaultValues : []);
    const [{}, dispatch] = useGlobalState();

    useEffect(() => {
        getRoles().then((res) => {
            if (!res.error && res.data.company) {
                setRoles(res.data.company.roles)
            } else {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                });
            }
        })
    }, []);

    return (
        <Autocomplete options={roles}
                      getOptionLabel={(option) => option.name ? option.name : "Owner"}
                      renderInput={(params) => <TextField {...params} label={"Search roles"} margin={"normal"}/>}
                      renderOption={(option) => <React.Fragment>
                          {option.name ? option.name : "Owner"}
                          <div style={{
                              backgroundColor: option.colour,
                              width: "20px",
                              height: '20px',
                              borderRadius: '10px',
                              marginLeft: '5px',
                              borderWidth: '0.5px',
                              borderStyle: "solid"
                          }}/>
                      </React.Fragment>}
                      renderTags={(value, getTagProps) => {
                          return value.map((option, index) => {
                              return <Chip variant={"outlined"} label={option.name ? option.name : "Owner"}
                                           style={{backgroundColor: option.colour}} {...getTagProps({index})}/>
                          })
                      }}
                      multiple={true}
                      onChange={(event, newValue) => {
                          if (setFieldValue)
                              setFieldValue('role_ids', newValue.map((value) => parseInt(value.id)));
                          if (updateHandler)
                              updateHandler(newValue, selected);
                          setSelected(newValue)
                      }}
                      value={selected}
        />
    );
}

export default RoleSelect;
