import React, { useEffect, useState } from 'react';
import {
    Link,
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { profileActions, tripListActions } from "../_actions";
import DateTime from "react-datetime";
import { FaSave, FaTimes } from 'react-icons/fa';
import {isAdmin} from "../_helpers";
import UserSelector from "../_components/UserSelector";


function TripCreate() {
    const dispatch = useDispatch();

    const [tripData, setTripData] = useState({
        destination: "",
        comment: "",
        start_date: "",
        end_date: "",
        user: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const creating = useSelector(state => state.tripDetail.creating);
    const profile = useSelector(state => state.profile.profile);

    function handleChange(e) {
        const { name, value } = e.target;
        setTripData(tripData => ({ ...tripData, [name]: value }));
    }

    function handleStartDateChange(date) {
        const name = "start_date";
        let value = "";
        if (date) {
            value = date.toISOString().substring(0, 10);
        }
        setTripData(tripData => ({ ...tripData, [name]: value }));
    }

    function handleEndDateChange(date) {
        const name = "end_date";
        let value = "";
        if (date) {
            value = date.toISOString().substring(0, 10);
        }
        setTripData(tripData => ({ ...tripData, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (tripData.destination && tripData.start_date && tripData.end_date && (!isAdmin(profile) || tripData.user)) {
            const payload = {
                destination: tripData.destination,
                start_date: tripData.start_date,
                end_date: tripData.end_date,
                comment: tripData.comment,
            }
            if (tripData.user) {
                payload.user = tripData.user;
            }
            dispatch(tripListActions.create(payload));
        }
    }

    function renderTitle() {
        return (
            <h5>Create new trip</h5>
        );
    }

    function handleSelectUser(selectedOption) {
        let user = "";
        if (selectedOption != null) {
            user = selectedOption.value;
        }
        setTripData(f => ({ ...tripData, user }));
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            {renderTitle()}
            <hr />
            <form name="form" onSubmit={handleSubmit}>
                {profile && isAdmin(profile) &&
                    <div className="form-group">
                        <label htmlFor="user_selector">User</label>
                        <UserSelector
                            name="user_selector"
                            handleSelectUser={handleSelectUser}
                        />
                        {submitted && !tripData.user && <div style={{marginTop: ".25rem", fontSize: "80%", color: "#dc3545"}}>Select a user</div>}
                    </div>
                }
                <div className="form-group">
                    <label>Destination *</label>
                    <input type="text" name="destination" value={tripData.destination}
                           onChange={handleChange}
                           className={'form-control' + ((submitted && !tripData.destination) ? ' is-invalid' : '')} />
                    {submitted && !tripData.destination && <div className="invalid-feedback">Destination is mandatory</div>}
                </div>
                <div className="form-group">
                    <label>Start date *</label>
                    <DateTime name="start_date" value={tripData.start_date}
                              dateFormat={"YYYY-MM-DD"} onChange={handleStartDateChange} utc={true}
                              timeFormat={false} />
                    {submitted && !tripData.start_date && <div style={{marginTop: ".25rem", fontSize: "80%", color: "#dc3545"}}>Start date is mandatory</div>}
                </div>
                <div className="form-group">
                    <label>End date *</label>
                    <DateTime name="end_date" value={tripData.end_date}
                              dateFormat={"YYYY-MM-DD"} onChange={handleEndDateChange} utc={true}
                              timeFormat={false} />
                    {submitted && !tripData.end_date && <div style={{marginTop: ".25rem", fontSize: "80%", color: "#dc3545"}}>End date is mandatory</div>}
                </div>
                <div className="form-group">
                    <label>Comment</label>
                    <textarea name="comment" value={tripData.comment} onChange={handleChange} className={'form-control'} rows="5"/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {creating && <span className="spinner-border spinner-border-sm mr-1"></span>}
                         Save <FaSave />
                    </button>
                    <Link to={"/trips"} className="btn btn-danger float-right">Cancel <FaTimes /></Link>
                </div>
            </form>
        </div>
    );
}

export { TripCreate };