import React from 'react';
import styled from 'styled-components';

const HelpDetailInfo = ({data}) => {
    return(
        <DetailWrap>
                <BasicInfo>
                    <BasicHeader>기본 정보</BasicHeader>
                    <BasicBody>
                        <FaceFlag>대면 : {data.faceflag ? '대면' : '비대면'}</FaceFlag>
                        <DateTag>날짜 : {data.startTime}</DateTag>
                        <TimeTag>시간 : {data.endTime}</TimeTag>
                        <Destination>목적지 : {data.position.dest_addr}</Destination>
                        <Meet>만나는 곳 : {data.position.meet_addr}</Meet>
                    </BasicBody>
                </BasicInfo>
                <HelpInfo>
                    <HelpHeader>상세 정보</HelpHeader>
                    <HelpBody>
                        {data.content}
                    </HelpBody>
                </HelpInfo>
                <CautionInfo>
                    <CautionHeader>주의 사항</CautionHeader>
                    <CautionBody>
                        {data.caution}
                    </CautionBody>
                </CautionInfo>
            </DetailWrap>
    );
}

const DetailWrap = styled.div`
    width: 100%;
`
const BasicInfo = styled.div`
    margin: 1rem 1rem 1.5rem 1rem;
`
const BasicHeader = styled.div`
    margin-bottom: 0.5rem;
`
const BasicBody = styled.div`
    border: 1px solid ${props => props.theme.colors.titleColor};
    border-radius: 10px;
    background-color: white;
    color: black;
    text-align: left;
    padding: 0.5rem 0 0.5rem 0.5rem;
`
const FaceFlag = styled.div`
    
`
const DateTag = styled.div`
    
`
const TimeTag = styled.div`
    
`
const Destination = styled.div`
    
`
const Meet = styled.div`
    
`
const HelpInfo = styled.div`   
    margin: 1rem 1rem 1.5rem 1rem;
`
const HelpHeader = styled.div`
    margin-bottom: 0.5rem;
`
const HelpBody = styled.div`
    border: 1px solid ${props => props.theme.colors.color};
    border-radius: 10px;
    background-color: white;
    color: black;
    height: 4rem;
    padding: 0.5rem 0 0.5rem 0.5rem;

`
const CautionInfo = styled.div`
    margin: 1rem 1rem 1.5rem 1rem;
`
const CautionHeader = styled.div`
    margin-bottom: 0.5rem;  
`
const CautionBody = styled.div`
    border: 1px solid ${props => props.theme.colors.titleColor};
    border-radius: 10px;
    background-color: white;
    color: black;
    height: 4rem;
    padding: 0.5rem 0 0.5rem 0.5rem;

`

export default HelpDetailInfo