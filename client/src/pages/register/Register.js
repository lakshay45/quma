import axios from "axios";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import DialogBox from "../../components/dailog box/DialogBox";
import { Link } from "react-router-dom";

export default function Register() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const name = useRef();
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const college = useRef();
    const history = useHistory();
    const [isError,setIsError]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const handleClick = async (e) => {
        e.preventDefault();
    
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                name: name.current.value,
                username: username.current.value,
                college: college.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                // console.log(user);
                await axios.post("/auth/register", user);
                history.push("/login");
            } catch (e) {
                if (e.response && e.response.data) {
                    console.log(e.response.data.message) // some reason error message
                    setErrorMessage(e.response.data.message);
                }
                setIsError(true);
            }
        }
    };
    const noError=()=>{
        setIsError(false);
    }
    return (
        <div className="body">
            <div className="login">
                <div className="leftCardSide" style={{ position: "relative" }}>
                    <div className="image" style={{ position: "absolute", height: "80vh" }}>
                        <img
                            src={`${PF}login.jpg`}
                            width="100%"
                            height="100%"
                            alt=""
                        />
                    </div>
                    <div style={{ position: "absolute", zIndex: "1", top: "30vh", left: "5vw" }}>
                        <h3 className="loginLogo" >
                            <img
                                className="qumaIcon"
                                src={`${PF}quma.png`}
                            />     Quma</h3>
                        <div className="loginDesc" style={{ maxWidth: "25vw" }}>
                            Connect with friends and the world around you on Quma.
                        </div>
                    </div>
                </div>
                <div className="rightCardSide">
                    <h3 style={{ textAlign: "center", marginBottom: "6vh" }}>Sign Up</h3>
                    <form id="qumaForm" className="loginBox" onSubmit={handleClick}>
                        <input
                            placeholder="Name"
                            required
                            ref={name}
                            className="loginDetailsInput"
                        />
                        <input
                            placeholder="Username"
                            required
                            ref={username}
                            className="loginDetailsInput"
                        />
                        <input
                            placeholder="Email"
                            required
                            ref={email}
                            className="loginDetailsInput"
                            type="email"
                        />
                        <input
                            placeholder="Password"
                            required
                            ref={password}
                            className="loginDetailsInput"
                            type="password"
                            minLength="6"
                        />
                        <input
                            placeholder="Password Again"
                            required
                            ref={passwordAgain}
                            className="loginDetailsInput"
                            type="password"
                        />
                        <input
                            placeholder="School / College / University / Company"
                            ref={college}
                            className="loginDetailsInput"
                        />
                    </form>
                    <div style={{ display: "flex", justifyContent: "center", paddingTop: "10vh", marginBottom: "30px" }}>
                        <button className="loginButton" type="submit" form="qumaForm">
                            Sign Up
                        </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        Already have a account ?
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <span style={{ color: "rgb(26, 26, 165)", fontWeight: "500", paddingLeft: "5px" }}>Log In</span>
                        </Link>
                    </div>
                    <DialogBox open={isError} setIsError={noError} 
                    text={errorMessage}/>
                </div>
            </div>
        </div>
    );
}