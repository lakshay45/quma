import Topbar from "../../components/topbar/Topbar";
import Sidebar, { removeDuplicates } from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import { ArrowDownward } from "@material-ui/icons";
import CloseFriend from "../../components/closeFriend/CloseFriend";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Dropdown from 'react-bootstrap/Dropdown';

import "./friends.css"
import { borderRadius } from "@mui/system";

export default function Friends() {

    const [showSidebar, setShowSidebar] = useState(true);
    const [showRightbar, setShowRightbar] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([{}]);
    const { user } = useContext(AuthContext);

    //0 for followings, 1 for followers, 2 for followers - followings, 3 for followings - followers
    const [showFriends, setShowFriends] = useState(0);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }
    const toggleRightbar = () => {
        setShowRightbar(!showRightbar);
    }
    const renderSwitch=(friends)=>
    {

        switch (friends) {
            case 0:
                setLoading(true);
                const getUsers0 = async () => {
                    try {
                        const friendList = await axios.get("/users/friends/" + user._id);
                        setData(friendList.data);
                        setLoading(false);
                    } catch (err) {
                        console.log(err);
                    }
                };
                getUsers0();
                break;
            case 1:
                setLoading(true);
                const getUsers1 = async () => {
                    try {
                        const friendList = await axios.get("/users/followers/" + user._id);
                        setData(friendList.data);
                        setLoading(false);
                    } catch (err) {
                        console.log(err);
                    }
                };
                getUsers1();
                break;
            case 2:
                setLoading(true);
                const getUsers2 = async () => {
                    try {
                        const followersList = await axios.get("/users/followers/" + user._id);
                        const followingsList = await axios.get("/users/friends/" + user._id);

                        const uniques = removeDuplicates(user, followersList.data, followingsList.data);
                        setData(uniques);
                        setLoading(false);
                    } catch (err) {
                        console.log(err);
                    }
                };
                getUsers2();
                break;
            case 3:
                setLoading(true);
                const getUsers3 = async () => {
                    try {
                        const followersList = await axios.get("/users/followers/" + user._id);
                        const followingsList = await axios.get("/users/friends/" + user._id);

                        const uniques = removeDuplicates(user, followingsList.data, followersList.data);
                        setData(uniques);
                        setLoading(false);
                    } catch (err) {
                        console.log(err);
                    }
                };
                getUsers3();
                break;

            default:
                break;
        }
    }
    useEffect(() => {
        renderSwitch(showFriends);
    }, []);

    const showCorrespondingFriends=(num)=>{
        renderSwitch(num);
        setShowFriends(num);
    }

    return (
        <>
            <Topbar />
            <div className="homeContainer">
                {
                    showSidebar ? <Sidebar closeSidebar={toggleSidebar} /> :
                        <div style={{ padding: "10px" }}>
                            <IconButton style={{ position: "sticky", top: "50px" }} onClick={() => { toggleSidebar() }}>
                                Suggestions <ArrowDownward />
                            </IconButton>
                        </div>
                }
                
                <div className="friends">
                    <div className="friendsHeadings">

                        <Dropdown>
                            <Dropdown.Toggle variant="btn-sm" style={{
                                outline: "none",
                                boxShadow: "none",
                                display:"flex",
                                alignItems:"center",
                                color: "#4d05ac",
                                borderBottom: "2px solid #ddc4ff",
                                borderRadius: "0px"
                            }}>
                                {loading && <CircularProgress />}
                                {showFriends === 0 && !loading && <h5><i>Followings</i></h5>}
                                {showFriends === 1 && !loading && <h5><i>Followers</i></h5>}
                                {showFriends === 2 && !loading && <h5><i>Only Followers</i></h5>}
                                {showFriends === 3 && !loading && <h5><i>Only Followings</i></h5>}
                            </Dropdown.Toggle>
                            <Dropdown.Menu >
                                <Dropdown.Item >
                                    <p onClick={() => { showCorrespondingFriends(0)}} >Followings</p>
                                </Dropdown.Item>
                                <Dropdown.Item >
                                    <p onClick={() => { showCorrespondingFriends(1)}} >Followers</p>
                                </Dropdown.Item>
                                <Dropdown.Item >
                                    <p onClick={() => { showCorrespondingFriends(2) }} >Only Followers</p>
                                </Dropdown.Item>
                                <Dropdown.Item >
                                    <p onClick={() => { showCorrespondingFriends(3) }} >Only Followings</p>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="friendsWrapper">
                    {       
                        data && data.map(
                            (user) =>
                            <>
                                <CloseFriend key={user.id} user={user} />
                                <hr />
                            </>
                    )}
                    </div>
                </div>
                
                {showRightbar ? <Rightbar closeRightbar={toggleRightbar} /> :
                    <div style={{ padding: "10px" }}>
                        <IconButton style={{ position: "sticky", top: "50px" }} onClick={() => { toggleRightbar() }}>
                            Explore  <ArrowDownward />
                        </IconButton>
                    </div>}
            </div>
        </>
    );
}