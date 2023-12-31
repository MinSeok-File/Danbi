import React, { useEffect ,useState} from "react"
import {Map,CustomOverlayMap,Polyline} from "react-kakao-maps-sdk";
import axios from "axios";
import styled, { keyframes } from 'styled-components';
const RealtimeMap = ({position,curposition}) => {
  const [linePath,setLinePath] = useState([]);
  useEffect(()=>{
    if(position && position.destLatitude){
      const coordinates = [];
      coordinates.push([position.meetLongitude,position.meetLatitude]);
      coordinates.push([position.destLongitude,position.destLatitude]);
      axios({
        method:"post",
        url:"https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        headers:{
          "Authorization" : `${process.env.REACT_APP_OPENROUTESERVICE_KEY}`
        },
        data:{"coordinates":coordinates}
      }).then(({data})=>{
        const res = [];
        // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
        for(let i = 0; i < data.features[0].geometry.coordinates.length; i++){
          res.push({lat : data.features[0].geometry.coordinates[i][1],lng : data.features[0].geometry.coordinates[i][0]});
        }
        setLinePath([...res]);
      }).catch(err=>{
        console.log(err);
      })
    }
  },[position])

  const getMakers = ()=>{
    const res = [];
    let key = 0;
    if(curposition){
      res.push(
      <CustomOverlayMap key={key++} position={{lat:curposition.coords.latitude,lng:curposition.coords.longitude}}>
        <CurMarker alt='' src={`${process.env.PUBLIC_URL}/assets/curMarker.svg`}></CurMarker>
      </CustomOverlayMap>);
    }
    
    if(position){
      res.push(
        <CustomOverlayMap key={key++} position={{lat:position.meetLatitude,lng:position.meetLongitude}}>
          <Marker alt='' src={`${process.env.PUBLIC_URL}/assets/Meeting.svg`}></Marker>
        </CustomOverlayMap>);

        if(position.destLatitude && position.destLongitude){
          res.push(
            <CustomOverlayMap key={key++} position={{lat:position.destLatitude,lng:position.destLongitude}}>
              <Marker alt='' src={`${process.env.PUBLIC_URL}/assets/Destination.svg`}></Marker>
            </CustomOverlayMap>);
        }
    }

    return res;
  }

  return (
    <Map
      center={{lat:position ? position.meetLatitude : 36.1071233,lng: position ? position.meetLongitude : 128.416481}}
      style={{width:"100%",height:"100%"}}
      level={7}
    >
      {
        getMakers()
      }
      <Polyline
        path={[
          linePath,
        ]}
        strokeWeight={5} // 선의 두께 입니다
        strokeColor={"#FFAE00"} // 선의 색깔입니다
        strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"solid"} // 선의 스타일입니다
      />
    </Map>
  )
}

const rotateMarker = keyframes`
  from{
    transform: rotateY(0deg);
  }
  to{
    transform: rotateY(180deg);
  }
`

const CurMarker = styled.img`
  width: 1rem;
  height: 2rem;
  animation: ${rotateMarker} 1s linear infinite;
`

const Marker = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`


export default RealtimeMap