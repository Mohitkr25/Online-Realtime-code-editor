import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import actions, { DISCONNECTED } from "../Actions";
import { initsocket } from "../socket";
import Client from "./Client";
import { Editor } from "./Editor";

const Editorspage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  const handleErrors = (e) => {
    console.log("connect_error", e);
    toast.error("Socket connection failed , Please try agin later");
    reactNavigator("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initsocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.emit(actions.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listening for joined clients
      socketRef.current.on(
        actions.JOINED,
        ({ clients, username, socketid }) => {
          if (username != location.state?.username) {
            toast(`${username} has joined the room`);
            // console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(actions.SYNC_CODE, {
            code: codeRef.current,
            socketid,
          });
        }
      );

      // listening for socket DISCONNECTED
      socketRef.current.on(actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(actions.JOINED);
      socketRef.current.off(actions.DISCONNECTED);
    };
  }, []);

  async function CopyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId has been copied to your clipboard");
    } catch (err) {
      toast.error("Couldn't copy the roomId");
      console.log(err);
    }
  }
  function LeaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mainWrapper">
      <div className="aside">
        <div className="asideinner">
          <div className="asideinner">
            <a
              className="calllink"
              href="https://video-connect-79e81.web.app/"
              target="_blank"
            >
              <div className="videocall">
                <img className="videologo" src="/video-camera.png" alt="" />
                <p>Let's start video call</p>
              </div>
            </a>
            <img className="asidelogo" src="/coding.png" alt="" />
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client key={client.socketid} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copybtn" onClick={CopyRoomId}>
          Copy Room Id
        </button>
        <button className="btn leavebtn" onClick={LeaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorwrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default Editorspage;
