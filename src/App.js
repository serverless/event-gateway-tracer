import React, { Component } from 'react'
import { connect } from 'react-redux'
import { init } from './actions/init'

import imgLogo from './assets/icon-event-gateway.svg'
import imgBolt from './assets/icon-bolt.svg'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import JSONPretty from 'react-json-pretty'

/*
* App Component
*/

class App extends Component {

  /*
  * Constructor
  */

  constructor(props) {
    super(props)

    this.state = {
      event: {},
      events: [],
      active: {
        settings: false,
      }
    }
  }

  /*
  * Component Did Mount
  */

  componentDidMount() {
    this.fetchEvents()
    setInterval(this.fetchEvents, 6000)
  }

  /*
  * Fetch Events
  */

  fetchEvents = () => {

    const events = [{
      eventID: Math.random().toString(36).substr(2, 5),
      eventTime: '2018-04-05T17:31:00Z',
      eventType: 'com.red.air.unicorn.flight.trigger.update',
      source: '/flight-information-service',
      data: {
        foo: 'bar',
        fixx: 'buzz',
        blah: 'boo',
        a: 'b',
        b: 1233,
        c: ["hi", 123, {
          hello: 'there'
        }]
      }
    }]

    events.forEach((evt) => {

      this.state.events.push(
        <VerticalTimelineElement
          key={evt.eventID}
          icon={<img className='icon-bolt' src={imgBolt} />}
        >
          <div className='vertical-timeline-element-inner' onClick={() => this.clickEvent(evt)}>
            <p className="vertical-timeline-element-title">{evt.eventType}</p>
            <p className="vertical-timeline-element-time">October 14th, 2018 @ 10:03:01</p>
            <p className="vertical-timeline-element-source">/flight-information-service</p>
          </div>
        </VerticalTimelineElement>
      )
    })

    this.setState(this.state)
  }

  /*
  * Click Event
  */

  clickEvent(evt) {
    this.setState({
      event: evt
    })
  }

  /*
  * Click Settings
  */

  clickSettings() {
    this.setState({
      active: {
        settings: !this.state.active.settings
      }
    })
  }

  /*
  * Render
  */

  render() {

     let settings
    return (
      <div>

        <div className="content center">

          <div className="nav-wrapper">

            <div className='nav-items'>
              <div
                className='nav-item'
                onClick={() => this.clickSettings()}
              >
                <img className='icon-event-gateway' src={imgLogo} alt="Event Gateway Icon" />
              </div>
              <div>
              </div>
              <div>
              </div>
           </div>

           <div
            className={`${this.state.active.settings ? 'settings-wrapper' : 'settings-wrapper-hidden'}`}
            >
               <div className='settings'>
                 <p>Settings (Coming Soon)</p>
               </div>
            </div>
          </div>

          <div className='event-preview-wrapper'>
            <div
              className='event-preview'
              style={{ opacity: this.state.event.eventID !== undefined ? 1 : 0 }}
            >
              <p className='event-preview-type'>{this.state.event.eventType}</p>
              <p className='event-preview-time'>{this.state.event.eventTime}</p>
              <p className='event-preview-id'>{this.state.event.eventID}</p>
              <p className='event-preview-source'>{this.state.event.source}</p>

              <div className='event-preview-payload-wrapper'>
                <div className='event-preview-payload'>
                  <JSONPretty id="json-pretty" json={this.state.event.data}></JSONPretty>
                </div>
              </div>

            </div>
          </div>


          <div className='row'>
            <div className='column column-8'></div>

            <div className='column column-40 timeline-wrapper'>
              <VerticalTimeline layout="1-column">{this.state.events}</VerticalTimeline>
            </div>

            <div className='column column-52'></div>
          </div>


        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({})
const actions = { init }
export default connect(mapStateToProps, actions)(App)
