import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as courseActions from '../../actions/courseActions'
import * as authorActions from '../../actions/authorActions'
import CourseForm from './CourseForm'
import {authorsFormattedForDropdown} from '../../selectors/selectors'

let alertify

export class ManageCoursePage extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
      course: Object.assign({}, props.course),
      errors: {},
      saving: false
    }

    this.updateCourseState = this.updateCourseState.bind(this)
    this.saveCourse = this.saveCourse.bind(this)
  }

  componentDidMount () {
    require('../../../node_modules/alertify-js/themes/alertify.core.css')
    require('../../../node_modules/alertify-js/themes/alertify.default.css')
    alertify = require('alertify-js')
    if (!this.props.authors.length) {
      this.props.actions.loadAuthors()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.course.id !== nextProps.course.id) {
      // Neccessary to populate form when existing course is loaded directly.
      this.setState({course: Object.assign({}, nextProps.course)})
    }
  }

  updateCourseState (event) {
    const field = event.target.name
    let course = this.state.course
    course[field] = event.target.value
    return this.setState({course: course})
  }

  courseFormIsValid () {
    let formIsValid = true
    let errors = {}

    if (this.state.course.title.length < 5) {
      errors.title = 'Title must be at least 5 characters.'
      formIsValid = false
    }

    this.setState({errors: errors})
    return formIsValid
  }

  saveCourse (event) {
    event.preventDefault()

    if (!this.courseFormIsValid()) {
      return
    }

    this.setState({saving: true})
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect('/courses'))
      .catch((error) => {
        alertify.error(error)
        this.setState({saving: false})
      })
  }

  redirect (newPage) {
    this.setState({saving: false})
    alertify.success('Course saved')
    this.context.router.push(newPage)
  }

  render () {
    return (
      <CourseForm
        allAuthors={this.props.authors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
        course={this.state.course}
        errors={this.state.errors}
        saving={this.state.saving}
      />
    )
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

// Pull in the React Router context so router is available on this.context.router
ManageCoursePage.contextTypes = {
  router: PropTypes.object
}

ManageCoursePage.fetchData = ({ store }) => {
  return (store.dispatch(courseActions.loadCourses()), store.dispatch(authorActions.loadAuthors()))
}

function getCourseById (courses, id) {
  const course = courses.filter(course => course.id === id)
  if (course.length) return course[0] // since filter return an array, have to grab first element.
  return null
}

function mapStateToProps (state, ownProps) {
  let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''}
  let courseId = ownProps.params.id // From the path '/course/:id'
  console.log('STATE', state)
  // if(!state.courses.length){
  //
  // }
  if (courseId && state.courses.length) {
    course = getCourseById(state.courses, courseId)
  }

  return {
    course: course,
    authors: authorsFormattedForDropdown(state.authors)
  }
}

function mapDispatchToProps (dispatch) {
  console.log('mapDispatchToProps')
  let actions = Object.assign({}, authorActions, courseActions)
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage)
