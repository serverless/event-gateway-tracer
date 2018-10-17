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
      eventIDs: [],
      timelineElements: [], // Timeline Elements
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
    // setInterval(this.fetchEvents, 1000)
  }

  /*
  * Fetch Events
  */

  // TODO: Queries via date
  // TODO: Pagination via DynamoDB

  fetchEvents = () => {

    const self = this

    fetch('https://nsa965npg3.execute-api.us-east-1.amazonaws.com/dev/events',
    {
      method: 'GET',
    })
      .then(response => response.json())
      .then((data) => {

        const newEventIDs = []
        const newTimelineElements = []

        data.forEach((evt) => {

          // If for whatever reason we've processed this event already, skip it.
          if (self.state.eventIDs.indexOf(evt.eventID) >= 0) return
          // If not, add event ID to eventIDs array
          else newEventIDs.push(evt.eventID)

          // Ensure a timelineElement item exists
          if (!this.state.timelineElements[evt.eventID]) {
            this.state.timelineElements[evt.eventID] = {
              event: {},
              sinks: [{}],
              view: {},
            }
          }
          let timelineElement = this.state.timelineElements[evt.eventID]

          if (evt.eventType == 'eventgateway.function.invoked') {
            timelineElement.functions.push(evt)
          }

          // Handle by event type
          // switch(evt.eventType) {
          //   case 'eventgateway.event.received':
          //     break
          //   case 'eventgateway.function.invoking':
          //     break
          //   case 'eventgateway.function.invoked':
          //
          //     newTimelineElements.push(
          //       <VerticalTimelineElement
          //         key={evt.eventID}
          //         icon={<img className='icon-bolt' src={imgBolt} />}
          //       >
          //         <div className='vertical-timeline-element-function'>
          //           <p className="vertical-timeline-element-title">{evt.data.functionId}</p>
          //         </div>
          //       </VerticalTimelineElement>
          //     )
          //
          //     break
          //   case 'eventgateway.function.invocationFailed':
          //     break
          //   default:
          //
          //     newTimelineElements.push(
          //       <VerticalTimelineElement
          //         key={evt.eventID}
          //         icon={<img className='icon-bolt' src={imgBolt} />}
          //       >
          //         <div className='vertical-timeline-element-event' onClick={() => this.clickEvent(evt)}>
          //           <p className="event-title">{evt.eventType}</p>
          //           <p className="event-time">October 14th, 2018 @ 10:03:01</p>
          //         </div>
          //       </VerticalTimelineElement>
          //     )
          //     break
          // }
        })

        data.forEach((evt) => {
          
        })

        this.setState({
          timelineElements: self.state.timelineElements.concat(newTimelineElements)
        })
      })
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
              <VerticalTimeline layout="1-column">{this.state.timelineElements}</VerticalTimeline>
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
