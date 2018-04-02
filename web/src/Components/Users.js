import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Select, Input, Modal } from 'antd'
import styled from 'styled-components'
import UserCard from './UserCard'

const { Option } = Select
const { Search } = Input
const { Item } = List
const { confirm } = Modal

const Header = styled.div`
  padding: 10px;
  text-align: center;
`

export default class Users extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'default',
      filter: '',
      category: null,
    }
  }

  onRemove = (item) => confirm({
    title: "Remove this user ?",
    content: item.username,
    onOk: () => this.props.onRemoveUser(item.id),
    onCancel: () => { },
  })

  onUpdate = (user, item) => confirm({
    title: "Save this user ?",
    content: user.username,
    onOk: () => this.props.onUpdateUser(user.id, item),
    onCancel: () => { },
  })

  sort = (users, order) => {
    switch (order) {
      case 'alphabetical':
        return users.sort((a, b) => a.username.localeCompare(b.username))
      case 'priority':
        return users.sort((a, b) => a.priority - b.priority)
      default:
        return users
    }
  }

  render() {
    const { users } = this.props
    const { order, filter, category } = this.state
    const ordered = this.sort([...users], order)
    const filtered = filter ? ordered.filter(e => e.username.toLowerCase().match(filter.toLowerCase())) : ordered
    const data = category ? filtered.filter(e => e.category === category) : filtered
    return (
      <div>
        <Header>
          <Search
            placeholder="Search user"
            onChange={e => this.setState({ filter: e.target.value })}
            style={{ width: 200 }}
          />
          <Select style={{ width: 120 }}
            defaultValue='default'
            onChange={order => this.setState({ order })}
            placeholder='Order'
          >
            <Option value='default'>Default</Option>
            <Option value='alphabetical'>Alphabetical</Option>
            <Option value='priority'>Priority</Option>
          </Select>
          <Select style={{ width: 120 }}
            onChange={category => this.setState({ category })}
            placeholder='Category'
          >
            <Option value='cat1'>Category 1</Option>
            <Option value='cat2'>Category 2</Option>
            <Option value='cat3'>Category 3</Option>
          </Select>
        </Header>
        <List
          style={{ padding: '30px' }}
          grid={{ gutter: 16, column: 3 }}
          dataSource={data}
          renderItem={user => (
            <Item>
              <UserCard
                key={user.id}
                username={user.username}
                age={user.age}
                category={user.category}
                priority={user.priority}
                onRemove={() => this.onRemove(user)}
                onUpdate={item => this.onUpdate(user, item)}
              />
            </Item>
          )}
        />
      </div>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func.isRequired,
}