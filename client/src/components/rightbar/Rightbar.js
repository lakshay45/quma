import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ArrowForward} from "@material-ui/icons";

export default function Rightbar({closeRightbar}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user, dispatch } = useContext(AuthContext);
   
    const HomeRightbar = () => {
        return (
                <div>
                    <div className="birthdayContainer">
                        <img className="birthdayImg" src="assets/gift.png" alt="" />
                        <span className="birthdayText">
                            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
                        </span>
                    </div>
                    <img className="rightbarAd" src="assets/ad.png" alt="" />
                    <h4 className="rightbarTitle">Online Friends</h4>
                    <ul className="rightbarFriendList">
                        {Users.map((u) => (
                            <Online key={u.id} user={u} />
                            ))}
                    </ul>
                </div>
        );
    };

    const ProfileRightbar = () => {
        return (
            <>
                <div>
                    <button style={{ cursor: "pointer", backgroundColor: "white", border: "none" ,padding:"10px"}}
                        onClick={() => { closeRightbar();}}>
                        <h5> <ArrowForward fontSize="medium"/></h5>
                    </button>
                </div>
                <div style={{padding:"20px"}}>

                    <Link to={`/profile/${user.username}`} style={{
                        textDecoration: "none"
                    }} >
                        <img
                            className="rightbarUserImg"
                            src={
                                user.profilePicture
                                    ? PF + user.profilePicture
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                        />
                    </Link>
                <h4 className="rightbarTitle">User information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Username:</span>
                        <span className="rightbarInfoValue">{user.username}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Name:</span>
                        <span className="rightbarInfoValue">{user.name}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">College:</span>
                        <span className="rightbarInfoValue">
                            {user.college}
                        </span>
                    </div>
                </div>
                {/* <h4 className="rightbarTitle">User friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link
                            to={"/profile/" + friend.username}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="rightbarFollowing">
                                <img
                                    src={
                                        friend.profilePicture
                                            ? PF + friend.profilePicture
                                            : PF + "person/noAvatar.png"
                                    }
                                    alt=""
                                    className="rightbarFollowingImg"
                                />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div> */}
                </div>
            </>
        );
    };
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    );
}