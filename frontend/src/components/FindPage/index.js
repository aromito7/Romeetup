import { useDispatch, useSelector } from "react-redux"
import * as searchActions from "../../store/search";
import { useEffect } from "react";
import './FindPage.css'
import { NavLink } from "react-router-dom";
export default () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(searchActions.searchEvents()).then(() => 1 + 1);
      }, [dispatch]);

    const events = useSelector(state => state.search.events)
    return (
    <div id="search-page">
        <div id="events-groups-toggle">

            <NavLink to="/find/events" className="toggle" activeStyle={{color: '#00cce4'}}>
                Events
            </NavLink>
            <NavLink to="/find/groups" className="toggle" activeStyle={{color: '#00cce4'}}>
                Groups
            </NavLink>
        </div>
        <div id="results">
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
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
)}
