import { useState, useEffect, useMemo } from "react";

import {
  HeartOutlined,
  HeartFilledRed,
  CommentIcon,
  ShareIcon,
  EmojiPickerIcon,
  SaveFilledIcon,
  SaveOutlinedIcon,
} from "./icons";

//! react router
import { Link } from "react-router-dom";

//! forms
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//! store
import { useStoreState } from "easy-peasy";

//! firebase
import firebase, { db } from "utils/firebase";

//! styles
import styled from "styled-components";
import tw from "twin.macro";

//! vendors
import moment from "moment";

const PostContainer = styled.article`
  ${tw`p-0 flex flex-col border-insta-gray`}
  margin-bottom: 60px;
  border-radius: 3px;
  border: 1px solid;
`;

const PostHeader = styled.header`
  ${tw`flex flex-row items-center bg-black`}
  height: 60px;
  padding: 16px;
`;

const PostAvatar = styled.div`
  ${tw`block relative`}
  height: -moz-fit-content;
  width: -moz-fit-content;
`;

const PostCanvas = styled.canvas`
  ${tw`absolute`}
  height: 38px;
  width: 38px;
  top: -5px;
  left: -5px;
`;

const PostLink = styled(Link)`
  ${tw`block w-8 h-8 relative overflow-hidden box-border rounded-full`}
  background-color: #fafafa;
  flex: 0 0 auto;
`;

const PostUsername = styled.div`
  ${tw`flex flex-grow flex-shrink items-start overflow-hidden `}
  margin-left: 14px;
`;

const PostUsernameContainer = styled.div`
  ${tw`overflow-hidden items-center flex-row flex-shrink flex-grow max-w-full`}
  padding: 2px;
  top: 1px;
`;

const PostUsernameLink = styled(Link)`
  ${tw`text-white`}
  :hover {
    ${tw`text-white underline`}
  }
`;

const PostImageContainer = styled.div`
  ${tw`relative m-0 p-0 flex flex-col flex-shrink-0 items-stretch box-border`}
  border: 0 solid black;
`;

const PostImage = styled.img`
  ${tw`w-full h-full select-none object-cover`}
`;

const PostHeartButton = styled.div``;
const PostTest = styled.div`
  ${tw`block overflow-hidden`}
`;

const PostDetails = styled.div`
  ${tw`bg-black text-white`}
`;

const ActionButtonsList = styled.ul``;
const ActionButtonsItem = styled.li`
  ${tw`cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 active:scale-110`}

  ${(props) => props.blocked && tw`cursor-not-allowed`}
`;

const PostCommentsButton = styled.button`
  color: rgba(142, 142, 142, 1);
`;

const PostComment = styled.div``;
const PostCommentUsername = styled(Link)`
  ${tw`font-bold`}
  :hover {
    ${tw`text-white underline`}
  }
`;

const PostCommentViewMore = styled.button`
  ${tw`border-none`}
  color: rgba(142, 142, 142, 1);
`;

const PostTime = styled.span`
  ${tw`uppercase font-normal`};
  font-size: 10px;
  color: #8e8e8e;
`;

const PostFormContainer = styled.section`
  ${tw`flex mt-2 px-4 flex-shrink-0 justify-center`}
  border-top: 1px solid #262626;
  line-height: 18px;
  min-height: 56px;
`;

const PostForm = styled(Form)`
  ${tw`relative flex flex-row flex-grow items-center justify-between`}
`;

const PostFormInput = styled(Field)`
  ${tw`text-white`}
  height: 19px;
  width: 85%;
  ::placeholder {
    color: #4c4c4c;
  }
`;

const PostFormSubmit = styled.button`
  color: rgba(0, 149, 246, 1);
  :disabled {
    ${tw`cursor-auto`}
    opacity: 0.3;
  }
`;

const Post = ({ id, username, avatarUrl, photoUrl, caption, timestamp }) => {
  //! Section - States ------------------------------------<
  const user = useStoreState((state) => state.auth.details);
  const [strippedCaption, setStrippedCaption] = useState(
    caption?.substring(0, 128)
  );
  const [activeCaption, setActiveCaption] = useState(false);
  //const [openedLikesModal, setOpenedLikesModal] = useState(false);

  //! Section - Likes ------------------------------------<
  const [likes, setLikes] = useState([]);
  const [alreadyLiked, setAlreadyLiked] = useState();

  const postLikes = useMemo(
    () => db.collection("posts").doc(id).collection("likes"),
    [id]
  );

  useEffect(() => {
    postLikes.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLikes(docs);
      setAlreadyLiked(docs.find((like) => like.username === user?.username));
    });
  }, [postLikes, user]);

  //! Section - Comments ------------------------------------<
  const [comments, setComments] = useState([]);

  const postComments = useMemo(
    () => db.collection("posts").doc(id).collection("comments"),
    [id]
  );

  useEffect(() => {
    postComments.orderBy("timestamp").onSnapshot((snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, [postComments]);

  //! Section - Save ------------------------------------<
  const [alreadySaved, setAlreadySaved] = useState();

  const postSaved = useMemo(
    () => db.collection("users").doc(user.id).collection("saved"),
    [user]
  );

  useEffect(() => {
    postSaved.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //! reserving that piece of code for future
      // docs.map((doc) =>
      //   doc.postRef
      //     .get()
      //     .then((doc) => setAlreadySaved({ id: doc.id, ...doc.data() }))
      // );

      setAlreadySaved(docs.find((doc) => doc.postId === id));
    });
  }, [postSaved, id]);

  //! Section - Handles ------------------------------------<
  const handleLike = async () => {
    if (!!alreadyLiked) await postLikes.doc(alreadyLiked.id).delete();
    else {
      postLikes.add({ username: user.username, avatarUrl: user.photoUrl });
    }
  };

  const handleComment = ({ commentText }, { setSubmitting, resetForm }) => {
    if (!commentText.trim()) return;

    postComments.add({
      username: user.username,
      commentText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setSubmitting(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!!alreadySaved) {
      await postSaved.doc(alreadySaved.id).delete();
      //console.log("sunt aici; roger that going dark");
    } else {
      postSaved.add({
        postId: id,
        postRef: db.doc("posts/" + id),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return (
    <PostContainer>
      <PostHeader>
        <PostAvatar>
          <div className="flex relative">
            <PostCanvas></PostCanvas>
            <PostLink to={`/${username}`}>
              <img
                className="w-full h-full"
                src={avatarUrl}
                alt={`${username} avatar`}
              />
            </PostLink>
          </div>
        </PostAvatar>

        <PostUsername>
          <div style={{ maxWidth: "220px" }}>
            <PostUsernameContainer>
              <span className="inline relative">
                <PostUsernameLink className="text-white" to={`/${username}`}>
                  {username}
                </PostUsernameLink>
              </span>
            </PostUsernameContainer>
          </div>
        </PostUsername>
      </PostHeader>
      <PostImageContainer>
        <PostHeartButton onDoubleClick={handleLike}>
          <PostTest>
            <PostImage src={photoUrl} alt={caption} />
          </PostTest>
        </PostHeartButton>
      </PostImageContainer>
      <PostDetails>
        <div className="mt-1 p-2 flex flex-row justify-between">
          <ActionButtonsList className="flex ml-2 space-x-3">
            <ActionButtonsItem onClick={handleLike}>
              {alreadyLiked?.username === user?.username ? (
                <HeartFilledRed />
              ) : (
                <HeartOutlined />
              )}
            </ActionButtonsItem>
            {/* Next update */}
            <ActionButtonsItem blocked>
              <CommentIcon />
            </ActionButtonsItem>
            <ActionButtonsItem blocked>
              <ShareIcon />
            </ActionButtonsItem>
            {/* Next update */}
          </ActionButtonsList>
          <ActionButtonsItem
            onClick={handleSave}
            className="list-none mr-2 cursor-pointer"
          >
            {alreadySaved?.postId === id ? (
              <SaveFilledIcon />
            ) : (
              <SaveOutlinedIcon />
            )}
          </ActionButtonsItem>
        </div>
        <div className="my-1 mx-4">
          <div className="w-full text-sm font-semibold">
            {likes.length} {likes.length === 1 ? "like" : "likes"}
          </div>
          <PostComment>
            <PostCommentUsername to={`/${username}`}>
              {username}
            </PostCommentUsername>{" "}
            {caption?.length > 256
              ? `${
                  strippedCaption && activeCaption
                    ? strippedCaption
                    : `${strippedCaption}...`
                }`
              : caption ?? ""}{" "}
            {(caption?.length > 256) & !activeCaption ? (
              <PostCommentViewMore
                onClick={() => {
                  setStrippedCaption(caption);
                  setActiveCaption(true);
                }}
              >
                more
              </PostCommentViewMore>
            ) : (
              ""
            )}
          </PostComment>
          <div>
            {comments.length > 2 ? (
              <PostCommentsButton>
                View all {comments.length} comments
              </PostCommentsButton>
            ) : (
              ""
            )}
          </div>
          {comments.map(({ username, commentText }, index) => (
            <PostComment key={username + index}>
              <PostCommentUsername to={`/${username}`}>
                {username}
              </PostCommentUsername>{" "}
              {commentText}
            </PostComment>
          ))}
          <PostTime>{moment(timestamp?.toDate()).fromNow()}</PostTime>
        </div>
        <PostFormContainer>
          <div className="flex w-full">
            <Formik
              initialValues={{
                commentText: "",
              }}
              validationSchema={Yup.object().shape({
                commentText: Yup.string()
                  .strict(true)
                  .trim()
                  .min(1, "Must be longer than 3 characters")
                  .max(256, "Must be smaller than 256 characters")
                  .required("Please provide a text"),
              })}
              onSubmit={handleComment}
            >
              {({ isSubmitting, isValid }) => (
                <PostForm>
                  {/*
                  //? Se poate decomenta, si o sa se vada exact emoji picker, nefunctional

                  */}
                  <button
                    type="button"
                    className="outline-none cursor-not-allowed"
                  >
                    <div>
                      <EmojiPickerIcon />
                    </div>
                  </button>
                  <PostFormInput
                    id="commentText"
                    name="commentText"
                    className="bg-black resize-none outline-none"
                    placeholder="Add a comment…"
                  ></PostFormInput>
                  <PostFormSubmit
                    disabled={isSubmitting || !isValid}
                    type="submit"
                  >
                    Post
                  </PostFormSubmit>
                </PostForm>
              )}
            </Formik>
          </div>
        </PostFormContainer>
      </PostDetails>
    </PostContainer>
  );
};

export default Post;
