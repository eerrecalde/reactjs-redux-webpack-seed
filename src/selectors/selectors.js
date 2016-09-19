// Any sort of expensive operations about data manipulation should be placed here.
// Reselect is a memoization module. 
// Basically with this module we avoid recalculating the same thing all the time, and it'll instead
// recalculate only when a relevant part of the store is modified
// (in this case authors).
// See https://github.com/reactjs/reselect
import { createSelector } from 'reselect'

const getAuthors = (state) => state.authors

export const authorsFormattedForDropdown = createSelector(
  [getAuthors],
  (authors) => {
    return authors.map(author => {
      return {
        value: author.id,
        text: author.firstName + ' ' + author.lastName
      }
    })
  }
)
