import React from "react";

import "./Message.css";

import ReactEmoji from "react-emoji";

const Message = ({ message: { text, user, roles }, name, role }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();
  let msg;

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  if (user === "admin") {
    msg = (
      <div className="messageContainer messageBot">
        <p>{ReactEmoji.emojify(text)}</p>
      </div>
    );
  } else if (isSentByCurrentUser) {
    msg = (
      <div className="messageContainer alignEnd">
        <p className={`sentText pr-10 ${roles === "mod" ? "messageMod" : ""}`}>
          {trimmedName}
        </p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
        </div>
      </div>
    );
  } else {
    msg = (
      <div className="messageContainer alignStart">
        <p className={`sentText pl-10 ${roles === "mod" ? "messageMod" : ""}`}>
          {user}
        </p>
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
        </div>
      </div>
    );
  }

  return msg;
};

export default Message;
