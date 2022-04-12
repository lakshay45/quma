import "./topbar.css";
import { Person, Chat, Notifications, Settings, ExitToApp,Home} from "@material-ui/icons";
import Lightbulb from '@mui/icons-material/Lightbulb';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import  "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Dropdown from 'react-bootstrap/Dropdown';
import { logOutCall } from "../../apiCalls";
import { useHistory } from "react-router";
import ReactSearchBox from 'react-search-box'
import axios from "axios";


export default function Topbar() {

    const { user, dispatch } = useContext(AuthContext);
    const history = useHistory();
    const [data,setData] = useState([
        {
            key: 'john',
            value: 'John Doe',
        },
    ]);
    const logOut = (e) => {
        e.preventDefault();
        logOutCall(dispatch);
        history.push("/");
    }
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(()=>{
        const getUsers = async () => {
            try {
                const userList = await axios.get("/users/all");
                data.splice(0, data.length);
                for(var i=0;i<userList.data.length;i++)
                {
                    data.push(userList.data[i]);
                }
                setData(data);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    },[]);
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo" >Quma</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <ReactSearchBox 
                    placeholder="Search for friends"
                    data={data}
                    onSelect={record => history.push(`/profile/${record.value}`)}
                    // onFocus={() => {
                        // getUsers();
                    // }}
                    // onChange={value => console.log(value)}
                    fuseConfigs={{
                        threshold: 0.05,
                    }}
                    value=""
                    dropDownHoverColor="#f2f7fc"
                />
            </div>
            <div className="topbarRight">
                <div className="topbarIcons">
                    <div className="topbarLinks">
                        <Link to="/" style={{textDecoration:"none" ,color:"white"}}>
                            <span className="topbarLink"><Home /></span>
                        </Link>
                    </div>
                    <div className="topbarIconItem">
                        <Chat onClick={()=>{history.push("/messenger")}}/>
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <Lightbulb />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>
                
                <Dropdown >
                    <Dropdown.Toggle variant="btn-sm" >
                        <img
                            src={
                                user.profilePicture
                                    ? PF + user.profilePicture
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                            className="topbarImg"
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item >
                            <Link to={`/profile/${user.username}`} style={{
                                textDecoration: "none", color: "black",marginBottom:"10px"
                            }} >
                                <Person fontSize="small"/> Profile
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <Link to={`/profile/${user.username}`} style={{
                                textDecoration: "none", color: "black", marginBottom:"10px"
                            }} >
                                <Settings fontSize="small"/> Settings
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <p onClick={logOut} style={{marginBottom:"10px"}}><ExitToApp fontSize="small"/> Logout</p>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}