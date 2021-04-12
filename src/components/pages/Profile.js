//! react
import { useEffect, useState, useMemo } from "react";

//! react router
import { useHistory, useParams } from "react-router";
import { Switch, Route, Link } from "react-router-dom";

//! store
import { useStoreState } from "easy-peasy";

//! firebase
import { db } from "utils/firebase";

//! styled
import styled, { css } from "styled-components";
import tw from "twin.macro";

//! antd
import { Avatar } from "antd";
import { Skeleton } from "antd";

//! components
import AvatarUploadModal from "components/elements/Avatar";
import ProfileNavbar from "components/elements/Navbar/ProfileNavbar";

const ProfileWrapper = styled.div`
  ${tw`flex flex-col items-center mt-8`}
`;

const ProfileDetails = styled.div`
  ${tw`flex flex-row items-start`}
  width: 900px;
  height: 280px;
`;

const ProfilePhoto = styled(Avatar)`
  ${tw`mx-8`}
`;

const ProfileInfo = styled.div`
  ${tw`ml-14 text-white`}
  max-width: 600px;
`;

const ProfileButtonFollow = css`
  border: 1px solid #0095f6;
  background-color: #0095f6;
  padding: 5px 25px;
  ${tw`text-sm`}
`;

const ProfileButton = styled.button`
  border: 1px solid;
  ${tw`ml-6 px-3 text-base border-insta-gray rounded`}

  a {
    ${tw`text-white`}
  }

  ${(props) => props.follow && ProfileButtonFollow}
`;

const ProfileUsername = styled.span`
  ${tw`text-2xl font-light flex`}
`;

const ProfileStats = styled.div`
  ${tw`mt-4`}
`;

const ProfileText = styled.span`
  ${tw`mr-14 text-base`}
`;

const ProfileName = styled.div`
  ${tw`mt-4 text-base`}
`;

const ProfileDescription = styled.p``;

const ProfileSiteURL = styled.a`
  ${tw`font-semibold`}
  color: #e0f1ff;
  font-size: 16px;
  :hover {
    color: #e0f1ff;
  }
`;

const ProfilePosts = styled.div`
  ${tw`relative grid grid-cols-3 gap-7 self-center mb-12`}
`;

const StyledPost = styled.div`
  width: 280px;
  height: 280px;

  ${tw`cursor-pointer`}
  :hover {
    opacity: 0.4;
  }
`;
const StyledPostImage = styled.img`
  ${tw`w-full h-full object-cover object-left`}
`;

const Post = ({
  id,
  //avatarUrl,
  //stats,
  //timestamp,
  //username,
  photoUrl,
  caption,
}) => {
  return (
    <StyledPost>
      <Link to={`/p/${id}`}>
        <StyledPostImage src={photoUrl} alt={caption} />
      </Link>
    </StyledPost>
  );
};

const Profile = () => {
  //! history & params
  const history = useHistory();
  const { userid } = useParams();

  //! states
  const details = useStoreState((state) => state.auth.details);
  const [user, setUser] = useState({});

  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const getUser = async (id) => {
    await db
      .collection("users")
      .where("username", "==", id)
      .get()
      .then((res) => {
        res.empty && history.push("/");
        res.forEach((doc) => {
          setUser({ id: doc.id, ...doc.data() });
        });
      });
  };

  useEffect(() => {
    getUser(userid);
    //* Aparent ce bug frumos era, te duceai pe profilul unei persoane
    //* si dupa cand te duceai pe profilul tau si dadea back page,
    //* ramaneau optiunile de edit profile & upload photo
    setIsMyProfile(false);
    //* Scai fixing the bugs
    details?.username === userid && setIsMyProfile(true);
  }, [details, userid]);

  //! Section - Posts ------------------------------------<
  const [posts, setPosts] = useState([]);

  const postsCollection = useMemo(
    () => db.collection("posts").where("username", "==", userid),
    [userid]
  );

  useEffect(() => {
    postsCollection.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const test = new Promise((resolve) => {
          doc.ref.collection("likes").onSnapshot((snapshot) => {
            const likes = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            resolve(likes);
          });
        });

        const test2 = new Promise((resolve) => {
          doc.ref.collection("comments").onSnapshot((snapshot) => {
            const comments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            resolve(comments);
          });
        });

        var obj = {};
        Promise.all([test, test2]).then((s) => {
          obj.likes = s[0];
          obj.comments = s[1];
        });

        return {
          id: doc.id,
          ...doc.data(),
          stats: obj,
        };
      });

      setPosts(posts);
    });
  }, [postsCollection]);

  //! Section - Followers ------------------------------------<
  const [followers, setFollowers] = useState([]);
  const [alreadyFollowing, setAlreadyFollowing] = useState();

  const followCollection = useMemo(
    () => db.collection("users").doc(user.id).collection("followers"),
    [user]
  );

  useEffect(() => {
    followCollection.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowers(docs);

      setAlreadyFollowing(
        docs.find((follow) => follow.username === details.username)
      );
    });
  }, [followCollection, details]);

  //! Section - Following ------------------------------------<
  const [following, setFollowing] = useState([]);

  const followingCollection = useMemo(
    () => db.collection("users").doc(user.id).collection("following"),
    [user]
  );

  useEffect(() => {
    followingCollection.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowing(docs);
    });
  }, [followingCollection]);

  //! Section - Following Authenticated User ------------------------------------<
  const [authAlreadyFollowing, setAuthAlreadyFollowing] = useState();

  const followingAuthCollection = useMemo(
    () => db.collection("users").doc(details?.id).collection("following"),
    [details]
  );

  useEffect(() => {
    followingAuthCollection.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAuthAlreadyFollowing(
        docs.find((doc) => doc.username === user.username)
      );
    });
  }, [followingAuthCollection, user]);

  //! Section - Posts Saved Authenticated User ------------------------------------<
  const [postsSaved, setPostsSaved] = useState([]);

  const postsSavedCollection = useMemo(
    () => db.collection("users").doc(details?.id).collection("saved"),
    [details]
  );

  useEffect(() => {
    postsSavedCollection.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const post = new Promise((resolve) => {
          doc
            .data()
            .postRef.get()
            .then((doc) => {
              resolve({ id: doc.id, ...doc.data() });
            });
        });

        var data = {};
        Promise.all([post]).then((s) => {
          data.postRef = s[0];
        });

        return {
          id: doc.id,
          data,
        };
      });
      setPostsSaved(docs);
    });
  }, [postsSavedCollection]);

  //! Handles
  const handleFollow = async () => {
    if (!!authAlreadyFollowing) {
      await followingAuthCollection.doc(authAlreadyFollowing.id).delete();
    }
    if (!!alreadyFollowing) {
      await followCollection.doc(alreadyFollowing.id).delete();
    } else {
      followCollection.add({
        name: details.name,
        username: details.username,
        avatarUrl: details.photoUrl,
      });

      followingAuthCollection.add({
        name: user.name,
        username: user.username,
        avatarUrl: user.photoUrl,
      });
    }
  };

  //! Utils
  const formatDescription = (description) => {
    return description.split("\n").map((text, index) => (
      <span className="text-base" key={index}>
        {text}
        <br />
      </span>
    ));
  };

  const formatUrl = (url) => {
    return url.replace(/(^\w+:|^)\/\//, "");
  };

  return (
    <ProfileWrapper>
      <ProfileDetails>
        {isMyProfile ? (
          <>
            {user?.photoUrl ? (
              <ProfilePhoto
                className="cursor-pointer"
                onClick={() => setModalOpen(true)}
                size={150}
                src={user?.photoUrl}
              />
            ) : (
              <ProfilePhoto
                className="cursor-pointer"
                onClick={() => setModalOpen(true)}
                size={150}
              >
                {user?.username?.[0].toUpperCase()}{" "}
              </ProfilePhoto>
            )}
          </>
        ) : (
          <>
            {user?.photoUrl ? (
              <ProfilePhoto size={150} src={user?.photoUrl} />
            ) : (
              // <ProfilePhoto onClick={() => setModalOpen(true)} size={150}>
              //   {user?.username?.[0].toUpperCase()}{" "}
              //     </ProfilePhoto>
              <Skeleton.Avatar active size={150} />
            )}
          </>
        )}

        <AvatarUploadModal isOpened={isModalOpen} setIsOpen={setModalOpen} />

        <ProfileInfo>
          {/* username */}
          <ProfileUsername>
            {user?.username}
            {isMyProfile ? (
              <ProfileButton>
                <Link to={"/accounts/edit"}>Edit profile</Link>
              </ProfileButton>
            ) : alreadyFollowing?.username === details?.username ? (
              <ProfileButton onClick={() => handleFollow()}>
                Following
              </ProfileButton>
            ) : (
              <ProfileButton onClick={() => handleFollow()} follow>
                Follow
              </ProfileButton>
            )}
          </ProfileUsername>
          {/* stats */}
          <ProfileStats>
            <ProfileText>
              <strong>{posts.length ?? 0}</strong> posts
            </ProfileText>
            <ProfileText>
              <strong>{followers.length}</strong> followers
            </ProfileText>
            <ProfileText>
              <strong>{following.length}</strong> following
            </ProfileText>
          </ProfileStats>
          {/* name */}
          <ProfileName>
            <strong>{user?.name}</strong>
          </ProfileName>
          {/* description */}
          <ProfileDescription>
            {user?.description && formatDescription(user.description)}
          </ProfileDescription>
          {/* siteurl */}
          <ProfileSiteURL href={user?.siteUrl} target="_blank">
            {user?.siteUrl && formatUrl(user.siteUrl)}
          </ProfileSiteURL>
        </ProfileInfo>
      </ProfileDetails>

      {details && <ProfileNavbar user={user} isMyProfile={isMyProfile} />}

      <Switch>
        <Route
          path={`/${user.username}`}
          render={() => (
            <ProfilePosts>
              {posts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </ProfilePosts>
          )}
          exact
        />
        <Route
          path={`/${user.username}/saved`}
          render={() => (
            <ProfilePosts>
              {postsSaved.map((post) => (
                <Post key={post.data.id} {...post.data.postRef} />
              ))}
            </ProfilePosts>
          )}
          exact
        />
      </Switch>

      {/* posts */}
    </ProfileWrapper>
  );
};

export default Profile;
