import React, { useEffect, useState } from 'react';
import {
    Link,
    useParams,
} from "react-router-dom";
import { tripDetailService } from "../_services";
import { useDispatch, useSelector } from 'react-redux';
import { profileActions, tripDetailActions } from "../_actions";
import DateTime from "react-datetime";
import {FaSave, FaTimes} from 'react-icons/fa';
import {isAdmin} from "../_helpers";


function Trip() {
    let { tripId } = useParams();

    const trip = useSelector(state => state.tripDetail.trip);
    const profile = useSelector(state => state.profile.profile);
    const deleting = useSelector(state => state.tripDetail.deleting);
    const dispatch = useDispatch();

    useEffect(() => {
        tripDetailService.get(tripId)
            .then(
                trip => {
                    const tripInitialData = {
                        id: trip.id,
                        destination: trip.destination,
                        comment: trip.comment,
                        start_date: trip.start_date,
                        end_date: trip.end_date,
                        count_to_trip_start: trip.count_to_trip_start,
                        user: trip.user,
                        user_full_name: trip.user_full_name,
                    }
                    setTripData(tripInitialData);
                },
                error => {
                    console.log("trip retrieve error", trip);
                }
            );
    }, []);

    const [tripData, setTripData] = useState({
        id: "",
        destination: "",
        comment: "",
        start_date: "",
        end_date: "",
        count_to_trip_start: "",
        user: "",
        user_full_name: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const updating = useSelector(state => state.tripDetail.updating);

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
        if (tripData.destination && tripData.start_date && tripData.end_date) {
            const payload = {
                id: tripData.id,
                destination: tripData.destination,
                start_date: tripData.start_date,
                end_date: tripData.end_date,
                comment: tripData.comment,
            }
            dispatch(tripDetailActions.update(payload));
        }
    }

    function deleteTrip() {
        if(confirm("Delete this trip?")) {
            dispatch(tripDetailActions.delete(tripData.id));
        }
    }

    function renderTitle() {
        return (
            <div className="form-row">
                <div className={"form-group col"} >
                    <h5>
                        {tripData && ("#" + tripData.id + ": ")} Trip detail
                        {tripData.count_to_trip_start && <small> ({tripData.count_to_trip_start} days to start date) </small>}
                    </h5>
                </div>
                <div className={"form-group col d-flex justify-content-end"} >
                    <Link to={"/trips"} className="btn btn-link">Go to list</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            {renderTitle()}
            <hr />
            <form name="form" onSubmit={handleSubmit}>
                {isAdmin(profile) &&
                    <div className="form-group">
                        <label>User: </label>
                        <Link to={`/users/${tripData.user}`}> {tripData.user_full_name} </Link>
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
                        {updating && <span className="spinner-border spinner-border-sm mr-1"></span>}
                         Save <FaSave />
                    </button>
                    <button className="btn btn-danger float-right" onClick={deleteTrip}>
                        {deleting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Delete <FaTimes />
                    </button>
                </div>
            </form>
        </div>
    );
}

export { Trip };