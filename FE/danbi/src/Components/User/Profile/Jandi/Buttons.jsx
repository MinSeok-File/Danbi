import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTier,
  setCheckedRgb,
  setUnchedkedRgb,
  setName,
  setDewPoint,
} from '../../../../store/Slice/JandiSlice';
import { authPost } from '../../../../Util/apis/api';

const Buttons = ({ prevGross, nextGross, setPickModalOpen }) => {
  const dispatch = useDispatch();
  const handlePickModal = async () => {
    setPickModalOpen(true);
    try {
      const pickdata = await authPost('/api/v1/item', {});
      dispatch(setName(pickdata.item.name));
      dispatch(setTier(pickdata.item.ranking));
      dispatch(setUnchedkedRgb(pickdata.item.uncheckedRgb));
      dispatch(setCheckedRgb(pickdata.item.checkedRgb));
      dispatch(setDewPoint(pickdata.dewPoint));
    } catch (err) {
      console.log(err);
    }
  };
  const curDewPoint = useSelector((state) => state.Jandi.dewPoint);

  const [myProfile, setMyProfile] = useState(false);
  const cur_id = useSelector((state) => state.user.userId);
  if (targetId === cur_id) {
    setMyProfile(true);
  }

  return (
    <Btns>
      <DirectionBtns>
        <GrossBtn onClick={prevGross}>이전</GrossBtn>
        <GrossBtn onClick={nextGross}>다음</GrossBtn>
      </DirectionBtns>
      <Wrap>
        <Dew>{curDewPoint}Dew</Dew>
        {myProfile ? (
          <PickBtn
            onClick={() => {
              handlePickModal();
            }}
          >
            뽑기
          </PickBtn>
        ) : null}
      </Wrap>
    </Btns>
  );
};

const Btns = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PickBtn = styled.button`
  background-color: #6161ff;
  border-radius: 10px;
  width: 3rem;
  height: 2rem;
  font-size: 20px;
  text-align: center;
`;

const Dew = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DirectionBtns = styled.div`
  display: flex;
`;

const GrossBtn = styled.button`
  width: 2rem;
  height: 2rem;
`;

export default Buttons;
