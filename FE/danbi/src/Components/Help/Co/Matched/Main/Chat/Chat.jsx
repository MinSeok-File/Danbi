import React, { useRef, useState, useEffect, useCallback } from 'react';
import io from "socket.io-client";
import styled from 'styled-components';
import "./Chat.css";
import axios from 'axios';
const pc_config = {
  iceServers: [{ urls: [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302",
  ]}],
};
const Chat = (props) => {
  const chatRef = useRef();
  const socketRef = useRef();
  const pcRef = useRef();
  const streamRef = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [chatValue,setChatValue] = useState("");
  const [onVideo, setOnVideo] = useState(true);
  const [onAudio,setOnAudio] = useState(true);
  const getDay = ()=>{
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDay()} ${today.getHours()}:${today.getMinutes()}`;
  }

  const sendMessage = ()=>{
    const message = {
      userId:props.myProfile.userId,
      helpId:props.roomId,
      name:props.myProfile.name,
      content:chatValue,
      date: getDay(),
    };
    socketRef.current.emit("message", message);
    const messageEl = document.createElement("div");
    messageEl.className="RightChatWrap";
    messageEl.innerHTML = `<span>${message.date}</span><span>${message.name} : ${message.content}</span>`;
    chatRef.current.appendChild(messageEl);
    setChatValue("");
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
  const setVideoTracks = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: onVideo,
        audio: onAudio,
      });
      if(stream){
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (!(pcRef.current && socketRef.current)) return;
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
          if (!socketRef.current) return;
          socketRef.current.emit("candidate", e.candidate);
          }
        };
        pcRef.current.oniceconnectionstatechange = (e) => {
          // console.log(e);
        };
        pcRef.current.ontrack = (ev) => {
          // console.log("add remotetrack success");
          if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };
        socketRef.current.emit("join_room", {
          room: props.roomId,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },[props.roomId]);

  const createOffer = async () => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
    const sdp = await pcRef.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp);
    } catch (e) {
      console.error(e);
    }
  };

  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const mySdp = await pcRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(()=>{
    //DO : 지난 채팅내역을 불러옴
    axios({
      method:"get",
      url:`/room/chat/${props.roomId}`,
    }).then(({data})=>{
      for(let i = 0; i < data.length; i++){
        const messageEl = document.createElement("div");
        if(data[i].userId===props.myProfile.userId){
          messageEl.className="RightChatWrap";
          messageEl.innerHTML = `<span>${data[i].date}</span><span>${data[i].name} : ${data[i].content}</span>`;
        }else{
          messageEl.className="LeftChatWrap";
          messageEl.innerHTML = `<span>${data[i].name} : ${data[i].content}</span><span>${data[i].date}</span>`;
        }
        chatRef.current.appendChild(messageEl);
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }).catch(err=>console.log(err));
  },[props.roomId]);

  useEffect(() => {
    //DO : express 서버에 소켓연결
    if(props.mode!=="Chat"){return;}
    socketRef.current = io.connect("/",{path:"/room/socket.io"});
    pcRef.current = new RTCPeerConnection(pc_config);

    socketRef.current.on("all_users", (allUsers) => {
      if (allUsers.length > 0) {
          createOffer();
      }
    });

    socketRef.current.on("getOffer", (sdp) => {
      createAnswer(sdp);
    });

    socketRef.current.on("getAnswer", (sdp) => {
    if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socketRef.current.on(
    "getCandidate",
    async (candidate) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
    );

    socketRef.current.on("message", (data) => {
      const messageEl = document.createElement("div");
      messageEl.className="LeftChatWrap";
      messageEl.innerHTML = `<span>${data.name} : ${data.content}</span><span>${data.date}</span>`;
      chatRef.current.appendChild(messageEl);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });

    setVideoTracks();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return (
    <Wrap>
      <VideoWrap>
        <VideoSubWrap>
          <VideoTitle>도와주는 사람</VideoTitle>
          <Video ref={remoteVideoRef} autoPlay></Video>
          <ControlBtnWrap></ControlBtnWrap>
        </VideoSubWrap>
        <VideoSubWrap>
          <VideoTitle>나</VideoTitle>
          <Video muted ref={localVideoRef} autoPlay></Video>
          <ControlBtnWrap>
            <ControlBtn onClick={()=>{
              streamRef.current.getVideoTracks().forEach(track=>track.enabled = !track.enabled);
              setOnVideo(!onVideo);
            }} ><img alt='' src={`${process.env.PUBLIC_URL}/assets/videocam_FILL1_wght400_GRAD0_opsz48 1.svg`} />
              {
                onVideo ? "화면 끄기" : "화면 켜기"
              }
            </ControlBtn>
            <ControlBtn onClick={()=>{
              streamRef.current.getAudioTracks().forEach(track=>track.enabled = !track.enabled);
              setOnAudio(!onAudio);
            }}><img alt='' src={`${process.env.PUBLIC_URL}/assets/volume_up_FILL1_wght400_GRAD0_opsz48 1.svg`} />
              {
                onAudio ? "소리 끄기" : "소리 켜기"
              }
            </ControlBtn>
          </ControlBtnWrap>
        </VideoSubWrap>
      </VideoWrap>
      <ChatWrap>
        <ChatItems ref={chatRef}>
        </ChatItems>
        <div>
          <ChatInput value={chatValue} onKeyDown={(e)=>{if(e.key==="Enter"){sendMessage();}}} onChange={(e)=>setChatValue(e.target.value)}></ChatInput>
          <ChatBtn onClick={sendMessage}></ChatBtn>
        </div>
      </ChatWrap>
    </Wrap>
  )
}
const ChatBtn = styled.button`
  background-image: url(${props=>props.theme.images.send});
  background-repeat:no-repeat;
  width: 1.5rem;
  height: 1.5rem;
`
const ChatInput = styled.input`
  width: calc(100% - 1.5rem);
  margin-right: 1rem;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${props=>props.theme.colors.titleColor};
  color : ${props=>props.theme.colors.titleColor};
`

const ControlBtn = styled.button`
  padding: 0 0.5rem;
  height: 1.5rem;
  border-radius: 1rem;
  background-color: #FFEA7E;
  color: #000;
  font-size: 10px;
  &>img{
    vertical-align: middle;
  }
`
const ControlBtnWrap = styled.div`
  width: 100%;
  height: 1.5rem;
  font-size: 16px;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`
const VideoTitle = styled.div`
  width: 100%;
  height: 1rem;
  text-align: center;
`
const Video = styled.video`
  width: 160px;
  height: 160px;
  background-color: #000;
`
const VideoSubWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 12rem;
`
const VideoWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-column-gap:0.5rem;
  width: 100%;
  height: 40%;
  padding: 1rem;
`
const ChatItems = styled.div`
  height: calc(100% - 3rem);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-wrap: nowrap;
  gap: 0.5rem;
  &>div{
    flex: 0 0 auto;
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
  &::-webkit-scrollbar {
      display: none;
  }
`
const ChatWrap = styled.div`
  padding: 1rem;
  width: 100%;
  height: 60%;
  &>:last-child{
    margin-top: 1rem;
    width: 100%;
    height: 1rem;
    display: flex;
  }
`

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
export default Chat