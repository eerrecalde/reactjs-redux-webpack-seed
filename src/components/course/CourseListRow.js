import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import styles from './CourseListRow.scss'

const CourseListRow = (props) => {
  return (
    <tr>
      <td className={styles.trEl}><a href={props.course.watchHref} target="_blank">Watch</a></td>
      <td><Link to={'/course/' + props.course.id}>{props.course.title}</Link></td>
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
