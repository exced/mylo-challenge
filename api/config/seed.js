const users = [
  {
    "age": 24,
    "category": "cat2",
    "username": "Joe",
    "password": "Joe",
    "priority": 1
  },
  {
    "age": 76,
    "category": "cat1",
    "username": "Jane",
    "password": "Jane",
    "priority": 4,
  },
  {
    "age": 32,
    "category": "cat2",
    "username": "Kevin",
    "password": "Kevin",
    "priority": 2,
  },
  {
    "age": 54,
    "category": "cat3",
    "username": "Lucy",
    "password": "Lucy",
    "priority": 1,
  },
  {
    "age": 34,
    "category": "cat1",
    "username": "Colin",
    "password": "Colin",
    "priority": 3,
  },
  {
    "age": 36,
    "category": "cat3",
    "username": "Franny",
    "password": "Franny",
    "priority": 2,
  },
  {
    "age": 74,
    "category": "cat2",
    "username": "Neil",
    "password": "Neil",
    "priority": 4,
  }
]

const seed = (models) => {
  for (let i = 0; i < users.length; i++) {
    models.User.insert(users[i])
  }
}

export default seed