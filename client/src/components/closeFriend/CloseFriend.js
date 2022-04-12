import { Link } from "react-router-dom";
import "./closeFriend.css";

export default function CloseFriend({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <li className="sidebarFriend">
            <img className="sidebarFriendImg" src=
                {
                    user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                } alt="" />
            <span className="sidebarFriendName">{user.username}</span>
            <span style={{display:"flex", justifyContent:"flex-end",flex:"1"}}>
                <Link to={`/profile/${user.username}`} className="viewProfileSuggestionButton">
                    View Profile
                </Link>
            </span>
        </li>
    );
}