import "./CreateGroupPage.css"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as groupActions from "../../store/groups";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default () => {
    const modal = true
    const history = useHistory()
    const dispatch = useDispatch()
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [errors, setErrors] = useState([])
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('In person')
    const [isPrivate, setIsPrivate] = useState(false)
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [numMembers, setNumMembers] = useState(1)
    const [previewImage, setPreviewImage] = useState('')


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

        const options = {body: JSON.stringify(newGroup)}
        if(errors.length > 0) return
        const res = dispatch(groupActions.createNewGroup(options))
            .then(<Redirect to="/"/>)
            .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
        if(errors.length === 0) history.push("/find/groups")
        return res
      }

    return(
    <div id='create-group-page' className={modal ? "modal" : undefined}>
        <h1 id="create-group-title" className="modal-content">
            Create a new group:
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
