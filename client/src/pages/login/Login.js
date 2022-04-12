import { useContext, useEffect, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import DialogBox from "../../components/dailog box/DialogBox";

export default function Login() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch,error } = useContext(AuthContext);

    const [isError, setIsError] = useState(false);
    const handleClick = (e) => {
        e.preventDefault();
        loginCall(
            { email: email.current.value, password: password.current.value },
            dispatch
            );
    };
    useEffect(()=>{setIsError(error)},[error]);
    const noError = () => {
        setIsError(false);
    }
    return (
        
        <div className="body">
            <div className="login">
                <div className="leftCardSide" style={{position:"relative"}}>
                    <div className="image" style={{position:"absolute",height:"80vh"}}>
                        <img
                            src={`${PF}login.jpg`}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <div style={{ position: "absolute", zIndex: "1" ,top:"30vh",left:"5vw"}}>
                        <h3 className="loginLogo" >
                            <img
                            className="qumaIcon"
                            src={`${PF}quma.png`}
                        />     Quma</h3>
                        <div className="loginDesc" style={{maxWidth:"25vw"}}>
                            Connect with friends and the world around you on Quma.
                        </div>
                    </div>
                </div>
                <div className="rightCardSide">
                        <h3 style={{textAlign:"center",marginBottom:"6vh"}}>Login</h3>
                        <form onSubmit={handleClick}>
                            <input
                                placeholder="Email"
                                type="email"
                                required
                                className="loginDetailsInput"
                                ref={email}
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                required
                                className="loginDetailsInput"
                                minLength="6"
                                ref={password}
                        />
                        
                        <div className="loginForgot">Forgot Password?</div>
                        
                        <div style={{display:"flex",justifyContent:"center",paddingTop:"10vh",marginBottom:"30px"}}>
                            <button className="loginButton" type="submit" disabled={isFetching}>
                                {isFetching ? (
                                    <CircularProgress color="white" size="20px" />
                                ) : (
                                    "Log In"
                                )}
                            </button>
                        </div>
                        </form>
                        <div style={{display:"flex",justifyContent:"center"}}>
                            Don't have a account yet ?
                            <Link to="/register" style={{textDecoration:"none"}}>
                                    {isFetching ? (
                                        <CircularProgress color="white" size="20px" />
                                        ) : (
                                    <span style={{ color:"rgb(26, 26, 165)" , fontWeight:"500",paddingLeft:"5px"}}>Sign Up</span>
                                            )}
                            </Link>
                        </div>
                        <DialogBox open={isError} setIsError={noError} 
                        text="Wrong email or password"/>
                </div>
            </div>
        </div>
    );
}