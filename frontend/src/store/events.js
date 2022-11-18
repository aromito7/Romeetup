import { csrfFetch } from './csrf';

const SET_EVENT = '/session/setEvent';
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

const setEvent = (event) => {
  return {
    type: SET_EVENT,
    payload: event
  }
}

const removeEvents = () => {
  return {
    type: REMOVE_EVENTS,
  };
};

export const getEvent = (id) => async dispatch => {
  const url = '/api/events/' + id
  // console.log(`url: ${url}`)
  const response = await csrfFetch(url);
  const event = await response.json();
  console.log(event)
  dispatch(setEvent(event));
  // console.log("Dispatcher Event:")
  // console.log(event)
  // console.log("Dispatcher Response")
  // console.log(response.body)
  return event
}

export const searchEvents = () => async dispatch => {
  const response = await csrfFetch('/api/events');
  const events = await response.json();
  dispatch(setEvents(events));
  return events
  }


const initialState = { event: null, events: [] };
const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_EVENT:
      newState = Object.assign({}, state);
      newState.event = action.payload;
      return newState;
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
