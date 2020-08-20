import React, { useEffect, useState } from 'react';
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import { Trip } from "./Trip";
import { TripList } from "./TripList";
import { TripCreate } from "./TripCreate";
import {NotFound} from "../_components";

function TripsPage() {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/create`} component={TripCreate} />
            <Route path={`${path}/:tripId`} component={Trip} />
            <Route path={path} component={TripList} />
            <Route path="*" component={NotFound}/>
        </Switch>
    );
}

export { TripsPage };