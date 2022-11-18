import "./showGroup.css"
import { useParams } from "react-router-dom"
import { getGroup } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default () => {
    const dispatch = useDispatch()
    const id = useParams().groupId


    useEffect(() => {
        dispatch(getGroup(id)).then(res => res)
    }, [dispatch])

    const group = useSelector(state => state.groups.group)
    // console.log("group: ")
    // console.log(group)
    if(!group) return
    return(
        <div id="show-group">
            <div id="group-details">
                <div id="show-group-left">
                    <h1>{group.name}</h1>
                    <img src={group.groupImages[0].url}/>
                    <h2>Hosted By:</h2>
                    <h2>User {group.Group.organizerId}</h2>
                    <h2>Details:</h2>
                    <p>{group.description}</p>
                </div>
                <div id="show-group-right">
                    <div id="event-group">
                        <p>{group.Group.name}</p>
                    </div>
                    <div id="details">
                        <div id="dates">
                            <div className="dates">{(group.startDate ? group.startDate : Date())
                            .match(/^\w{3} \w{3} \d{1,2} \d{4}/)}</div>
                            <div className="dates">{"to " + (group.endDate ? group.endDate : Date())
                            .match(/^\w{3} \w{3} \d{1,2} \d{4}/)}</div>
                        </div>
                        <div id="description">
                            <div>group type: {group.type}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="options">
                <div id="reminder">This is an group reminder</div>
                <button>Join group</button>
                <button>Delete group</button>
            </div>
        </div>
    )
}
