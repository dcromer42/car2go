import { connect } from 'react-redux'
import MeshPointTable from 'components/MeshPointTable'

import { browserHistory } from 'react-router'

const mapStateToProps = (state, ownProps) => {
  return {
    faucetObjects: state.faucet.objects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectRow: (rowData) => {
      event.preventDefault()
      // console.info('selected: ', rowData);
      browserHistory.push("/faucets/" + rowData.name)
    }
  }
}

const MeshPointTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeshPointTable)

export default MeshPointTableContainer
