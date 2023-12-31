import React from 'react';
import styled from 'styled-components';
import { authDelete, authGet } from '../../../../Util/apis/api';
import { useNavigate } from 'react-router-dom';

const MyFriend = ({ value, setMyFriends, setWaittingFriends }) => {
  // console.log(value);
  const handleDelete = async () => {
    try {
      await authDelete(`/api/v1/friends/delete/${value.friendId}`, {});
      const waittingResponse = await authGet('/api/v1/friends/responses');
      const myFriendResponse = await authGet('/api/v1/friends');
      setWaittingFriends(waittingResponse.result);
      setMyFriends(myFriendResponse.result);
    } catch (err) {
      console.log(err);
    }
  };
  const navigate = useNavigate();
  return (
    <MyFriendWrap>
      <InfoWrap>
        <ImgWrap $url={value.profileUrl} />
        <Name
          onClick={() => {
            navigate(`/user/profile/${value.targetId}`);
          }}
        >
          {value.name}
        </Name>
      </InfoWrap>
      <Btn>
        <DeleteBtn onClick={handleDelete}>삭제</DeleteBtn>
      </Btn>
    </MyFriendWrap>
  );
};

const MyFriendWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
  margin: 1rem 0;
  width: 100%;
  height: auto;
`;

const InfoWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImgWrap = styled.img.attrs((props) => ({
  src: props.$url,
}))`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
`;

const Name = styled.span`
  font-size: 32px;
  padding-left: 0.5rem;
`;

const Btn = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DeleteBtn = styled.button`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #19191B;
  width: 4rem;
  height: 2rem;
`;

export default MyFriend;
