import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import { useState } from "react";
import { IconButton, } from "@material-ui/core";
import { ArrowBack, ArrowDownward, ArrowForward, KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

export default function Home() {

    const [showSidebar, setShowSidebar] = useState(true);
    const [showRightbar, setShowRightbar] = useState(true);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }
    const toggleRightbar = () => {
        setShowRightbar(!showRightbar);
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
                <Feed />
                {showRightbar ? <Rightbar closeRightbar={toggleRightbar} /> :
                <div style={{ padding: "10px" }}>
                    <IconButton style={{position:"sticky",top:"50px"}} onClick={() => { toggleRightbar() }}>
                        Explore  <ArrowDownward />
                    </IconButton>
                </div>}
            </div>
        </>
    );
}