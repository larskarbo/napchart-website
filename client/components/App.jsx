
import update from 'react-addons-update'
import fetch from 'whatwg-fetch'
import Responsive from 'react-responsive'
import classNames from 'classnames'
import Cookies from 'js-cookie'

import React from 'react'
import Header from './Header.jsx'
import Chart from './Chart.jsx'
import SelectedElement from './SelectedElement.jsx'
import Shapes from './Shapes.jsx'
import MetaInfo from './MetaInfo.jsx'
import InfoColumn from './InfoColumn.jsx'
import Lanes from './Lanes.jsx'

import styles from '../styles/index.scss'

const Desktop = props => <Responsive {...props} minWidth={500} />;
const Mobile = props => <Responsive {...props} maxWidth={500} />;

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      napchart: false, // until it is initialized
      loading: false,
      addOns: {
        polyphasic: eval(Cookies.get('polyphasic')) || false
      },
      url:window.siteUrl,
      chartid:window.chartid,
      title:window.title || '',
      description:window.description || '',
    }
    console.log(this.state)
  }
// <p>It is useful for creating full-fledged complex schedules, but can also be used
//               for simple things like calculating durations and spaces quickly.
//               </p>
  render () {
    return (
      <div>

        <Header 
          onLoading={this.loading} 
          onLoadingFinish={this.loadingFinish}
          onSave={this.onSave}
          loading={this.state.loading}
          napchart={this.state.napchart}
          addOns={this.state.addOns}
          changeAddOn={this.changeAddOn}
          url={this.state.url}
          chartid={this.state.chartid}
          title={this.state.title}
          description={this.state.description} 
          />
        
        <div className={classNames('grid', {loading: this.state.loading})}>
          <Desktop>
            <div className='column left'>
              <MetaInfo
                title={this.state.title}
                description={this.state.description} 
                changeTitle={this.changeTitle}
                changeDescription={this.changeDescription}
              />
              <Shapes napchart={this.state.napchart}/>
              <Lanes
                napchart={this.state.napchart}
                clickLane={this.setNumberOfLanes}
              />
              <SelectedElement napchart={this.state.napchart} />
            </div>
          </Desktop>
          
          <div className={classNames('mainChartArea')}>
            <Chart 
              napchart={this.state.napchart}
              onUpdate={this.somethingUpdate}
              setGlobalNapchart={this.setGlobalNapchart} 
              onLoading={this.loading} onLoadingFinish={this.loadingFinish}
            />
          </div>

          

          <InfoColumn
            napchart={this.state.napchart}
            addOns={this.state.addOns} />
        </div>

        

      </div>
    )
  }

  setGlobalNapchart = (napchart) => {
    this.setState({
      napchart: napchart
    })
  }

  somethingUpdate = (napchart) => {
    this.forceUpdate()
  }

  loadingFinish = () => {
    this.setState({
      loading: false
    })
  }

  loading = () => {
    this.setState({
      loading: true
    })
  }

  changeAddOn = (event) => {
    var name = event.target.name
    var bool = event.target.checked
    var addOns = {
      ...this.state.addOns,
      [name]: bool
    }
    console.log(name, bool)
    Cookies.set(name, bool)
    this.setState({
      addOns
    })
  }

  onSave = (chartid) => {
    this.setState({
      chartid
    })
  }

  changeTitle = event => {
    this.setState({
      title: event.target.value
    })
  }

  changeDescription = event => {
    this.setState({
      description: event.target.value
    })
  }

  setNumberOfLanes = (lanes) => {
    console.log(lanes)
    this.state.napchart.setNumberOfLanes(lanes)
  }
}
