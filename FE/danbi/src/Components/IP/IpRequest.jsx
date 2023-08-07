import React, { useEffect } from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import FaceType from './HelpRequest/FaceType';
import TimeTpye from './HelpRequest/TimeTpye';
import Tab from './Tab/Tab';

const IpRequest = () => {
  const ip = useSelector((state)=>state.ip)
  const location = useLocation();
  console.log(location)

  useEffect(()=>{
    console.log(ip.reservetype);
  },[ip.reservetype])

  return (
    <RequestWrap>
      <Header></Header>
      <Wrap>
        <Tab></Tab>
        { ip.tabmode === 'meet' ? <FaceType /> : <TimeTpye location={location} />}        
      </Wrap> 
      <Footer></Footer>
    </RequestWrap>
  )
}  

const RequestWrap = styled.div`
  width: 100%;
  height: 100%;
`

const Wrap = styled.div`
`


 


export default IpRequest;