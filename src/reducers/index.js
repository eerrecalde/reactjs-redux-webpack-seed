import {combineReducers} from 'redux'
import courses from './courseReducer'
import authors from './authorReducer'
import ajaxCallsInProgress from './ajaxStatusReducer'

const rootReducer = combineReducers({
  courses, // : courses (we don't add it because it's ES6)
  authors,
  ajaxCallsInProgress
})

export default rootReducer
