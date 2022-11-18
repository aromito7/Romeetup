import "./CreateGroupPage.css"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as groupActions from "../../store/groups";

export default () => {
    const modal = true

    const dispatch = useDispatch()
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [errors, setErrors] = useState([])
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [numMembers, setNumMembers] = useState(1)
    const [previewImage, setPreviewImage] = useState('')


    useEffect(() => {
        const validationErrors = []

        if(!name) validationErrors.push("Group name is required")
        if(name && name.length < 5 || name.length > 60) validationErrors.push("Group name must be between 5 and 60 characters")
        if(!about) validationErrors.push("Group description is required")
        if(about && about.length < 50 || about.length > 50000) validationErrors.push("Group description must be between 50 and 50,000 characters")



        setErrors(validationErrors)
    },[name, about])

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
            members: numMembers,
            previewImage
        }

        const options = {body: JSON.stringify(newGroup)}
        // console.log("Create group page:")
        // console.log(options)
        const res = dispatch(groupActions.createNewGroup(options))
            .then((res) => res)
            .catch(async (res) => {
            console.log(res)
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
        console.log(res)
        return res
      }

    return(
    <div id='create-group-page' className={modal ? "modal" : undefined}>
        <h1 id="create-group-title" class="modal-content">
            Create a new group:
        </h1>
        <form id="create-group-form" class="modal-content" onSubmit={handleSubmit}>
            <label>Group name: <input value={name} onChange={e => setName(e.target.value)}/></label>
            <label>Description: <input value={about} onChange={e => setAbout(e.target.value)}/></label>
            <label>Type:
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="In person" selected={type==="In person"}>In person</option>
                    <option value="Online" selected={type==="Online"}>Online</option>
                </select>
            </label>
            <label>Private:
                <input type="checkbox" value={isPrivate} id="private" onChange={e => setIsPrivate(e.target.value)}/>
            </label>
            <label>City: <input value={city} onChange={e => setCity(e.target.value)}/></label>
            <label>State <input value={state} onChange={e => setState(e.target.value)}/></label>
            <label>Current members: <input value={numMembers} onChange={e => setNumMembers(e.target.value)}/></label>
            <label>Preview image: <input value={previewImage} onChange={e => setPreviewImage(e.target.value)}/></label>
            <input type="submit" value="Submit"/>
        </form>
        <ul class="modal-content" id="error-list">
            {
                errors.map(error => {
                    return (
                        <li>{error}</li>
                    )
                })
            }
        </ul>
    </div>
)}
