import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import ChatPanel from "main/components/Chat/ChatPanel";
import ChatOpenedIcon from "../../../assets/ChatOpenedIcon.svg";
import ChatClosedIcon from "../../../assets/ChatClosedIcon.svg";
import ChatBubble from "../../../assets/ChatBubble.svg";

export default function ChatFeature() {
  const { commonsId } = useParams();
  const [isChatClosed, setIsChatClosed] = useState(true);

  const toggleChatWindow = () => {
    setIsChatClosed((prevState) => !prevState);
  };

  const chatIconStyle = {
    width: '95px',
    position: 'fixed',
    bottom: '10px',
    right: '30px',
  };

  const chatBubbleStyle = {
    width: '67px',
    position: 'fixed',
    bottom: '80px',
    right: '120px',
  };

  const chatContainerStyle = {
    width: '550px',
    position: 'fixed',
    bottom: '130px',
    right: '10px',
  };

  return (
    <div data-testid="chat-feature-container">
      {isChatClosed && <Image style={chatBubbleStyle} src ={ChatBubble} alt="" data-testid="chat-bubble-icon"/>}
      <div style={chatContainerStyle} data-testid="playpage-chat-div">
        {!isChatClosed && <ChatPanel commonsId={commonsId}/>}
        <Button data-testid="chat-toggle" variant="outline-light" onClick={toggleChatWindow}>
          <Image style={chatIconStyle} src={ChatClosedIcon} alt="Click to open the chat" data-testid="chat-closed-icon"/>
          {!isChatClosed && <Image style={chatIconStyle} src={ChatOpenedIcon} alt="Click to close the chat" data-testid="chat-opened-icon"/>}
        </Button>
      </div>
    </div>
  );
};