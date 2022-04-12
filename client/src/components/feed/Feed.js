import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import{MoreHoriz,Settings} from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { useParams , useHistory} from "react-router";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { CircularProgress } from "@material-ui/core";

export default function Feed({ anotherUser}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingFollowings, setLoadingFollowings] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(user.followings.includes(anotherUser?._id));
    const [followers, setFollowers] = useState(0);
    const username = useParams().username;
    const history = useHistory();

    // if by mistake someone refreshes the page
    // window.onload= () => {
    //     const FetchUser = async () => {
    //         console.log("loading..");
    //         setLoading(true);
    //         const res = await axios.get(`/users?username=${username}`);
    //         anotherUser=res.data;
            
    //         console.log("loading done...");
    //         setLoading(false);
    //         setFollowers(anotherUser.followers.length);
    //         setFollowed(user.followings.includes(anotherUser?._id));
    //     };
    //     FetchUser();
    // };
    useEffect(() => {
        const fetchPosts = async () => {
            setLoadingPosts(true);
            const res = anotherUser &&  anotherUser.username
                ? await axios.get("/posts/profile/" + anotherUser.username)
                : await axios.get("posts/timeline/" + user?._id);
            setFollowed(user.followings.includes(anotherUser?._id));
            anotherUser && setFollowers(anotherUser.followers.length);
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            );
            setLoadingPosts(false);
        };
        fetchPosts();
    }, [anotherUser && anotherUser.username, user._id]);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            setLoadingFollowings(true);
            if (followed) {
                await axios.put(`/users/${anotherUser._id}/unfollow`, {
                    userId: user._id,
                });
                dispatch({ type: "UNFOLLOW", payload: anotherUser._id });
            } else {
                await axios.put(`/users/${anotherUser._id}/follow`, {
                    userId: user._id,
                });
                dispatch({ type: "FOLLOW", payload: anotherUser._id });
            }
            !followed?setFollowers(followers+1):setFollowers(followers-1);
            setFollowed(!followed);
            setLoadingFollowings(false);
        } catch (err) {
        }
    };

    const showFriends = (e) => {
        e.preventDefault();
        history.push("/friends/" + user.username);
    }
    return (<div>
        {loading && <CircularProgress />}
        {!loading && anotherUser && anotherUser.username &&
                        <div className="profileCover">
                            <div>
                                <img
                                    className="profileUserImg"
                                    src={
                                        anotherUser.profilePicture
                                            ? PF + anotherUser.profilePicture
                                            : PF + "person/noAvatar.png"
                                    }
                                    alt=""
                                />
                            </div>
                            <div className="profileInfo">
                                <div className="userInformation">
                                    <p className="profileInfoName">{anotherUser.username}</p>
                                    <button className="followButton" style={{marginLeft: "6vw"}}>
                                        Edit <Settings style={{fontSize: "medium"}}/>
                                    </button>
                                    {anotherUser && anotherUser.username !== user.username && (
                                    <>
                                        <button className="followButton" onClick={()=>{history.push("/messenger")}}>Message</button>
                                        {loadingFollowings && <CircularProgress />}
                                        {!loadingFollowings &&
                                            <button className="followButton" onClick={handleClick}>
                                                {followed ? "Unfollow" : "Follow"}
                                            </button>
                                        }
                                    </>
                                    )}
                                    {anotherUser && anotherUser.username === user.username && (
                                        <>
                                            <button className="followButton" onClick={showFriends}>
                                                Friends  <PeopleAltIcon style={{ fontSize: "medium" }}/>
                                            </button>
                                        </>
                                    )}
                                    <button className="moreVertButton"><MoreHoriz /></button>
                                </div>
                                <div className="userFollowerInformationBox">
                                    <div className="userFollowerInformation">
                                            <h6>post</h6>
                                            <p>{posts.length}</p>
                                    </div>
                                    <div className="userFollowerInformation">
                                            <h6>Followers</h6>
                                            <p>{followers}</p>
                                    </div>
                                    <div className="userFollowerInformation">
                                            <h6>Followings</h6>
                                            <p>{anotherUser.followings.length}</p>
                                    </div>
                                </div>
                                <h5>{anotherUser.name}</h5>
                            </div>
                        </div>
                    }
                    <div className="feed">
                        <div className="feedWrapper">
                            {loadingPosts && <CircularProgress />}
                {((anotherUser && !anotherUser.username) || (anotherUser && anotherUser.username === user.username)) && <Share />}
                            {!loadingPosts && posts.map((p) => (
                                <Post key={p._id} post={p} />
                            ))}
                        </div>
                    </div>
            </div>
    );
}