import config from 'config';
import { authHeader } from '../_helpers';
import download from "downloadjs";

export const planDownloadService = {
    downloadNextMonthPlan,
};

function downloadNextMonthPlan() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    const filename = "plan.pdf";
    return fetch(`${config.apiUrl}/users/plan`, requestOptions)
        .then(function(resp) {
            return resp.blob();
        }).then(function(blob) {
            download(blob, filename, "application/pdf");
        });
}
