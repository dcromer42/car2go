// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: '/faucets/:name',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const MeshPointPage = require('components/MeshPointPage').default
      // const reducer = require('./modules/reducer').default

      // injectReducer(store, { key: 'tabs', reducer })

      /*  Return getComponent   */
      cb(null, MeshPointPage)

    /* Webpack named bundle   */
    }, 'MeshPointPage')
  }
})
