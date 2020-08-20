import { profileConstants } from '../_constants';
import { profileService } from '../_services';
import { alertActions } from './';
import { history } from "../_helpers";

export const profileActions = {
    getProfile,
    updateProfile,
};

function getProfile() {
    return dispatch => {
        dispatch(request());
        profileService.getProfile()
            .then(
                profile => {
                    dispatch(success(profile));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }

    function request() { return { type: profileConstants.GET_PROFILE_REQUEST } }
    function success(profile) { return { type: profileConstants.GET_PROFILE_SUCCESS, profile } }
    function failure(error) { return { type: profileConstants.GET_PROFILE_FAILURE, error } }
}

function updateProfile(user) {
    return dispatch => {
        dispatch(request(user));

        profileService.updateProfile(user)
            .then(
                profile => {
                    dispatch(success());
                    history.push('/profile');
                    dispatch(alertActions.success('Profile updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: profileConstants.UPDATE_PROFILE_REQUEST, user } }
    function success(profile) { return { type: profileConstants.UPDATE_PROFILE_SUCCESS, profile } }
    function failure(error) { return { type: profileConstants.UPDATE_PROFILE_FAILURE, error } }
}
