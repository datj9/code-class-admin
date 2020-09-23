import { combineReducers } from "redux";
import article from "./articles/reducer";
import user from "./user/reducer";
import tracking from "./trackings/reducer";

export default combineReducers({
    article,
    user,
    tracking,
});
