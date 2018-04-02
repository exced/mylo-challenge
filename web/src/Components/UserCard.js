import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'antd'
import TextEdit from './TextEdit'

export default class UserCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: props.username,
      age: props.age,
      category: props.category,
      priority: props.priority,
    }
  }

  priorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'orange'
      case 2:
        return 'green'
      case 3:
        return 'blue'
      case 4:
        return 'purple'
      default:
        return 'black'
    }
  }

  render() {
    const { onUpdate, onRemove } = this.props
    const { username, age, category, priority } = this.state
    return (
      <Card
        style={{ textAlign: 'center', width: 300, border: `2px solid ${this.priorityColor(priority)}` }}
        actions={[
          <Icon
            onClick={() => onUpdate({
              username,
              age: Number(age),
              category,
            })}
            type="save"
          />,
          <Icon onClick={onRemove} style={{ color: 'red' }} type="delete" />
        ]}
      >
        <TextEdit
          style={{ fontSize: 16, fontWeight: 'bold' }}
          value={username}
          placeholder='Username'
          onChange={username => this.setState({ username })}
        />
        <TextEdit
          style={{ fontSize: 12, fontStyle: 'italic' }}
          value={age}
          placeholder='Age'
          onChange={age => this.setState({ age })}
        />
        <TextEdit
          style={{ fontSize: 12 }}
          value={category}
          placeholder='Category'
          onChange={category => this.setState({ category })}
        />
      </Card>
    )
  }
}

UserCard.defaultProps = {
  username: PropTypes.array.isRequired,
  age: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}