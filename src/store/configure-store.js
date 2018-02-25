import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Create Store and combine Reducers
export default () => {
    const store = createStore(combineReducers({
            auth: authReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
        // without thunk and compose:
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    
    return store;
};