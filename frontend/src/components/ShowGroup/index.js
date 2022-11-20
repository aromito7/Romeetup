import "./showGroup.css"
import { useParams, useHistory, Redirect } from "react-router-dom"
import { getGroup, deleteGroup } from "../../store/groups"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = useParams().groupId
    const currentUser = useSelector(state => state.session.user)
    const userId = currentUser ? currentUser.id : -1

    useEffect(() => {
        dispatch(getGroup(id)).then(res => res)
    }, [dispatch])

    const onClickDelete = async() => {
        dispatch(deleteGroup(id)).then(history.push("/"))
    }

    const onClickEdit = () => {
        <Redirect to="/group/new" group={group}/>
    }

    const group = useSelector(state => state.groups.group)
    // console.log("Group: ")
    // console.log(group)
    if(!group) return "No current group"
    console.log(currentUser, userId, group.organizerId)
    const UserButtons = () => userId === group.organizerId ? (
        <>
            <button className="right-options">Create an event</button>
            <button className="right-options" onClick={onClickEdit}>Edit group</button>
            <button className="right-options" onClick={onClickDelete}>Delete this group</button>
        </>
    ) : <button className="right-options">Join this group</button>

    return(
        <div id="show-group">
            <div id="group-details-container">
                <img src={group.previewImage}/>
                <div id="group-details">
                    <h1>{group.name}</h1>
                    <div class="group-details-top-div">
                        <i className="fa-solid fa-location-dot"/>
                        <p>{group.city ? `${group.city}, ${group.state}`: "Online"}</p>
                    </div>
                    <div class="group-details-top-div">
                        <i className="fa-solid fa-user-group"/>
                        <p>1 Members - {group.private ? "Public" : "Private"}</p>
                    </div>
                    <div class="group-details-top-div">
                        <i className="fa-solid fa-user"/>
                        <p>Organized by <strong>{group.User.firstName} {group.User.lastName}</strong></p>
                    </div>
                    <div id="group-details-bottom-icons">
                        <p>Share: </p>
                        <i className="fa-brands fa-square-facebook"/>
                        <i className="fa-brands fa-twitter"/>
                        <i className="fa-brands fa-linkedin"/>
                        <i className="fa-solid fa-envelope"/>
                    </div>
                </div>
            </div>
            <div id="group-option-bar-container">
                <div id="group-option-bar">
                    <div id="group-option-bar-left">
                        <button>About</button>
                        <button>Events</button>
                        <button>Members</button>
                        <button>Photos</button>
                        <button>Discussions</button>
                        <button>More</button>
                    </div>
                    <div id="group-option-bar-right">
                        <UserButtons/>
                    </div>
                </div>
            </div>
            <div id="group-description-container">
                <div id="group-description">
                    <p>{group.about}</p>
                    <div id="event-group">
                        <p>Organizers</p>
                        <i className="fa-solid fa-user fa-3x"/>
                        <div id="event-host">
                            <p>{group.User.firstName} {group.User.lastName}</p>
                            <p id="message">Message</p>
                        </div>
                    </div>
                    <div id="details">
                    </div>
                </div>
            </div>
        </div>
    )
}
