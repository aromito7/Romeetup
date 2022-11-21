import "./showEvent.css"
import { useParams, useHistory, Redirect } from "react-router-dom"
import { getEvent, deleteEvent } from "../../store/events"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = useParams().eventId

    useEffect(() => {
        dispatch(getEvent(id)).then(res => res)
    }, [dispatch])

    const onClickDelete = async() => {
        dispatch(deleteEvent(id)).then(history.push("/find"))
    }

    const redirectToGroup = (groupId) => {
        history.push(`/groups/${groupId}`)
    }

    const event = useSelector(state => state.events.event)
    const currentUser = useSelector(state => state.session.user) || {id: -1}
    // console.log("Event: ")
    // console.log(event)
    if(!event) return
    // console.log(currentUser)
    // console.log(`${event.Group.organizerId} ${currentUser.id}`)
    const FooterButtons = () => (currentUser.id === event.Group.organizerId ? (
        <>
            <button onClick={onClickDelete} id="show-event-delete-button">Delete Event</button>
        </>
    ):(false &&
        <>
            <button>Attend</button>
        </>
    ))
    return(
        <div id="show-event">
            <div id="event-title-container">
                <div id="event-title">
                    <h1>{event.name}</h1>
                    <div id="event-host">
                        <i className="fa-solid fa-user fa-4x"/>
                        <div id="hosted-by">
                            <p>Hosted By:</p>
                            <p id="host-name">{`${event.Group.User.firstName} ${event.Group.User.lastName}`}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="event-details-container">
                <div id="event-details">
                    <div id="show-event-left">
                        <img src={event.EventImages[0] ? event.EventImages[0].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}/>
                        <h2>Details:</h2>
                        <p>{event.description}</p>
                    </div>
                    <div id="show-event-right">
                        <div id="event-group-container" onClick={() => history.push(`/groups/${event.Group.id}`)}>
                            <img src={event.Group.previewImage}/>
                            <div id="event-group-details">
                                <p id="event-group-name">{event.Group.name}</p>
                                <p id="event-group-private">{event.Group.private ? "Private" : "Public"} Group</p>
                            </div>
                        </div>
                        <div id="right-event-details">
                            <i className="fa-solid fa-clock fa-lg"></i>
                            <div id="event-details-date">
                                <p id="dates">{(event.startDate ? event.startDate : Date()).split('T')[0] + " to " + (event.endDate ? event.endDate : Date()).split('T')[0]}</p>
                            </div>
                            <i className="fa-solid fa-location-dot fa-lg"></i>
                            <div id="event-details-venue">
                                <p id="event-details-venue-name">{event.Venue.address}</p>
                                <p id="event-details-venue-address">{event.Venue.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="event-options-container">
                <div id="event-options">
                    <div id="reminder">
                        <p>{(event.startDate ? event.startDate : Date())
                                .match(/^\w{3} \w{3} \d{1,2} \d{4}/)}</p>
                        <p>{event.name}</p>
                    </div>
                    <FooterButtons/>
                </div>
            </div>
        </div>
    )
}
