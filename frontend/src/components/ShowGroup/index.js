import "./showGroup.css"
import { useParams, useHistory } from "react-router-dom"
import { getGroup, deleteGroup } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = useParams().groupId


    useEffect(() => {
        dispatch(getGroup(id)).then(res => res)
    }, [dispatch])

    const onClickDelete = async() => {
        await dispatch(deleteGroup(id).then(res=> res))
        history.push('/find/groups')
    }

    const group = useSelector(state => state.groups.group)
    // console.log("Group: ")
    // console.log(group)
    if(!group) return "No current group"
    return(
        <div id="show-group">
            <div id="group-details">
                <div id="show-group-left">
                    <h1>{group.name}</h1>
                    <img src={group.previewImage}/>
                    <h2>Hosted By:</h2>
                    <h2>User {group.organizerId}</h2>
                    <h2>Details:</h2>
                    <p>{group.about}</p>
                </div>
                <div id="show-group-right">
                    <div id="event-group">
                        <p>Hello, Text</p>
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
                <button onClick={onClickDelete}>Delete group</button>
            </div>
        </div>
    )
}
