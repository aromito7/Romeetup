import { Redirect } from "react-router-dom";
import * as sessionActions from "../store/session";
import { useDispatch } from "react-redux";

export default () => {
    const dispatch = useDispatch()
    dispatch(sessionActions.logout())
    return(
        <Redirect to="/"/>
    )
}
