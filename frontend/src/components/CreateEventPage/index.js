import "./CreateEventPage.css"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as eventActions from "../../store/events";
import { Redirect, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default () => {
    const {groupId} = useParams()
    const modal = true
    const history = useHistory()
    const dispatch = useDispatch()
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [errors, setErrors] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('In person')
    const [price, setPrice] =useState(0)
    const [capacity, setCapacity] = useState(1)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])


    useEffect(() => {
        const validationErrors = []

        if(!name) validationErrors.push("Event name is required")
        if(name && name.length < 5 || name.length > 60) validationErrors.push("Event name must be between 5 and 60 characters")
        if(!description) validationErrors.push("Event description is required")
        if(description && description.length < 50 || description.length > 50000) validationErrors.push("Event description must be between 50 and 50,000 characters")
        if(capacity <= 0) validationErrors.push("Capacity must be a positive number.")
        if(price < 0) validationErrors.push("Price cannot be negative.")
        if(new Date() - new Date(startDate.replaceAll('-', '/')) > 86400000) validationErrors.push("Start date cannot be in the past.")
        if(new Date(endDate.replaceAll('-', '/')) - new Date(startDate.replaceAll('-', '/')) < 0) validationErrors.push("End date cannot be before the start date.")
        // console.log(new Date() - new Date(startDate.replaceAll('-', '/')))
        //console.log(new Date(endDate.replaceAll('-', '/')) - new Date(startDate.replaceAll('-', '/')))
        setErrors(validationErrors)
    },[name, description, type, startDate, endDate, capacity, price])

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true)
        const newEvent = {
            venueId: 1,
            name,
            description,
            price,
            type,
            capacity,
            startDate: new Date(startDate).toISOString().slice(0, 19).replace('T', ' '),
            endDate: new Date(endDate).toISOString().slice(0, 19).replace('T', ' ')
        }

        const options = {body: JSON.stringify(newEvent), groupId}
        if(errors.length > 0) return
        const res = dispatch(eventActions.createNewEvent(options))
            .then(<Redirect to="/"/>)
            .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
        if(errors.length === 0) history.push(`/groups/${groupId}`)
        return res
      }

    return(
    <div id='create-event-page' className={modal ? "modal" : undefined}>
        <h1 id="create-event-title" className="modal-content">
            Create a new event:
        </h1>
        <form id="create-event-form" className="modal-content" onSubmit={handleSubmit}>
            <label>Event name: <input value={name} onChange={e => setName(e.target.value)}/></label>
            <label>Type:
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option>In person</option>
                    <option>Online</option>
                </select>
            </label>
            <label>Capacity: <input value={capacity} type="number" onChange={e => setCapacity(e.target.value)}/></label>
            <label>Price: <input value={price} type="number" onChange={e => setPrice(e.target.value)}/></label>
            <label>Start date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/></label>
            <label>End date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/></label>
            <label className="left">Description: </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}/>
            {hasSubmitted && <ul className="modal-content" id="error-list">
                {
                    errors.map((error, i) => {
                        return (
                            <li key={i}>{error}</li>
                        )
                    })
                }
            </ul>}
            <input type="submit" value="Submit" id="new-event-submit"/>
        </form>
    </div>
)}
