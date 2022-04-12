import "./sidebar.css";
import {
    ArrowBack
} from "@material-ui/icons";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";


export const removeDuplicates = (user,duplicates, followings) => {
    const flag = {};
    const unique = [];
    flag[user.username] = true;
    for (var i = 0; i < followings.length; i++) {
        flag[followings[i].username] = true;
    }
    duplicates.forEach(element => {
        if (!flag[element.username]) {
            flag[element.username] = true;
            unique.push(element);
        }
    });
    return unique;
}

export default function Sidebar({closeSidebar}) {
    const [data, setData] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const { user} = useContext(AuthContext);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const userList = await axios.get("/users/suggestions/"+user._id);
                const friendList = await axios.get("/users/friends/" + user._id);
                // console.log(userList);
                // console.log(friendList);
                const uniques = removeDuplicates(user, userList.data,friendList.data);
                setData(uniques);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, []);
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">

                <div style={{ justifyContent: "flex-end", display: "flex" }}>
                    <button style={{cursor:"pointer",backgroundColor:"white",border:"none"}}
                    onClick={()=>{closeSidebar();}}>
                        <ArrowBack fontSize="medium"/>
                    </button>    
                </div>
                <div style={{paddingTop:"20px",paddingBottom:"40px",display:"flex",justifyContent:"center"}}>
                    <p className="suggestionButton">
                        {loading && <CircularProgress />}
                        {!loading && <i>Suggestions</i>}                        
                    </p>
                </div>
                    {
                            data && data.map(
                                (user) =>
                                <CloseFriend key={user.id} user={user} />
                            )
                    }
            </div>
        </div>
    );
}