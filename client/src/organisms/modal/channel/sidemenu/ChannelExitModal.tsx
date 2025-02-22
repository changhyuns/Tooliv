import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { deleteChannelMember } from 'api/channelApi';
import Icons from 'atoms/common/Icons';
import Text from 'atoms/text/Text';
import { BulrContainer } from 'organisms/meeting/video/ScreenShareModal';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentChannel,
  currentChannelNum,
  exitChannelId,
  userLog,
} from 'recoil/atom';
import { user } from 'recoil/auth';
import { exitChannelModalType } from 'types/channel/contentType';
import Swal from 'sweetalert2';
import { useEffect, useRef } from 'react';

const Modal = styled.div<{ isOpen: boolean; top: number; left: number }>`
  display: none;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 1;
  /* left: 20px; */

  ${(props) =>
    props.isOpen &&
    css`
      display: block;
    `}
`;

const Container = styled.div`
  width: 130px;
  padding: 5px 0;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListItem = styled.div`
  padding: 5px 30px 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.dropdownHoverColor};
  }
`;

const ChannelExitModal = ({
  isOpen,
  channelId,
  top,
  left,
  onClose,
}: exitChannelModalType) => {
  const { workspaceId } = useParams();
  const { email } = useRecoilValue(user);
  const setCurrentChannelId = useSetRecoilState(currentChannel);
  const setExitChannelId = useSetRecoilState(exitChannelId);
  const [userLogList, setUserLogList] = useRecoilState(userLog);
  const [isBulr, setIsBulr] = useState(false);
  const navigate = useNavigate();
  const exitModalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = ({ target }: any) => {
    if (isOpen && !exitModalRef.current?.contains(target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 채널 떠나기 클릭시 이벤트
  const exitChannelClick = () => {
    setIsBulr(true);
    Swal.fire({
      title: '채널 탈퇴 확인',
      text: '해당 채널을 떠나시겠습니까?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        exitChannel();
      }
      setIsBulr(false);
    });
  };
  const exitChannel = async () => {
    const response = await deleteChannelMember(channelId!, email);
    const nextChannelId = response.data.defaultChannelId;
    console.log(response);
    setUserLogList({
      ...userLogList,
      [workspaceId!]: nextChannelId,
    });
    setExitChannelId(channelId!);
    setCurrentChannelId(nextChannelId);
    navigate(`${workspaceId}/${nextChannelId}`);
  };

  return (
    <Modal isOpen={isOpen} top={top} left={left}>
      {isBulr && <BulrContainer />}
      <Container ref={exitModalRef}>
        <ListItem onClick={exitChannelClick}>
          <Icons color="secondary" icon="xMark" />
          <Text color="secondary" size={14} pointer>
            채널 나가기
          </Text>
        </ListItem>
      </Container>
    </Modal>
  );
};
export default ChannelExitModal;
