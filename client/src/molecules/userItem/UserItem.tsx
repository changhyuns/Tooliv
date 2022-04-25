import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import Dropdown from '../../atoms/dropdown/Dropdown';
import Avatar from '../../atoms/profile/Avatar';
import Text from '../../atoms/text/Text';
import { userItemTypes, userSelectorTypes } from '../../types/common/userTypes';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 470px;
  padding: 8px 16px;
`;

const AvatarBox = styled.div`
  margin-right: 12px;
`;
const UserBox = styled.div`
  display: flex;
  align-items: center;
`;
const ControlBox = styled.div`
  display: flex;
  align-items: center;
`;
const DropdownBox = styled.div`
  margin-right: 20px;
`;
const ButtonBox = styled.div`
  cursor: pointer;
`;

type selectType = {
  value: string;
  label: string;
};
const UserItem = ({
  name,
  email,
  userCode,
  onDelete,
  onChange,
}: // onChange,
userItemTypes) => {
  const [selectedOption, setSelectedOption] = useState<selectType>();

  const handleChangeUserCode = (data: userSelectorTypes) => {
    setSelectedOption(data);
    onChange(data.value, email);
  };
  const handleDelete = () => {
    onDelete(email);
  };
  const userInfo = `${name}(${email})`;
  const options = [
    { value: 'MANAGER', label: '관리자' },
    { value: 'USER', label: '일반' },
  ];
  useEffect(() => {
    const defaultValue = options.find((op) => op.value === userCode);
    setSelectedOption(defaultValue!);
  }, []);

  return (
    <Item>
      <UserBox>
        <AvatarBox>
          <Avatar size="24" />
        </AvatarBox>
        <Text size={14}>{userInfo}</Text>
      </UserBox>
      <ControlBox>
        <DropdownBox>
          <Dropdown
            options={options}
            onChange={handleChangeUserCode}
            selected={selectedOption!}
          />
        </DropdownBox>
        <ButtonBox>
          <Text size={12} color="gray500" onClick={handleDelete}>
            삭제
          </Text>
        </ButtonBox>
      </ControlBox>
    </Item>
  );
};

export default UserItem;
