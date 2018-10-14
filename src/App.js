import React, { Component } from 'react'
import { connect } from 'react-redux'
import { init } from './actions/init'
import vis from 'vis'
import imgLogo from './assets/logo.png'
import imgHero from './assets/hero.png'

class App extends Component {
  constructor(props) {
    super(props)

    // Defaults
    this.flow = {}

    // Init
    this.props.init()
  }

  drawChart(nodes) {

    const renderNodes = (nodes) => {
      nodes.forEach((n) => {
        n.shape = 'box'
        n.shapeProperties = {}
        n.shapeProperties.borderRadius = 2
        n.color = {}
        n.color.background = n.label.includes('heathrow') ? '#ff6b6b' : '#6b9aff'
        n.margin = 20
        // n.fixed = { x: true, y: true }
      })
      return new vis.DataSet(nodes)
    }
  }

  componentDidMount() {

    const nodes = new vis.DataSet([])
    const edges = new vis.DataSet([])
    const data = { nodes: nodes, edges: edges }

    const network =  new vis.Network(
      document.getElementsByClassName('network')[0],
      data,
      {
        autoResize: true,
        interaction: {
          dragNodes: true,
          selectConnectedEdges: false
        },
        layout:{
          randomSeed: 1,
          improvedLayout: true,
          hierarchical: {
            enabled: true,
            levelSeparation: 100,
          }
        },
        edges: {
          arrows: 'to',
          shadow: false,
          smooth: true,
        },
        nodes: {
          shape: 'box',
          borderWidth: 2,
          size: 30,
          mass: 2,
          margin: 20,
          color: {
            border: '#000000',
          },
          font: {
            color:'#000000',
            size: 18,
          },
          shapeProperties: {
            useBorderWithImage:true
          }
        },
        physics:{
          enabled: false,
          maxVelocity: 10,
          minVelocity: 1,
          solver: 'forceAtlas2Based',
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 50,
            onlyDynamicEdges: false,
            fit: true
          },
          timestep: 1,
          adaptiveTimestep: true
        }
      }
    )

    /*
    * Timeline
    */

    // const timelineData = new vis.DataSet([
    //   {id: 1, content: 'item 1', start: '2014-04-20'},
    //   {id: 2, content: 'item 2', start: '2014-04-14'},
    //   {id: 3, content: 'item 3', start: '2014-04-18'},
    //   {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    //   {id: 5, content: 'item 5', start: '2014-04-25'},
    //   {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'},
    // ])
    // const timeline = new vis.Timeline(
    //   document.getElementsByClassName('timeline')[0],
    //   timelineData,
    //   {}
    // )

    /*
    * Add Data
    */

    const events = [
      { id: 1, label: 'com.red.heathrow.trigger.update' },
      { id: 2, label: 'com.red.heathrow.flight.delay' },
      { id: 3, label: 'com.red.heathrow.gate.updated' },
      { id: 4, label: 'com.red.heathrow.flight.arriving' },
      { id: 5, label: 'com.red.air.unicorn.flight.delay' },
      { id: 6, label: 'com.red.air.unicorn.flight.trigger.update' },
    ]
    const eventConnections = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 2, to: 5 },
      { from: 5, to: 6 },
    ]

    const self = this
    let id = 0

    const addData = () => {
      id++

      events.forEach((e) => {
        if (e.id == id) {
          e.color = {}
          e.color.background = e.label.includes('heathrow') ? '#ff6b6b' : '#6b9aff'
          nodes.add([e])
        }
      })

      eventConnections.forEach((e) => {
        if (e.from == id) {
          edges.add([e])
        }
      })
    }

    setInterval(addData, 2000)
  }

  render() {
    return (
      <div>
        <div className="nav center">
          <div className="nav-left">
            <span className="logo-small">
            </span>
            RED - Tracing
          </div>
        </div>
        <div className="content center">
          <div className="section center">
            <div className="network"></div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({})
const actions = { init }
export default connect(mapStateToProps, actions)(App)
