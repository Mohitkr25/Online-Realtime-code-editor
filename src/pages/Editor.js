import React from "react";
import { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { useRef } from "react";
import actions from "../Actions";
export const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef();
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("texteditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        // console.log("changes", changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin != "setValue") {
          socketRef.current.emit(actions.CODE_CHANGE, {
            roomId,
            code,
          });
        }
        // console.log(code);
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(actions.CODE_CHANGE, ({ code }) => {
        if (code != null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(actions.CODE_CHANGE);
    };
  }, [socketRef.current]);
  return <textarea id="texteditor"></textarea>;
};
