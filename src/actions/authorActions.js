import * as types from './actionTypes'
import authorApi from '../api/mockAuthorApi'
import {beginAjaxCall} from './ajaxStatusActions'

export function loadAuthorsSucess (authors) {
  return { type: types.LOAD_AUTHORS_SUCCESS, authors }
}

export function loadAuthors () {
  console.log('LOAD AUTHORS')
  return function (dispatch) {
    dispatch(beginAjaxCall())
    return authorApi.getAllAuthors().then((authors) => {
      dispatch(loadAuthorsSucess(authors))
    }).catch((error) => {
      throw (error)
    })
  }
}
