import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { profile } from './profile.reducer';
import { alert } from './alert.reducer';
import { tripList } from './trip.list.reducer';
import { tripDetail } from './trip.detail.reducer';
import { userList } from './user.list.reducer';
import { userDetail } from './user.detail.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  profile,
  tripList,
  tripDetail,
  userList,
  userDetail,
  alert,
});

export default rootReducer;