import { useDispatch, useSelector } from "react-redux"
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";
import './FindPage.css'
import { NavLink, Switch, Route, useHistory} from "react-router-dom";
import { useEffect, useState } from "react";
import onlineLogo from '../../images/onlineEvent.png'

const FindPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const times = ["Any day", "Starting soon", "Today", "Tomorrow", "This week", "This weekend", "Next week", "Custom"]
    const types = ["Any type", "Online", "In person", "Indoor", "Outdoor"]
    const distances = ["Any distance", "2 miles", "5 miles", "10 miles", "25 miles", "50 miles", "100 miles"]
    const categories = ["Any category", "New group", "Arts & Culture", "Career & Business", "Community & Environment", "Dancing", "Games", "Health & Wellbeing", "Hobbies & Passions", "Identity & Language", "Movement & Politics", "Music", "Parents & Family", "Pets & Animals", "Religion & Spirituality", "Science & Education", "Social Activities", "Sports & Fitness", "Support & Coaching", "Technology", "Travel & Outdoor", "Writing"]
    const sortBys = ["Relevance", "Date"]

    const [sortBy, setSortBy] = useState()


    // const getEvent = (id) => {
    //     return () => history.push("/events/" + id)
    // }
    // const getGroup = (e) => {
    //     history.push("/")
    // }

    // if(useSelector(state => state.events.events.length < 1)) dispatch(eventActions.searchEvents()).then(() => 1 + 1);
    // const events = useSelector(state => state.events.events)

    // if(useSelector(state => state.groups.groups.length < 1)) dispatch(groupActions.searchGroups()).then(() => 1 + 1);
    // const groups = useSelector(state => state.groups.groups)


    useEffect(() => {
        dispatch(eventActions.searchEvents()).then(() => 1 + 1);
        dispatch(groupActions.searchGroups()).then(() => 1 + 1);
    }, [dispatch])

    const events = useSelector(state => state.events.events)
    const groups = useSelector(state => state.groups.groups)

    if(events.length < 1 || groups.length < 1) return
    return (
    <div id="search-page">
        <div id="events-groups-toggle">
            <NavLink exact to="/find" className="toggle" activeStyle={{color: '#008294', textDecoration: "underline"}}>
                Events
            </NavLink>
            <NavLink to="/find/groups" className="toggle" activeStyle={{color: '#008294', textDecoration: "underline"}}>
                Groups
            </NavLink>
        </div>
            <Switch>
                <Route exact path="/find">
                <div id="results">
                    <div id="location">
                        <div id="city-state">
                            Events Near Pittsburgh, PA
                        </div>
                        <div id="location-options">
                            <select id="event-times" className={document.getElementById("event-times") === "Any time" ? "default" : "different" }>{times.map((time, i) => (<option key={i
                            }>{time}</option>))}</select>
                            <select id="event-types">{types.map((type, i) => (<option key={i}>{type}</option>))}</select>
                            <select id="event-distances">{distances.map((distance, i) => (<option key={i}>{distance}</option>))}</select>
                            <select id="event-categories">{categories.map((category, i) => (<option key={i}>{category}</option>))}</select>
                            Sort by: <select id="event-sort">{sortBys.map((sort, i) => (<option key={i}>{sort}</option>))}</select>
                        </div>
                    </div>
                    {
                    events.map((event, i) => {
                        return(
                            <div className="result" key={i} onClick={() => history.push("/events/" + event.id)}>
                                <div id="find-event-result-image-container">
                                    {event.type === 'Online' && <div className="online-logo">
                                        <img alt={`${event.name}-online`} className='online-logo' src={onlineLogo}/>
                                    </div>}
                                    <img className="event-preview-image" alt={`${event.name}`} src={event.EventImages[0] ? event.EventImages[0].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}/>
                                </div>
                                <div className="event-details-card">
                                    <p id="event-result-details-date">
                                        {event.startDate ? event.startDate.split('T')[0] : ''}
                                    </p>
                                    <p id="event-result-details-name">
                                        {`${event.name} - ${event.type}`}
                                    </p>
                                    <p>
                                        {event.Group.name}
                                    </p>
                                    <p>
                                        {event.type === "Online" ? "Online" : `${event.Venue.city}, ${event.Venue.state}`}
                                    </p>
                                    <p>
                                        {event.startDate}
                                    </p>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
                </Route>
                <Route path="/find/groups">
                <div id="results">
                <div id="location">
                        <div id="city-state">
                            Friend groups near Pittsburgh, PA
                        </div>
                        <div id="location-options">
                            <select id="event-distances">{distances.map((distance, i) => (<option key={i}>{distance}</option>))}</select>
                            <select id="event-categories">{categories.map((category, i) => (<option key={i}>{category}</option>))}</select>
                        </div>
                    </div>
                    {
                    groups.map((group, i) => {
                        return(
                            <div className="result" key={i} onClick={() => history.push("/groups/" + group.id)}>
                                <div id="find-group-result-image-container">
                                    <img alt={`${group.name}`} src={group.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}/>
                                </div>
                                <div>
                                    <p id="group-result-name">
                                        {`${group.name}`}
                                    </p>
                                    <p id="group-result-location">
                                        {group.type === "In person" ? `${group.city}, ${group.state}` : "Online group"}
                                    </p>
                                    <p id="group-result-description">
                                        {group.about?.length > 125 ? group.about.slice(0, 125) + "..." : group.about}
                                    </p>
                                    <p>
                                        {group.numMembers || 1} members &#x2022; {group.private ? "Private" : "Public"}
                                    </p>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
                </Route>
            </Switch>
        </div>
)}


export default FindPage;
