import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Avatar, Button, Card, Divider, Input, Typography, Spin, Comment, Tooltip } from "antd";
import { useHistory } from 'react-router-dom';
import { useGetSpecificSenior, useDeleteListSenior, useDestroyComment } from "services/seniorService";
import { useModifySenior, usePostLike } from "hooks/useModifySenior";
import ConfirmPopup from "views/management/components/dialog/ConfirmPopup";
import Meta from "antd/lib/card/Meta";
import { useSubscription, gql } from "@apollo/client";
import {
  LikeOutlined,
  CommentOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import format from 'date-fns/format';

const { TextArea } = Input;

const USER_SUBSCRIPTION = gql`
  subscription($postId: ID!) {
    commentAdded(postId: $postId) {
      _id
      name
      avatar
      date
      text
    }
  }
`;

const SeniorDetail: React.FC = () => {
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const { isLoading: deleteLoading, mutate: removeSeniors } = useDeleteListSenior();

  const {  mutate: removeComment } = useDestroyComment();

  const { mutate: modifySenior, isLoading: modifyLoading } = useModifySenior();
  const { mutate: modifyLike, isLoading: likeLoading } = usePostLike();

  const {
    data: _subscriptionData,
    loading: _subscriptionLoading,
  } = useSubscription(USER_SUBSCRIPTION, {
    variables: { postId: id },
    onSubscriptionData: (data) => {
      console.log(data);
      setPost(prePost => ({
        ...prePost,
        comments: [data.subscriptionData.data.commentAdded, ...prePost.comments]
      }));
    }
  });

  const { data, isFetching } = useGetSpecificSenior(id);

  const history = useHistory();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [post, setPost] = useState<any>(null);
  const commentRef = useRef<any>("");

  useEffect(() => {
    if (data) {
      setPost(data.post);
    }
  }, [data]);

  const handleSave = () => {
    modifySenior({
      postId: post._id,
      data: commentRef.current
    });
  }

  const handleComment = (e):void => {
    commentRef.current = e.target.value;
  }

  const handleLike = () => {
    modifyLike({
      postId: post._id
    },
    {
      onSuccess: (response: any) => {
        setPost(preValue => {
          return {
            ...preValue,
            likes: [...response.toggleLike.likes]
          }
        })
      }
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
          <Button icon={<LikeOutlined />} loading={likeLoading} onClick={handleLike}> {post.likes.length}</Button>,
          <Button icon={<CommentOutlined />} loading={modifyLoading} onClick={handleSave}> {post.comments.length}</Button>,
          <Button icon={<DeleteOutlined />} loading={deleteLoading} danger onClick={() => setIsOpenDelete(true)}></Button>,
        ]}
      >
        <div style={{ marginBottom: 20 }}>
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={post.name}
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
            <Comment
              key={element._id}
              actions={[<span
                key="comment-basic-reply-to"
                onClick={() => removeComment({postId: post._id, commentId: element._id})}>Delete</span>
              ]}
              style={{ marginBottom: 10 }}
              author={element.name}
              avatar={<Avatar src={element.avatar} />}
              content={element.text}
              datetime={
                <Tooltip title={format(new Date(post.date), 'LLL dd yyyy, hh:mmaaa')}>
                  <span>{format(new Date(post.date), 'LLL dd yyyy, hh:mmaaa')}</span>
                </Tooltip>
              }
            />
          ) : null
        }
        <TextArea className="text-area" style={{ height: 150}} onChange={handleComment}>
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
  .ant-btn {
    border: 0px;
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