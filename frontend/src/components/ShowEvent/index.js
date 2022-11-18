import "./showEvent.css"
import { useParams } from "react-router-dom"
import { getEvent } from "../../store/events"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default () => {
    const dispatch = useDispatch()
    const id = useParams().eventId


    useEffect(() => {
        dispatch(getEvent(id)).then(res => res)
    }, [dispatch])

    const event = useSelector(state => state.events.event)
    // console.log("Event: ")
    // console.log(event)
    if(!event) return
    return(
        <div id="show-event">
            <div id="event-details">
                <div id="show-event-left">
                    <h1>{event.name}</h1>
                    <img src={event.EventImages[0].url}/>
                    <h2>Hosted By:</h2>
                    <h2>User {event.Group.organizerId}</h2>
                    <h2>Details:</h2>
                    <p>{event.description}</p>
                </div>
                <div id="show-event-right">
                    <div id="event-group">
                        <p>{event.Group.name}</p>
                    </div>
                    <div id="details">
                        <div id="dates">
                            <div className="dates">{(event.startDate ? event.startDate : Date())
                            .match(/^\w{3} \w{3} \d{1,2} \d{4}/)}</div>
                            <div className="dates">{"to " + (event.endDate ? event.endDate : Date())
                            .match(/^\w{3} \w{3} \d{1,2} \d{4}/)}</div>
                        </div>
                        <div id="description">
                            <div>Event type: {event.type}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="options">
                <div id="reminder">This is an event reminder</div>
                <button>Join Event</button>
                <button>Delete Event</button>
            </div>
        </div>
    )
}
