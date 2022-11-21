import { csrfFetch } from './csrf';

const SET_GROUP = '/groups/setGroup'
const SET_GROUPS = '/groups/setGroups';
const ADD_GROUP = '/groups/addGroup'
const REMOVE_GROUPS = '/groups/removeGroups';
const REMOVE_GROUP = '/groups/removeGroup';
const EDIT_GROUP = '/groups/editGroup';

const editGroup = (group) => {
  return {
    type: EDIT_GROUP,
    payload: group
  }
}

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

const setGroup = (group) => {
  return {
    type: SET_GROUP,
    payload: group
  }
}

const removeGroups = () => {
  return {
    type: REMOVE_GROUPS,
  };
};

const removeGroup = (id) => {
  return {
    type: REMOVE_GROUP,
    payload: id
  }
}

export const deleteGroup = (id) => async dispatch => {
  const url = '/api/groups/' + id
  const options = {method: 'DELETE'}
  const response = await csrfFetch(url, options);
  dispatch(removeGroup(id))
  return response
}

export const createNewGroup = (options) => async dispatch => {
  options = {...options, method:"POST"}
  // console.log("Create new group reducer:")
  // console.log(options)
  //console.log(options.body)
  const response = await csrfFetch('/api/groups', options)
  const group = await response.json()
  dispatch(addGroup(group))
  return group
}

export const getGroup = (id) => async dispatch => {
  const url = '/api/groups/' + id
  const response = await csrfFetch(url);
  const group = await response.json();
  dispatch(setGroup(group));
  return group
}

export const searchGroups = (params) => async dispatch => {
  const response = await csrfFetch('/api/groups');
  const groups = await response.json();
  dispatch(setGroups(groups));
  return groups
}

export const editCurrentGroup = (options) => async dispatch => {
  options = {...options, method:'PUT'}
  const id = options.groupId
  const url = `/api/groups/${id}`
  // console.log(url, id, options.body)
  const response = await csrfFetch(url, options);
  const group = response.json();
  // dispatch(editGroup(JSON.parse(options.body)))
  return group
}

const initialState = { group: null, groups: [] };
const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_GROUP:
      newState = Object.assign({}, state);
      newState.groups = [...newState.groups, action.payload]
      return newState;
    case SET_GROUP:
      newState = Object.assign({}, state);
      newState.group = action.payload;
      return newState;
    case SET_GROUPS:
      newState = Object.assign({}, state);
      newState.groups = action.payload;
      return newState;
    case REMOVE_GROUP:
      const id = action.payload
      newState = Object.assign({}, state);
      newState.groups = newState.groups.filter(group => group.id !== id)
      return newState
    case REMOVE_GROUPS:
      newState = Object.assign({}, state);
      newState.groups = [];
      return newState;
    case EDIT_GROUP:
      newState = Object.assign({}, state);
      newState.groups = newState.groups.filter(group => group.id !== action.payload.id)
      newState.groups = [...newState.groups, action.payload]
      newState.group = action.payload
      return newState;
    default:
      return state;
  }
};

export default groupReducer;
