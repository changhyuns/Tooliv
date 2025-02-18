import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  inviteChannelMember,
  searchNotChannelMemberList,
} from 'api/channelApi';
import Button from 'atoms/common/Button';
import Icons from 'atoms/common/Icons';
import Label from 'atoms/label/Label';
import Text from 'atoms/text/Text';
import { useDebounce } from 'hooks/useHooks';
import InputBox from 'molecules/inputBox/InputBox';
import UserBadge from 'molecules/userBadge/UserBadge';
import UserInfo from 'molecules/userInfo/UserInfo';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { currentChannelNum } from 'recoil/atom';
import { colors } from 'shared/color';
import { addMemberType, channelMemberType } from 'types/channel/contentType';
import { userBadgeTypes } from 'types/common/userTypes';
import {
  inviteMembersBadgeType,
  inviteMembersType,
} from 'types/workspace/workspaceTypes';

const Modal = styled.div<{ isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 140px;
  z-index: 1;
  ${(props) =>
    props.isOpen &&
    css`
      display: block;
    `}
`;

const Container = styled.div`
  width: 600px;
  padding: 25px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 30px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const UserBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  max-height: 25vh;
  min-height: 15vh;
  overflow: scroll;
  margin-bottom: 10px;
`;

export const ButtonBox = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  margin-left: auto;
`;

const UserBadgeWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  max-height: 15vh;
  overflow: scroll;
`;

const BadgeBox = styled.div`
  width: 50%;
  padding: 5px;
  /* margin: 5px; */
`;

const UserInfoWrapper = styled.div`
  width: 50%;
  /* height: fit-content; */
  padding: 10px;
  border-radius: 8px;

  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.dropdownHoverColor};
  }
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChannelAddMemberModal = ({
  isOpen,
  onClose,
  channelId,
}: addMemberType) => {
  const [allUserList, setAllUserList] = useState<channelMemberType[]>([]);
  const [userList, setUserList] = useState<channelMemberType[]>([]);
  const [userBadgeList, setUserBadgeList] = useState<inviteMembersBadgeType[]>(
    []
  );
  const [sequence, setSequence] = useState(1);
  const [target, setTarget] = useState<any>(null);
  const [endCheck, setEndCheck] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const sequenceRef = useRef(sequence);
  sequenceRef.current = sequence;

  const endCheckRef = useRef(endCheck);
  endCheckRef.current = endCheck;

  const [inviteUserList, setInviteUserList] = useState<string[]>([]);

  const [keyword, setKeyword] = useState('');
  const debouncedValue = useDebounce<string>(keyword, 500);

  const inputRef = useRef<HTMLInputElement>(null);
  const setCurrentChannelMemberNum = useSetRecoilState(currentChannelNum);

  const searchUserList = useCallback(() => {
    const keyword = inputRef.current?.value!;
    setKeyword(keyword);
  }, []);

  const userListApi = useCallback(
    async (keyword: string) => {
      if (!endCheckRef.current) {
        const response = await searchNotChannelMemberList(
          channelId,
          keyword,
          sequenceRef.current
        );
        const data = response.data.channelMemberGetResponseDTOList;
        if (data.length === 0) {
          setIsLoaded(false);
          setEndCheck(true);
          return;
        }
        if (data) {
          const list = data.filter((user: channelMemberType) => {
            return userBadgeList.find((badge) => badge.email === user.email)
              ? false
              : true;
          });
          setAllUserList((prev) => [...prev, ...data]);
          setUserList((prev) => [...prev, ...list]);
          setSequence((prev) => prev + 1);
        }
      }
    },
    [channelId, userBadgeList]
  );

  const inviteUserApi = useCallback(
    async (body: inviteMembersType) => {
      await inviteChannelMember(channelId!, body);
      const newMember = body.emailList.length;
      setCurrentChannelMemberNum((prev) => prev + newMember);
      exitModal();
    },
    [channelId]
  );

  const createUserBadge = useCallback(
    (name: string, email: string) => {
      setUserBadgeList([
        ...userBadgeList,
        {
          name,
          email,
        },
      ]);
      setInviteUserList([...inviteUserList, email]);
    },
    [userBadgeList, inviteUserList]
  );

  useEffect(() => {
    const list = allUserList.filter((user: channelMemberType) => {
      return userBadgeList.find((badge) => badge.email === user.email)
        ? false
        : true;
    });
    setUserList(list);
  }, [userBadgeList]);

  const deleteUserBadge = useCallback(
    (email: string) => {
      setUserBadgeList(userBadgeList.filter((data) => data.email !== email));
      setInviteUserList(inviteUserList.filter((data) => data !== email));
    },
    [userBadgeList, inviteUserList]
  );

  useEffect(() => {
    if (channelId && isOpen) {
      initModal();
      userListApi(debouncedValue);
    }
  }, [debouncedValue, channelId]);

  const registMember = () => {
    const body = {
      emailList: inviteUserList,
    };
    inviteUserApi(body);
  };

  const initModal = useCallback(() => {
    setAllUserList([]);
    setInviteUserList([]);
    setUserList([]);
    setSequence(1);
    setEndCheck(false);
  }, []);

  const exitModal = useCallback(() => {
    inputRef.current!.value = '';
    setKeyword('');
    initModal();
    setUserBadgeList([]);
    onClose();
  }, [onClose, initModal]);

  useEffect(() => {
    if (isOpen) {
      let observer: any;
      if (target) {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0.2,
        });
        observer.observe(target);
      }
      return () => observer && observer.disconnect();
    }
  }, [target, isOpen, debouncedValue]);

  const onIntersect = async ([entry]: any, observer: any) => {
    if (entry.isIntersecting && !isLoaded) {
      observer.unobserve(entry.target);
      await userListApi(debouncedValue);
      observer.observe(entry.target);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <Container>
        <Header>
          <TextContainer>
            <Text size={18}>멤버 초대</Text>
            <Text size={12} color="gray500">
              워크스페이스 내의 멤버를 채널에 초대할 수 있습니다.
            </Text>
          </TextContainer>
          <Icons icon="xMark" width="32" height="32" onClick={exitModal} />
        </Header>

        <InputBox
          label="검색"
          placeholder="이름을 입력해주세요."
          ref={inputRef}
          onChange={searchUserList}
        />
        <UserBox>
          {userList.map((user: channelMemberType) => (
            <UserInfoWrapper
              key={user.email}
              onClick={() => createUserBadge(user.name, user.email)}
            >
              <UserInfo
                name={user.name}
                email={user.email}
                nickname={user.nickname}
                profileImage={user.profileImage}
                statusCode={user.statusCode}
              />
            </UserInfoWrapper>
          ))}
          <div
            ref={setTarget}
            style={{
              width: '100vw',
              height: '5px',
            }}
          ></div>
        </UserBox>
        <Label label="추가 멤버 목록" />
        <UserBadgeWrapper>
          {userBadgeList.map((data) => {
            return (
              <BadgeBox key={data.email}>
                <UserBadge
                  name={data.name}
                  email={data.email}
                  onDelete={deleteUserBadge}
                />
              </BadgeBox>
            );
          })}
        </UserBadgeWrapper>
        <ButtonBox>
          <Button
            width="125"
            height="35"
            text="취소"
            bgColor="gray300"
            onClick={exitModal}
          />
          <Button width="125" height="35" text="추가" onClick={registMember} />
        </ButtonBox>
      </Container>
    </Modal>
  );
};

export default ChannelAddMemberModal;
