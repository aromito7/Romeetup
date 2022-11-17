import { csrfFetch } from './csrf';

const SET_EVENTS = '/session/setEvents';
const REMOVE_EVENTS = '/session/removeEvents';
const SET_GROUPS = '/session/setGroups';
const REMOVE_GROUPS = '/session/removeGroups'

const setEvents = (events) => {
  return {
    type: SET_EVENTS,
    payload: events
  }
}
const removeEvents = () => {
  return {
    type: REMOVE_EVENTS,
  };
};


export const searchEvents = (params) => async dispatch => {
    const response = await csrfFetch('/api/events');
    const events = await response.json();
    dispatch(setEvents(events));
    return events
  }


const initialState = { events: [] };
const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_EVENTS:
      newState = Object.assign({}, state);
      newState.events = action.payload;
      return newState;
    case REMOVE_EVENTS:
      newState = Object.assign({}, state);
      newState.events = [];
      return newState;
    default:
      return state;
  }
};

export default eventReducer;