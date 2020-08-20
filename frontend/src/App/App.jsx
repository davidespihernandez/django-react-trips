import React, { useEffect } from 'react';
import { Route, Switch, Redirect, Link, Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history, isAdmin, isManager, isRegular } from '../_helpers';
import { alertActions, profileActions } from '../_actions';
import {NotFound, PrivateRoute} from '../_components';
import { Profile } from '../Profile';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { TripsPage } from "../Trips";
import { FaArrowAltCircleRight, FaUser, FaPlane } from 'react-icons/fa';
import { UsersPage } from "../users";


function App() {
    const alert = useSelector(state => state.alert);
    const loginError = useSelector(state => state.authentication.loginError);
    const profile = useSelector(state => state.profile.profile);
    const regular = isRegular(profile)
    const loggedIn = useSelector(state => state.authentication.loggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
        if (loggedIn) {
            dispatch(profileActions.getProfile());
        }
    }, []);

    return (
        <Router history={history}>
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Travel plans</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"> </span>
                    </button>
                    {loggedIn &&
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <Link to="/profile" className="nav-item nav-link">Profile</Link>
                                <Link to="/trips" className="nav-item nav-link">Trips</Link>
                                {profile && !regular && <Link to="/users" className="nav-item nav-link">Users</Link>}
                            </div>
                        </div>
                    }
                    {loggedIn &&
                        <div className="navbar-nav">
                            <Link to="/login" className="nav-item nav-link">{profile && profile.first_name} Logout <FaArrowAltCircleRight /></Link>
                        </div>
                    }
                </nav>
                <div>
                    {alert.message && !loginError &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    <Switch>
                        <PrivateRoute exact path="/profile" component={Profile} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/register" component={RegisterPage} />
                        <PrivateRoute path="/trips" component={TripsPage} />
                        <PrivateRoute path="/users" component={UsersPage} />
                        <Redirect from="*" to="/trips" />
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export { App };