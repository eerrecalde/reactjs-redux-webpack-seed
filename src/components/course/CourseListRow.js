import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import './CourseListRow.scss'

const CourseListRow = (props) => {
  return (
    <tr className="row">
      <td><a className="row__link" href={props.course.watchHref} target="_blank">Watch</a></td>
      <td><Link className="row__link row__link--secondary" to={'/course/' + props.course.id}>{props.course.title}</Link></td>
      <td>{props.course.authorId}</td>
      <td>{props.course.category}</td>
      <td>{props.course.length}</td>
    </tr>
  )
}

CourseListRow.propTypes = {
  course: PropTypes.object.isRequired
}

export default CourseListRow
