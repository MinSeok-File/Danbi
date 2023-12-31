import React from 'react'
import { styled } from 'styled-components'

const Loading = ({loading}) => {
  return (
    <Wrap $loading={loading}>Loading...</Wrap>
  )
}
const Wrap = styled.div`
  left: 0;
  top: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  color: #fff;
  z-index: 999;
  visibility: ${props=>props.$loading ? "visible" : "hidden"};
`
export default Loading