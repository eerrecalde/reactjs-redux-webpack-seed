// Any sort of expensive operations or data manipulation should be placed here.

export function authorsFormattedForDropdown (authors) {
  return authors.map(author => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    }
  })
}
