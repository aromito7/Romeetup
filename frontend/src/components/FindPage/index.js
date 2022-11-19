import { useDispatch, useSelector } from "react-redux"
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";
import './FindPage.css'
import { NavLink, Switch, Route, useHistory} from "react-router-dom";
import { useEffect, useState } from "react";

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
                            <select id="event-times" className={document.getElementById("event-times") === "Any time" ? "default" : "different" }>{times.map(time => (<option>{time}</option>))}</select>
                            <select id="event-types">{types.map(type => (<option>{type}</option>))}</select>
                            <select id="event-distances">{distances.map(distance => (<option>{distance}</option>))}</select>
                            <select id="event-categories">{categories.map(category => (<option>{category}</option>))}</select>
                            Sort by: <select id="event-sort">{sortBys.map(sort => (<option>{sort}</option>))}</select>
                        </div>
                    </div>
                    {
                    events.map((event, i) => {
                        return(
                            <div className="result" key={i} onClick={() => history.push("/events/" + event.id)}>
                                <div>
                                    <img alt={`${event.name}`} src={event.EventImages[0].url}/>
                                </div>
                                <div>
                                    <p>
                                        {event.startDate}
                                    </p>
                                    <p>
                                        {`${event.name} - ${event.type}`}
                                    </p>
                                    <p>
                                        {event.Group.name}
                                    </p>
                                    <p>
                                        {event.Venue.city}, {event.Venue.state}
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
                    <div id="location-options">
                        <div id="location">
                            Events Near Pittsburgh, PA
                        </div>
                        <div id="options">
                            Search Options
                        </div>
                    </div>
                    {
                    groups.map((group, i) => {
                        return(
                            <div className="result" key={i} onClick={() => history.push("/groups/" + group.id)}>
                                <div>
                                    <img alt={`${group.name}`} src={group.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}/>
                                </div>
                                <div>
                                    <p>
                                        {group.type}
                                    </p>
                                    <p>
                                        {`${group.name} - ${group.type}`}
                                    </p>
                                    <p>
                                        Members: {group.numMembers}
                                    </p>
                                    <p>
                                        {group.city}, {group.state}
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
