import {combineReducers} from 'redux'
import courses from './courseReducer'
import authors from './authorReducer'
import ajaxCallsInProgress from './ajaxStatusReducer'
import { routerReducer as router } from 'react-router-redux'

const rootReducer = combineReducers({
  router,
  courses, // : courses (we don't add it because it's ES6)
  authors,
  ajaxCallsInProgress
})

export default rootReducer
