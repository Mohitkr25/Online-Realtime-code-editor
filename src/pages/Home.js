import React from "react";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [roomid, setRoomid] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomid(id);
    toast.success("Created a New Room");

    // console.log(id);
  };

  const JoinRoom = () => {
    if (!roomid || !username) {
      toast.error("All Fields are Required");
      return;
    }
    //Redirect by using new features of react which is useNavigate state from react-router-dom
    navigate(`/editor/${roomid}`, {
      state: {
        username,
      },
    });
  };

  const handleEnter = (e) => {
    // console.log("event", e.code);
    if (e.code == "Enter") {
      JoinRoom();
    }
  };

  return (
    <div className="HomePageWrapper">
      <div className="FormWrapper">
        <img className="imgcode" src="/program.png" />
        <h4 className="mainlabel">Add Invitation Room Id</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomid(e.target.value)}
            value={roomid}
            onKeyUp={handleEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleEnter}
          />

          <button className="btn joinbtn" onClick={JoinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have Invite code then create &nbsp;{" "}
            <a onClick={createNewRoom} href="" className="CreateNewBtn">
              New Room
            </a>{" "}
          </span>
        </div>
      </div>
      <footer>
        <img class="footer-logo" src="./images/logo-2.svg" alt="" />
        <div class="copyright"></div>
        <div className="footer-socials">
          <a href="https://github.com/Mohitkr25" target="_blank">
            <img src="/github.png" alt="" />
          </a>
          <a
            href="https://www.linkedin.com/in/mohit-kumar-7828611b2/"
            target="_blank"
          >
            <img src="/linkedin.png" alt="" />
          </a>

          <a href="https://www.instagram.com/im__mht25/" target="_blank">
            <img src="/instagram.png" alt="" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
