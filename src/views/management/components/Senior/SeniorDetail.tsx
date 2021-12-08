import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Button, Card, Divider, Input, Typography, Spin } from "antd";
import { useHistory } from 'react-router-dom';
import { useGetSpecificSenior, useDeleteListSenior } from "services/seniorService";
import { useModifySenior } from "hooks/useModifySenior";
import ConfirmPopup from "views/management/components/dialog/ConfirmPopup";
import Meta from "antd/lib/card/Meta";
import {
  LikeOutlined,
  CommentOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import format from 'date-fns/format';

const { TextArea } = Input;

const SeniorDetail: React.FC = () => {
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const { isLoading: deleteLoading, mutate: removeSeniors } = useDeleteListSenior();

  const { mutate: modifySenior, isLoading: modifyLoading } = useModifySenior();

  const { data, isFetching } = useGetSpecificSenior(id);

  const history = useHistory();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setPost(data.post);
    }
  }, [data]);

  const handleSave = () => {
    const params: any = {};
    modifySenior({
      seniorId: post._id,
      data: params
    });
  }

  const handelDeleteConfirm = ():void => {
    removeSeniors([id], {
      onSettled: () => {
        history.push('/management/seniors');
      }
    });
  };

  if (isFetching) {
    return (
      <Example className="example">
        <Spin />
      </Example>
    )
  }

  if (!post) {
    return (
      <></>
    )
  }

  return (
    <SeniorDetailContainer>
      <Card
        style={{ width: "70%", maxWidth: 500 }}
        actions={[
          <Button icon={<LikeOutlined />}> {post.likes.length}</Button>,
          <Button icon={<CommentOutlined />} loading={modifyLoading} onClick={handleSave}> {post.comments.length}</Button>,
          <Button icon={<DeleteOutlined />} loading={deleteLoading} danger onClick={() => setIsOpenDelete(true)}></Button>,
        ]}
      >
        <div style={{ marginBottom: 20 }}>
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title="Name Viewer"
            description={format(new Date(post.date), 'LLL dd yyyy, hh:mmaaa')}
          />
        </div>
        <div>
          <Typography>
            {post.text}
          </Typography>
        </div>
        <Divider />
        {
          post.comments.length > 0 ? post.comments.map(element => 
            <Meta
              key={element._id}
              avatar={<Avatar src={element.avatar} />}
              style={{ marginBottom: 10 }}
              title={element.name}
              description={element.text}
            />
          ) : null
        }
        <TextArea className="text-area" style={{ height: 150}}>
        </TextArea>
      </Card>
      <ConfirmPopup
        title={`Warning`}
        setIsOpen={setIsOpenDelete}
        isOpen={isOpenDelete}
        handleConfirm={handelDeleteConfirm}
        message={`Are you sure you want to delete it?`}
      />
    </SeniorDetailContainer>
  );
};

export default SeniorDetail;

const SeniorDetailContainer = styled.div`
  padding: 10px 20px;
  .ant-form-item-label {
    padding-right: 40px;
  }
  .text-area {
    margin-top: 20px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    border-bottom: none;
    .ant-btn-primary {
      border-radius: 7px;
      margin-left: 30px;
      padding: 0px 35px;
    }
  }
`;

const Example = styled.div`
  margin: 20px 0;
  margin-bottom: 20px;
  padding: 30px 50px;
  text-align: center;
`