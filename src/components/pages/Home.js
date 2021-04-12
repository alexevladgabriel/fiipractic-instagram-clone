//! react
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

//! store
import { useStoreState } from "easy-peasy";
import { db } from "utils/firebase";

//! antd
import { Avatar } from "antd";

//! components
import Post from "components/elements/Post";

//! styled
import styled from "styled-components";
import tw from "twin.macro";

const StyledContainer = styled.div`
  ${tw`grid grid-cols-2 mt-8 justify-items-end`}//${tw`flex flex-row justify-center mt-8`}
`;
const PostsContainer = styled.div`
  width: 614px;
  margin-right: -5em;
  //margin-right: 2em;
`;
const DetailsContainer = styled.div`
  margin: 1em 38em 0 0;
  ${tw`flex flex-row items-start`}
`;
const StyledAvatar = styled(Avatar)``;
const StyledWrapper = styled.div`
  ${tw`flex flex-col ml-4 text-white font-semibold`}
`;

const StyledTitle = styled.span``;
const StyledSubTitle = styled.span`
  color: #7a7a7a;
  ${tw`font-normal leading-5`}
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const details = useStoreState((state) => state.auth.details);

  //! [0-9][A-Z] = 0A{NANOID(9)} - Unique ID Post Instagram
  //! Exemple:
  //! {NANOID(9)} = oj8Y3A_1k
  //* 28 mar: CMoj8Y3A_1k
  //* 8 febr: CLoj8Y3A_1k
  //* 7 febr: CKoj8Y3A_1k
  //* 13 ian: CJoj8Y3A_1k
  //* 19 dec: CIoj8Y3A_1k
  //! Exemplu Real (de pe profilul meu):
  //! instagram.com/p/B6oj8Y3A_1k/ - B: 2019 6: Decembrie: urmat de nanoid(9)
  //? Se poate spune clar ca Instagram in 2010, a pornit de la [0-9]
  //? si a continuat cu [A-Z] pt id-urile custom generate a postarilor.

  //TODO: API Response - Backend/Firebase
  // const postDetails = {
  //   username: "alexevladgabriel",
  //   avatarUrl: "",
  //   caption: "Mos craciun cu plete dalbe",
  //   photosUrl: [
  //     "https://instagram.fias1-1.fna.fbcdn.net/v/t51.2885-15/e35/80896844_512888059572483_1431706286506574064_n.jpg?tp=1&_nc_ht=instagram.fias1-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=Ah4Ik0qEmUwAX-doJBI&ccb=7-4&oh=03b137e351d78b1851f72047d74f3e38&oe=608963D0&_nc_sid=4f375e",
  //   ],
  //   likes: [
  //     {
  //       username: "mihaiiftodi",
  //       avatarUrl: "",
  //     },
  //   ],
  //   comments: [
  //     {
  //       username: "mihaiiftodi",
  //       avatarUrl: "",
  //       commentText: "Nice job! Keep it up!",
  //       likes: [
  //         {
  //           username: "mihaiiftodi",
  //           avatarUrl: "",
  //         },
  //       ],
  //       comments: [],
  //       timestamp: "March 27, 2021 at 10:13:44 AM UTC+2",
  //     },
  //   ],
  //   timestamp: "March 27, 2021 at 10:13:44 AM UTC+2",
  // };
  const postsCollection = useMemo(() => db.collection("posts"), []);
  useEffect(() => {
    postsCollection.orderBy("timestamp", "desc").onSnapshot((snapshot) =>
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    );
  }, [postsCollection]);

  return (
    <StyledContainer>
      <PostsContainer>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </PostsContainer>
      <DetailsContainer>
        <div className="flex flex-row items-center">
          <Link to={`/${details?.username}/`}>
            <StyledAvatar size={56} src={details?.photoUrl} />
          </Link>
          <StyledWrapper>
            <StyledTitle>{details?.username}</StyledTitle>
            <StyledSubTitle>{details?.name}</StyledSubTitle>
          </StyledWrapper>
        </div>
      </DetailsContainer>
    </StyledContainer>
  );
};

export default Home;
