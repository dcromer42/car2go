import React, { Component } from 'react'
import { PropTypes }  from 'prop-types';
import { connect } from 'react-redux'
import { map } from 'lodash'
import Theme from 'theme'
import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS,
  // orderedToJS,
  // populatedDataToJS
} from 'react-redux-firebase'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import TodoItem from 'components/TodoItem'
import NewTodoPanel from 'components/NewTodoPanel'
import classes from './TodoContainer.scss'

import Particles from 'react-particles-js';
import particles from './particles.json'


// const populates = [
//   { child: 'owner', root: 'users', keyProp: 'key' }
// ]

@firebaseConnect([
  // 'todos' // sync full list of todos
  // { path: '/projects', type: 'once' } // for loading once instead of binding
  { path: 'todos', queryParams: ['limitToFirst=20'] } // limit to first 20
  // { path: 'todos', queryParams: ['limitToFirst=20'], populates } // populate
  // { path: 'todos', queryParams: ['orderByChild=text'] }, // list todos alphabetically
])
@connect(
  ({ firebase }) => ({
    auth: pathToJS(firebase, 'auth'),
    todos: dataToJS(firebase, 'todos')
    // todos: populatedDataToJS(firebase, '/todos', populates), // if populating
    // todos: orderedToJS(firebase, 'todos'), // if using ordering such as orderByChild
  })
)
export default class Todo extends Component {
  static propTypes = {
    todos: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
    firebase: PropTypes.shape({
      set: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired
    }),
    auth: PropTypes.shape({
      uid: PropTypes.string
    })
  }

  state = {
    error: null
  }

  toggleDone = (todo, id) => {
    const { firebase, auth } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Toggle Done' })
    }
    firebase.set(`/todos/${id}/done`, !todo.done)
  }

  deleteTodo = (id) => {
    const { todos, auth, firebase } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Delete' })
    }
    if (todos[id].owner !== auth.uid) {
      return this.setState({ error: 'You must own todo to delete' })
    }
    firebase.remove(`/todos/${id}`)
  }

  handleAdd = (newTodo) => {
    // Attach user if logged in
    if (this.props.auth) {
      newTodo.owner = this.props.auth.uid
    } else {
      newTodo.owner = 'Anonymous'
    }
    this.props.firebase.push('/todos', newTodo)
  }

  render() {
    const { todos } = this.props
    const { error } = this.state
    console.log('todos:', todos)

    return (
      <div className={classes.container} style={{ color: Theme.palette.primary2Color }}>
        {
          error
            ? <Snackbar
              open={!!error}
              message={error}
              autoHideDuration={4000}
              onRequestClose={() => this.setState({ error: null })}
            />
            : null
        }

        <Particles className={classes.particles} params={{
          particles: particles.particles,
          interactivity: particles.interactivity
        }} />


        <div className={classes.todos}>
          <NewTodoPanel
            onNewClick={this.handleAdd}
            disabled={false}
          />
          {
            !isLoaded(todos)
              ? <CircularProgress />
              : <Paper className={classes.paper}>
                <Subheader>Todos</Subheader>
                <List className={classes.list}>
                  {
                    todos &&
                    map(todos, (todo, id) => (
                      <TodoItem
                        key={id}
                        id={id}
                        todo={todo}
                        onCompleteClick={this.toggleDone}
                        onDeleteClick={this.deleteTodo}
                      />
                    )
                    )
                  }
                </List>
              </Paper>
          }
        </div>
      </div>
    )
  }
}
