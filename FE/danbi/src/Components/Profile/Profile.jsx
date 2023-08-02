import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '../Common/Header/Header.jsx';
import Footer from '../Common/Footer/Footer.jsx';
import UserInfo from './UserInfo.jsx';
import PresetButton from './PresetButton.jsx';
import Jandi from './Jandi.jsx';
import GuestBook from './GuestBook.jsx';
import PresetModal from './PresetModal.jsx';
import PickModal from './PickModal.jsx';

const data = 
  {
  "profile_id" : 1,
  "name" : '김민규',
  "profile_url" : 'adf',
  "accuse_point" : 123,
  "dew_point" : 10,
  "help_log" : [
    {
      "help_id": 1,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 2,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 3,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 4,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 5,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 6,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 7,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 8,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 9,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 10,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 11,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 12,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 13,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 14,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 15,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 16,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 17,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 18,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 19,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 20,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 21,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 22,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 23,
      "created_time" : "2020-01-04",
    },
    {
      "help_id": 24,
      "created_time" : "2020-01-01",
    },
    {
      "help_id": 25,
      "created_time" : "2020-01-02",
    },
    {
      "help_id": 26,
      "created_time" : "2020-01-03",
    },
    {
      "help_id": 27,
      "created_time" : "2020-01-04",
    },
  ],
  "item" : {"잔디 모양" : "HEART", "잔디 컬러": "RED"},
  "guest_book": {
    "comments" : [
      {"name" : "이름",
        "profile_url" : "ㅁㄴ일",
        "content" : "asdfa",
        "created_time" : "2023-01-02",
        "updated_time" : "2020-01-01"
      },
      {"name" : "이름",
        "profile_url" : "ㅁㄴ일",
        "content" : "asdfa",
        "created_time" : "2023-01-02",
        "updated_time" : "2020-01-01"
      },{"name" : "이름",
      "profile_url" : "ㅁㄴ일",
      "content" : "asdfa",
      "created_time" : "2023-01-02",
      "updated_time" : "2020-01-01"
    },
    {"name" : "이름",
        "profile_url" : "ㅁㄴ일",
        "content" : "asdfa",
        "created_time" : "2023-01-02",
        "updated_time" : "2020-01-01"
      },{"name" : "이름",
      "profile_url" : "ㅁㄴ일",
      "content" : "asdfa",
      "created_time" : "2023-01-02",
      "updated_time" : "2020-01-01"
    }
    ]
  }
}

const Profile = () => {
  const [ModalOpen, setModalOpen] = useState(false);
  const [PickModalOpen, setPickModalOpen] = useState(false);
  return (
      <ProfileWrap>
        <Header />
        <Wrap>
          <UserInfo />
          <PresetButton setModalOpen={setModalOpen} ModalOpen={ModalOpen} />
          <JandiWrap>
            <Jandi point={data.dew_point} help_log={data.help_log} setPickModalOpen={setPickModalOpen} />
          </JandiWrap>
          {PickModalOpen && <PickModal setPickModalOpen={setPickModalOpen} />}
          <GuestBook />
          {ModalOpen && <PresetModal setModalOpen={setModalOpen} />}
        </Wrap>
        <Footer />
      </ProfileWrap>
  );
};

const ProfileWrap = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.bgColor};
  color: ${(props) => props.theme.colors.titleColor};
  display: flex;
  flex-direction: column;
  height: auto;
`;

const Wrap = styled.div`
  // (Todo) 드래그 방지 풀어줘야함
  /* -webkit-user-select: all;
    -moz-user-select: all;
    -ms-user-select: all;
    user-select: all; */
`;


const JandiWrap = styled.div``;

export default Profile;
