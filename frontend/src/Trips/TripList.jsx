import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { tripListActions, profileActions } from '../_actions';
import { Link } from "react-router-dom";
import queryString from 'query-string'
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import {
    useRouteMatch,
} from "react-router-dom";
import { FaFilter, FaFilePdf, FaPlus } from 'react-icons/fa';
import { planDownloadService } from "../_services/plan.download.service";
import UserSelector from "../_components/UserSelector";
import {isAdmin} from "../_helpers";


function TripList() {
    let { url } = useRouteMatch();
    const tripList = useSelector(state => state.tripList.list);
    const loading = useSelector(state => state.tripList.loading);
    const profile = useSelector(state => state.profile.profile);
    const filterButtonRef = useRef(null);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        "destination": "",
        "comment": "",
        "start_date_gte": "",
        "start_date_lt": "",
        "end_date_gte": "",
        "end_date_lt": "",
        "user": "",
        "limit": "",
        "offset": "",
    });

    function search() {
        const parsed = queryString.parse(location.search);
        if (!("offset" in parsed)) {
            parsed.offset = "0";
        }
        const finalFilter = {
            ...filter,
            ...parsed,
        };
        setFilter(finalFilter);
        dispatch(tripListActions.get(finalFilter));
    }

    useEffect(() => {
        search();
    }, [location.search]);

    function renderRow(trip) {
        return (
            <tr key={trip.id}>
                <td><Link to={`${url}/${trip.id}`}>{trip.id}</Link></td>
                <td>{new Date(trip.start_date).toDateString()}</td>
                <td style={{textAlign: "center"}}>{trip.count_to_trip_start}</td>
                <td>{new Date(trip.end_date).toDateString()}</td>
                {isAdmin(profile) && <td>{trip.user_full_name}</td>}
                <td>{trip.destination}</td>
                <td>{trip.comment}</td>
            </tr>
        );
    }

    function renderLoading() {
        if (loading) {
            return <span className="spinner-border spinner-border-sm mr-1"> </span>;
        }
        return null;
    }
    function renderTable() {
        if (!tripList) {
            return null;
        }
        return (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Start date</th>
                        <th scope="col">Days to start</th>
                        <th scope="col">End date</th>
                        {isAdmin(profile) && <th scope="col">User</th>}
                        <th scope="col">Destination</th>
                        <th scope="col">Comment</th>
                    </tr>
                    </thead>
                    <tbody>
                        {tripList.results.map(renderRow)}
                    </tbody>
                </table>
        );
    }

    function downloadPlan() {
        planDownloadService.downloadNextMonthPlan();
    }

    function renderTitle() {
        let title = "Trip list"
        if (tripList) {
            title += ": " + tripList.count + " trips in total";
        }
        return (
            <div className="form-row">
                <div className={"form-group col"} >
                    <h5>{title}</h5>
                </div>
                <div className={"form-group col d-flex justify-content-end"} >
                    <Link to={"/trips/create"} className="btn btn-success" style={{marginRight: "10px"}}>Create new <FaPlus /></Link>
                    <button className="btn btn-primary" onClick={downloadPlan}>Next month plan <FaFilePdf /></button>
                </div>
            </div>
        );
    }

    function getLink(backendLink) {
        let index  = backendLink.indexOf('?');
        const link =  backendLink.substr(index);
        return link;
    }

    function onClickNext() {
        setPage(page + 1);
    }

    function onClickPrevious() {
        setPage(page - 1);
    }

    function renderPagination() {
        if (!tripList) {
            return null;
        }
        return (
            <div className="row">
                <div className="col">
                    {tripList.previous && <Link to={getLink(tripList.previous)} className="btn btn-link" onClick={onClickPrevious}>&lt; Previous</Link>}
                </div>
                <div className="col text-center">
                    Page {page}
                </div>
                <div className="col text-right">
                    {tripList.next && <Link to={getLink(tripList.next)} className="btn btn-link" onClick={onClickNext}>Next &gt;</Link>}
                </div>
            </div>
        );
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFilter(f => ({ ...filter, [name]: value }));
    }

    function handleStartDateGteChange(date) {
        const name = "start_date_gte";
        let value = "";
        if (date) {
            value = date.toISOString().substring(0, 10);
        }
        setFilter(f => ({ ...filter, [name]: value }));
    }

    function handleStartDateLtChange(date) {
        const name = "start_date_lt";
        let value = "";
        if (date) {
            value = date.toISOString().substring(0, 10);
        }
        setFilter(f => ({ ...filter, [name]: value }));
    }

    function getFormFilterLink() {
        const finalFilter = {
            ...filter,
        };
        finalFilter.offset = 0;
        const qs = new URLSearchParams(finalFilter).toString();
        const link = `/trips?${qs}`;
        return link;
    }

    function onClickFilter() {
        setPage(1);
    }

    function handleSelectUser(selectedOption) {
        let user = "";
        if (selectedOption != null) {
            user = selectedOption.value;
        }
        setFilter(f => ({ ...filter, user }));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            filterButtonRef.current.click();
        }
    }

    function renderFilterForm() {
        return (
            <form>
                <div className="form-row">
                    <div className="form-group col">
                        <label htmlFor="destination">Destination</label>
                        <input type="text" name="destination" value={filter.destination} onChange={handleChange} className={'form-control'} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="comment">Comment</label>
                        <input type="text" name="comment" value={filter.comment} onChange={handleChange} className={'form-control'} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="start_date_gte">Start from</label>
                        <DateTime name="start_date_gte" value={filter.start_date_gte}
                                  dateFormat={"YYYY-MM-DD"} onChange={handleStartDateGteChange} utc={true}
                                  timeFormat={false} />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="start_date_lt">Start before</label>
                        <DateTime name="start_date_lt" value={filter.start_date_lt}
                                  dateFormat={"YYYY-MM-DD"} onChange={handleStartDateLtChange} utc={true}
                                  timeFormat={false} />
                    </div>
                    {profile && isAdmin(profile) &&
                        <div className="form-group col">
                            <label htmlFor="user_selector">User</label>
                            <UserSelector
                                name="user_selector"
                                handleSelectUser={handleSelectUser}
                            />
                        </div>
                    }

                    <div className="form-group col d-flex align-items-end justify-content-end">
                        <Link ref={filterButtonRef} to={getFormFilterLink()} name={"filter"} className="btn btn-primary" onClick={onClickFilter}>Filter <FaFilter /></Link>
                    </div>
                </div>
            </form>
        );
    }
    return (
        <div className="col-xs-12" style={{marginTop: "20px"}}>
            {renderTitle()}
            <hr />
            {renderFilterForm()}
            {loading && renderLoading()}
            {!loading && renderPagination()}
            {!loading && renderTable()}
        </div>
    );
}

export { TripList };