import React, { useEffect, useState } from 'react';
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import {NotFound} from "../_components";
import {User} from "./User";
import {UserList} from "./UserList";
import {UserCreate} from "./UserCreate";

function UsersPage() {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/create`} component={UserCreate} />
            <Route path={`${path}/:userId`} component={User} />
            <Route path={path} component={UserList} />
            <Route path="*" component={NotFound}/>
        </Switch>
    );
}

export { UsersPage };