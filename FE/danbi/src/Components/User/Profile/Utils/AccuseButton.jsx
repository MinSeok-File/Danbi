import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setMode,setTargetMemberId } from '../../../../store/Slice/ModalSlice';

const AccuseButton = ({targetId}) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setTargetMemberId(targetId));
    dispatch(setMode('accuse'));
  }

  return (
    <AccuseWrap onClick={handleClick}>
      <AccuseImg />
    </AccuseWrap>
  );
};

const AccuseWrap = styled.button`
  width: 2.4rem;
  height: 2rem;
  background-color: #FF0000;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccuseImg = styled.img.attrs(props => ({
  src: props.theme.images.accuse
}))`
  width: 90%;
  height: 90%;
`;

export default AccuseButton;
