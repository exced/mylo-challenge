import { compose } from 'react-apollo'
import { updateUserMutation, removeUserMutation } from '../Mutations/User'
import { usersQuery } from '../Queries/User'
import { WithLoading } from '../Components/Loading'
import Users from '../Components/Users'

export default compose(
    usersQuery,
    WithLoading,
    updateUserMutation,
    removeUserMutation,
)(Users)
