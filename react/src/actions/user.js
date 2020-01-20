export const SET_USER = 'SET_USER'

export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN'

export function setUser(userData){
    return {type: SET_USER, payload: userData}

    // set your action type as a constant 
    // actions are jsut functions that return an action object
    // technically called action creators 
    // action objects always contain a type and payload, this is the standard
    // can include other things


    // dispatch is jsut a function that takes an object and passes it to the reducers with the state 

    // first step is always to make an action 

    //r eading a value from redux, get it from the connect
    // setting the value, action creators  

}

export function setIsLoggedIn(loggedInStatus){
    return {type: SET_IS_LOGGED_IN, payload: loggedInStatus}
}