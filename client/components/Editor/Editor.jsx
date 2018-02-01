
import c from 'classnames'
import Cookies from 'js-cookie'

import React from 'react'
import Header from './Header.jsx'
import Chart from './Chart.jsx'
import SelectedElement from './SelectedElement.jsx'
import Shapes from './Shapes.jsx'
import MetaInfo from './MetaInfo.jsx'
import Lanes from './Lanes.jsx'
import Link from '../common/Link.jsx'

import Export from './sections/Export.jsx'
import Info from './sections/Info.jsx'
import Polyphasic from './sections/polyphasic/Polyphasic.jsx'

import server from '../../server'


export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      napchart: false, // until it is initialized
      loading: false,
      url:window.siteUrl,
      chartid:window.chartid,
      title:window.title || '',
      description:window.description || '',
      currentSection: 0
    }
    console.log(this.state)
  }
// <EditorHeader 
//           onLoading={this.loading} 
//           onLoadingFinish={this.loadingFinish}
//           onSave={this.onSave}
//           loading={this.state.loading}
//           napchart={this.state.napchart}
//           url={this.state.url}
//           chartid={this.state.chartid}
//           title={this.state.title}
//           description={this.state.description} 
//           />
  render () {
    var Controllers = (
      <div>
        <div className="field">
          <Lanes
            napchart={this.state.napchart}
            clickLane={this.setNumberOfLanes}
          />
        </div>
        <div className="field">
          <Shapes napchart={this.state.napchart}/>
        </div>
        <div className="field">
          <SelectedElement napchart={this.state.napchart} />
        </div>
      </div>
    )

    var sections = [
      {
        element: Controllers,
        icon: 'controls',
        text: ''
      },
      {
        element: <Export />,
        icon: 'share',
        text: 'Share and export'
      },
      {
        element: <Info />,
        icon: 'Info',
        text: 'Info'
      },
      {
        element: <Polyphasic />,
        icon: 'Sleep',
        text: 'Polyphasic'
      }
    ]

    var user = this.props.user

    return (
      <div className="Editor">
        <div className="grid">
          <div className="sidebar">
            <Header
                title={this.state.title}
                changeTitle={this.changeTitle}
                chartid={this.state.chartid}
                save={this.save}
            />
            <div className="sidebarContent">
              <div className="sideLane">
                <div className="up">
                  {sections.map((section, i) => 
                    <button  onClick={this.changeSection.bind(null, i)} key={i}
                      className={c("squareBtn", {'is-primary': (i==this.state.currentSection)})}>
                      {section.icon}
                    </button>
                  )}
                </div>
                <div className="down">
                  <Link href="/blog">
                    <button className="squareBtn">
                      Blog
                    </button>
                  </Link>
                  {user &&
                    <Link href="/user">
                      <button className="squareBtn">
                        Hi {user.username}
                      </button>
                    </Link>
                  }
                  {!user &&
                    <Link href="/login">
                      <button className="squareBtn">
                        Login
                      </button>
                    </Link>
                  }
                </div>
                
              </div>

              <div className="otherLane">
                <div className="currentInfo">
                  {sections[this.state.currentSection].element}
                </div>
              </div>
            </div>
            
          </div>

          <div className="main">
            <Chart 
              napchart={this.state.napchart}
              onUpdate={this.somethingUpdate}
              setGlobalNapchart={this.setGlobalNapchart} 
              onLoading={this.loading} onLoadingFinish={this.loadingFinish}
            />
          </div>
        </div>
      </div>
    )
  }

  changeSection = (i) => {
    this.setState({
      currentSection:i
    })
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

  save = () => {
    this.loading()
    var firstTimeSave = !this.props.chartid
    server.save(this.state.napchart.data, this.state.title,
    this.state.description, (chartid) => {
      this.loadingFinish()
      this.onSave(chartid)
      if(firstTimeSave){
      }
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
    // this.setState({
    //   chartid
    // })

    // refresh (feels better for the user)
    window.location = '/' + chartid
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
