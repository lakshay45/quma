import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { ArrowBack, ArrowBackIos, ArrowDownward, ArrowForward, KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default function Profile() {
    // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const [showSidebar, setShowSidebar] = useState(true);
    const [showRightbar, setShowRightbar] = useState(true);
    const username = useParams().username;
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }
    const toggleRightbar = () => {
        setShowRightbar(!showRightbar);
    }
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);

    return (
        <>
            <Topbar />
            <div className="profileRightBottom">
                {
                    showSidebar ? <Sidebar closeSidebar={toggleSidebar} /> :
                        <div style={{ padding: "10px" }}>
                            <IconButton style={{ position: "sticky", top: "50px" }} onClick={() => { toggleSidebar() }}>
                                Suggestions <ArrowDownward />
                            </IconButton>
                        </div>
                }
                <Feed anotherUser={user} />
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