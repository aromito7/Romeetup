import { csrfFetch } from './csrf';

const SET_GROUPS = '/groups/setGroups';
const REMOVE_GROUPS = '/groups/removeGroups';
const ADD_GROUP = '/groups/addGroup'

const addGroup = (group) => {
    return {
        type: ADD_GROUP,
        payload: group
    }
}

const setGroups = (groups) => {
  return {
    type: SET_GROUPS,
    payload: groups
  }
}

const removeGroups = () => {
  return {
    type: REMOVE_GROUPS,
  };
};

export const createNewGroup = (newGroup) => async dispatch => {
  const options = {...newGroup, method:"POST"}
  const response = await csrfFetch('/api/groups', options);
  const group = await response.json();
  dispatch(addGroup(group))
  return group
}

export const searchGroups = (params) => async dispatch => {
  const response = await csrfFetch('/api/groups');
  const groups = await response.json();
  dispatch(setGroups(groups));
  return groups
}

const initialState = { groups: [] };
const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_GROUP:
        newState = Object.assign({}, state);
        newState.groups = [...newState.groups, action.payload]
        return newState;
    case SET_GROUPS:
        newState = Object.assign({}, state);
        newState.groups = action.payload;
      return newState;
    case REMOVE_GROUPS:
        newState = Object.assign({}, state);
        newState.groups = [];
        return newState;
    default:
        return state;
  }
};

export default groupReducer;
