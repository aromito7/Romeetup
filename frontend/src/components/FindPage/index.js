import { useDispatch, useSelector } from "react-redux"
import * as searchActions from "../../store/search";
import { useEffect } from "react";
import './FindPage.css'
export default () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(searchActions.searchEvents()).then(() => 1 + 1);
      }, [dispatch]);

    const events = useSelector(state => state.search.events)
    return (
    <div id="search-page">
        <ul id="results">
            {
                events.map((event, i) => {
                    return(
                        <li key={i}>
                            <p>
                                {event.startDate}
                            </p>
                            <p>
                                {`${event.name} - ${event.type}`}
                            </p>
                            <p>
                                {event.Group.name}
                            </p>
                        </li>
                    )
                })
            }
        </ul>
    </div>
)}
