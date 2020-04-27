import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {COMPANIES_QUERY} from "../assets/queries";
import {useManualQuery} from 'graphql-hooks'
import {ADD_ERRORS} from "../state/actions";
import {useGlobalState} from "../state/state";

const useStyles = makeStyles(theme => ({}));

function CompanySelect({setFieldValue, required}) {

    const [getCompanies, {loading}] = useManualQuery(COMPANIES_QUERY);

    const [companies, setCompanies] = useState([]);
    const [{}, dispatch] = useGlobalState();

    const handleTyped = (event) => {
        const value = event.target.value;
        getCompanies({
            variables: {
                filter: {
                    nameContains: value
                }
            }
        }).then((res) => {
            if (!res.error && res.data.companies) {
                setCompanies(res.data.companies)
            } else {
                dispatch({
                    type: ADD_ERRORS,
                    errors: res.error
                });
            }
        })

    };

    return (
        <Autocomplete options={companies}
                      required={required}
                      getOptionLabel={(option) => option.name}
                      disableClearable={true}
                      onChange={(event, newValue) => {
                          setFieldValue('company_id', newValue.id)
                      }}
                      renderInput={(params) => <TextField {...params} label={"Search companies"} margin={"normal"}
                                                          onChange={handleTyped}/>}
        />
    );
}

export default CompanySelect;
