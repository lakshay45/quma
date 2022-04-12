import React, { useRef } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { DialogTitle } from '@material-ui/core';
import "./addNewChatDialogBox.css";

const AddNewChatDialogBox = (props) => {

    const submitHandler=(e)=>{
        e.preventDefault();
        var anotherUserUsername=document.getElementById("anotherUser").value;
        var startingMessage=document.getElementById("startingMessage").value;

        props.closeAddChats(anotherUserUsername,startingMessage);
    }
    return (
        <div>
            <Dialog open={props.open}>
                <DialogContent>
                    <DialogTitle>
                        <form id="my-form" onSubmit={submitHandler}>
                            <label className="addNameLabel">Enter UserName Of Person</label>
                            <br />
                            <input className="inputs" id="anotherUser" type="text" />
                            <br />
                            <label className="addNameLabel">Enter The Starting Message</label>
                            <br />
                            <input className="inputs" id="startingMessage" type="text" />
                        </form>
                    </DialogTitle>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" form="my-form" color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddNewChatDialogBox;
