import { csrfFetch } from './csrf';

const SET_EVENT = '/events/setEvent';
const SET_EVENTS = '/events/setEvents';
const REMOVE_EVENTS = '/events/removeEvents';
const REMOVE_EVENT = '/events/removeEvent'
const ADD_EVENT = '/events/addEvent'

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

const removeEvent = (id) => {
  return {
    type: REMOVE_EVENT,
    payload: id
  }
}

const addEvent = (event) => {
  return {
    type: ADD_EVENT,
    payload: event
  }
}

export const deleteEvent = (id) => async dispatch => {
  const url = '/api/events/' + id
  const options = {method: 'DELETE'}
  const response = await csrfFetch(url, options);
  dispatch(removeEvent(id))
  return response
}

export const getEvent = (id) => async dispatch => {
  const url = '/api/events/' + id
  // console.log(`url: ${url}`)
  const response = await csrfFetch(url);
  const event = await response.json();
  // console.log(event)
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

export const createNewEvent = (options) => async dispatch => {
  options = {...options, method:"POST"}
  const {groupId} = options
  const response = await csrfFetch(`/api/groups/${groupId}/events`, options);
  const event = await csrfFetch('/api/groups/${groupId}')
  dispatch(addEvent(event));
  return event
}


const initialState = { event: null, events: [] };
const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_EVENT:
      newState = Object.assign({}, state);
      newState.events = [...newState.events, action.payload];
      return newState;
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
    case REMOVE_EVENT:
      const id = action.payload
      newState = Object.assign({}, state);
      newState.events = newState.events.filter(event => event.id !== id)
      // newState.event = null
      return newState
    default:
      return state;
  }
};

export default eventReducer;
