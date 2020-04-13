import { SET_USER, SET_IS_LOGGED_IN } from '../actions/user';

export function userReducer(state, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
}

// reducers accept state and an action
// switch statement on the action type and perform a function on the action
// the reducer returns a new state object
// usually different based on the action
// ...state --> redux store that I'm pulling out props from
// spread is just tso get back all the old state from the users so that we don't mutate it
// not about the users it's about everything else, don't want to lose the other state

// will have to learn to combine reducers or have one reducer for the whole app
// can make the file get large. would have one super long switch statement

//user is a property of the state
// always action.payload afterwards
