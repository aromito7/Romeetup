import { useDispatch, useSelector } from "react-redux"
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";
import './FindPage.css'
import { NavLink, Switch, Route } from "react-router-dom";
export default () => {
    const dispatch = useDispatch()

    if(useSelector(state => state.events.events.length < 1)) dispatch(eventActions.searchEvents()).then(() => 1 + 1);
    const events = useSelector(state => state.events.events)

    if(useSelector(state => state.groups.groups.length < 1)) dispatch(groupActions.searchGroups()).then(() => 1 + 1);
    const groups = useSelector(state => state.groups.groups)
    return (
    <div id="search-page">
        <div id="events-groups-toggle">

            <NavLink exact to="/find" className="toggle" activeStyle={{color: '#00cce4'}}>
                Events
            </NavLink>
            <NavLink to="/find/groups" className="toggle" activeStyle={{color: '#00cce4'}}>
                Groups
            </NavLink>
        </div>
        <div id="results">
            <Switch>
                <Route exact path="/find">
                {
                events.map((event, i) => {
                    return(
                        <div className="result">
                            <div>
                                <img src={event.EventImages[0].url}/>
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
                </Route>
                <Route path="/find/groups">
                {
                groups.map((group, i) => {
                    return(
                        <div className="result">
                            <div>
                                <img src={group.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}/>
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
                </Route>
            </Switch>
        </div>
    </div>
)}
