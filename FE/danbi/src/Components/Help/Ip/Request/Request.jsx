import React,{ useEffect, useState, useCallback } from 'react';
import { styled } from 'styled-components';
import Footer from "../../../Common/Footer/Footer";
import Header from "../../../Common/Header/Header";
import Time from './Components/Time/Time';
import Setting from "./Components/Setting/Setting";
import RequestMap from "./Components/RequestMap/RequestMap";
import { authGet, authPost } from '../../../../Util/apis/api';
import { useNavigate } from 'react-router-dom';
const Request = () => {
  const [tap,setTap] = useState("time");
  const [year,setYear] = useState((new Date()).getFullYear()); // 연도 저장 2023
  const [month,setMonth] = useState((new Date()).getMonth()); // 달(현재-1) 저장 7
  const [day,setDay] = useState((new Date()).getDate());
  const [hour,setHour] = useState((new Date()).getHours());
  const [minute,setMinute] = useState((new Date()).getMinutes()-(new Date()).getMinutes()%5+5);
  const [useTime,setUseTime] = useState(15);
  const [genderOption,setGenderOption] = useState(false);
  const [faceType,setFaceType] = useState("NONE");
  const [helpType,setHelpType] = useState("NONE");
  const [meet,setMeet] = useState(null);
  const [dest,setDest] = useState(null);
  const [position,setPosition] = useState({coords:{latitude:36.1071233,longitude:128.1111}});//지도 Position
  const [content,setContent] = useState('');
  const [presets,setPresets] = useState([]);
  const [cautionTitle,setCautionTitle] = useState("직접입력");
  const [caution,setCaution] = useState('');
  const {kakao} = window;
  const navigate = useNavigate();
  const getPreset = useCallback(async()=>{
    try{
      const data = await authGet("/api/v1/preset");
      if(data){
        setPresets(data.presetList);
      }
    }catch(err){
      console.log(err);
    }
  },[setPresets]);

  useEffect(()=>{
    getPreset();
  },[getPreset]);

  const SendRequest = useCallback(async()=>{
    const geocoder = new kakao.maps.services.Geocoder();
    const callback = async (result,status) =>{
      if (status === window.kakao.maps.services.Status.OK) {
        const addr = result[0].address.address_name ? result[0].address.address_name:result[0].road_address;
        const data = {};
        const startTime = `${year}-${(month+1) < 10 ? "0"+(month+1):(month+1)}-${day < 10 ? "0"+day : day} ${hour < 10 ? "0"+hour : hour}:${minute < 10 ? "0"+minute:minute}`;
        if( (new Date(startTime)) < (new Date())){
          alert("도움 시작시간이 현재시간보다 이전입니다. 다시 설정해주세요");
          return;
        }
        data["start_time"]=startTime;
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes()+useTime);
        data["end_time"]=`${endTime.getFullYear()}-${(endTime.getMonth()+1)<10?"0"+(endTime.getMonth()+1):(endTime.getMonth()+1)}-${endTime.getDate() < 10 ? "0"+endTime.getDate():endTime.getDate()} ${endTime.getHours() < 10 ? "0"+endTime.getHours():endTime.getHours()}:${endTime.getMinutes() < 10 ? "0"+endTime.getMinutes():endTime.getMinutes()}`
        data["position"]={
          addr,
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          ...meet,
          ...dest
        };
        if(faceType==="NONE") {
          alert("대면/비대면 여부를 설정해 주세요");
          return;
        }
        data["faceFlag"]=faceType==="contact";
        if(faceType==="contact" && helpType ==="NONE"){
          alert("도움유형을 선택해 주세요");
          return;
        }
        data["category"]=helpType;
        data["caution"]=caution;
        if(content===""){
          alert("도움 상세정보를 입력해주세요");
          return;
        }
        data["content"]=content;
        data["emergencyFlag"]=false;
        data["genderFlag"]=genderOption;
        try{
          const res = await authPost("/api/v1/help/create",data);
          if(res){
            console.log(res);
          }
        }catch(err){
          console.log(err);
        }
        navigate("/help/ip");
      }
    };
    geocoder.coord2Address(position.coords.longitude, position.coords.latitude, callback);
  },[position,helpType,caution,faceType,meet,dest,kakao,content,genderOption,year,month,day,hour,minute,useTime,navigate]);

  return (
    <Wrap>
      <Header></Header>
      {
        tap==="dest" || tap === "meet" ? <MainWrap $full={true} ><RequestMap meet={meet} dest={dest} setDest={setDest} setMeet={setMeet} position={position} setTap={setTap} tap={tap}></RequestMap></MainWrap> : <>
        <Tap>
          <TapItem $on = {tap==="time"} onClick={()=>setTap("time")}>시간예약</TapItem>
          <TapItem $on = {tap==="setting"} onClick={()=>setTap("setting")}>상세설정</TapItem>
        </Tap>
        <MainWrap $full={false}>
          {
            tap==="time" ? <Time setGenderOption={setGenderOption} genderOption={genderOption} useTime={useTime} setUseTime={setUseTime} setMinute={setMinute} minute={minute} hour={hour} setHour={setHour} day={day} setDay={setDay} month={month} setMonth={setMonth} year={year} setYear={setYear}></Time>:null
          }
          {
            tap==="setting" ? <Setting SendRequest={SendRequest} presets={presets} setCautionTitle={setCautionTitle} cautionTitle={cautionTitle} caution={caution} setCaution={setCaution} setContent={setContent} setPosition={setPosition} setTap={setTap} dest={dest} meet={meet} setHelpType={setHelpType} helpType={helpType} setFaceType={setFaceType} faceType={faceType}></Setting>:null
          }
        </MainWrap>
      </>
      }
      <Footer></Footer>
    </Wrap>
  )
}
const MainWrap = styled.div`
  height: ${props=>props.$full ? "calc(100% - 6.2rem)" :"calc(100% - 9.2rem)"};
  padding: ${props=>props.$full ? null :"1rem 30%"};
  @media screen and (max-width: 728px) {
    padding: ${props=>props.$full ? null :"1rem"};
  }
`
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Tap = styled.div`
  width: 100%;
  height: 3rem;
  display: grid;
  grid-template-columns: repeat(2,1fr);
`
const TapItem = styled.button`
  border-bottom: 3px solid ${props=>props.$on ? props.theme.colors.titleColor : "transparent"};
`

export default Request