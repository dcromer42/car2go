// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: ':projectname',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Project = require('containers/Projects/Project/ProjectContainer').default
      // const reducer = require('./modules/reducer').default

      // injectReducer(store, { key: 'tabs', reducer })

      /*  Return getComponent   */
      cb(null, Project)

    /* Webpack named bundle   */
    }, 'Project')
  }
})
