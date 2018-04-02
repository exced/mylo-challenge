const resolver = {
  User: {
    id: (user) => user._id,
  },
  Query: {
    users: (root, { offset, limit }, { User }) => User.all({ offset, limit }),
    user: (root, { id }, { User }) => User.findOneById(id),
  },
  Mutation: {
    updateUser: (root, { id, input }, { User }) => User.updateById(id, input),
    removeUser: (root, { id }, { User }) => User.removeById(id),
  },
  Subscription: {
    userUpdated: user => user,
  },
}

export default resolver