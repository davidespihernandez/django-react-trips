import React from 'react';
import makeAnimated from 'react-select/animated';
import AsyncSelect from 'react-select/async';
import { userListService } from "../_services";

const animatedComponents = makeAnimated();

export default function UserSelector(props) {
    function userResultToOption(result) {
        return {
            value: result.id.toString(),
            label: result.first_name + " " + result.last_name,
        }
    }

    function buildOptions(users) {
        return users.map(userResultToOption);
    }

    function loadOptions(inputValue, callback) {
        userListService.get({"search": inputValue}).then((response) => {
            return callback(buildOptions(response.results));
        });
    }

    return (
        <AsyncSelect
            isClearable
            components={animatedComponents}
            loadOptions={loadOptions}
            defaultOptions
            onChange={props.handleSelectUser}
            value={props.value}
        />
    );
}
