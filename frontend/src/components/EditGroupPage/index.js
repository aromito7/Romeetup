import "./EditGroupPage.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupActions from "../../store/groups";
import { Redirect, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getGroup, deleteGroup } from "../../store/groups"

export default () => {
    const currentUser = useSelector(state => state.session.user)
    const {groupId} = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    // const currentState = useSelector(state => state)
    // console.log("state")
    // console.log(currentState)
    useEffect(() => {
        dispatch(getGroup(groupId)).then(1 + 1)
    }, [dispatch])
    const group = useSelector(state => state.groups.group) || {}
    const user = useSelector(state => state.session.user)

    if(!group) history.push(`/groups/${groupId}`)
    //if(user && user.id !== group.organizerId) history.push(`/groups/${groupId}`)

    const modal = true
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [errors, setErrors] = useState([])
    const [name, setName] = useState(group.name || '')
    const [about, setAbout] = useState(group.about || '')
    const [type, setType] = useState(group.type || "In person")
    const [isPrivate, setIsPrivate] = useState(group.private || true)
    const [city, setCity] = useState(group.city || "")
    const [state, setState] = useState(group.state || "")
    const [numMembers, setNumMembers] = useState(group.numMembers || 1)
    const [previewImage, setPreviewImage] = useState(group.previewImage || "")


    useEffect(() => {
        const validationErrors = []

        if(!name) validationErrors.push("Group name is required")
        if(name && name.length < 5 || name.length > 60) validationErrors.push("Group name must be between 5 and 60 characters")
        if(type === "In person" && !city) validationErrors.push("City is required for In person groups.")
        if(type === "In person" && !state) validationErrors.push("Sate is required for In person groups.")
        if(!about) validationErrors.push("Group description is required")
        if(about && about.length < 50 || about.length > 50000) validationErrors.push("Group description must be between 50 and 50,000 characters")



        setErrors(validationErrors)
    },[name, about, type, city, state])

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true)
        const newGroup = {
            organizerId: 1,
            name,
            about,
            type,
            private: isPrivate,
            city,
            state,
            previewImage
        }

        const options = {body: JSON.stringify(newGroup), groupId:group.id}
        if(errors.length > 0) return
        const res = dispatch(groupActions.editCurrentGroup(options))
            .then(<Redirect to="/"/>)
            .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
        if(errors.length === 0) history.push(`/groups/${groupId}`)
        return res
      }
    return(
    <div id='create-group-page' className={modal ? "modal" : undefined}>
        <h1 id="create-group-title" className="modal-content">
            Edit your group:
        </h1>
        <form id="create-group-form" className="modal-content" onSubmit={handleSubmit}>
            <label>Group name: <input value={name} onChange={e => setName(e.target.value)}/></label>
            <label>Type:
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option>In person</option>
                    <option>Online</option>
                </select>
            </label>
            <label>Private:
                <input type="checkbox" value={isPrivate} id="private" onChange={e => setIsPrivate(e.target.value)}/>
            </label>
            <label>City: <input value={city} onChange={e => setCity(e.target.value)}/></label>
            <label>State <input value={state} onChange={e => setState(e.target.value)}/></label>
            {false && <label>Current members: <input value={numMembers} onChange={e => setNumMembers(e.target.value)}/></label>}
            <label>Preview image: <input value={previewImage} onChange={e => setPreviewImage(e.target.value)}/></label>
            <label className="left">Description: </label>
            <textarea value={about} onChange={e => setAbout(e.target.value)}/>
            {hasSubmitted && <ul className="modal-content" id="error-list">
                {
                    errors.map((error, i) => {
                        return (
                            <li key={i}>{error}</li>
                        )
                    })
                }
            </ul>}
            <input type="submit" value="Submit" id="new-group-submit"/>
        </form>
    </div>
)}
