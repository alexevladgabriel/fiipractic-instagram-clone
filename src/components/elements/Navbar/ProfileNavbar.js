//! react-router
import { NavLink } from "react-router-dom";

//! styled
import styled from "styled-components";
import tw from "twin.macro";

const StyledWrapper = styled.div`
  border-top: 1px solid #262626;
  width: 900px;
`;

const StyledNavbar = styled.div`
  ${tw`flex justify-center text-white text-sm uppercase`}
`;

const StyledContainer = styled.div`
  ${tw`flex items-center`}
`;

const StyledLink = styled(NavLink)`
  ${tw`py-4 px-1`}
  color: #8e8e8e;

  :not(:first-child) {
    ${tw`ml-16`}
  }

  :hover {
    color: #8e8e8e;
  }
  :active {
    color: white;
  }
  svg {
    ${tw`fill-current`}
  }
`;

const StyledText = styled.span`
  ${tw`ml-2`}
`;

const PostIcon = () => (
  <svg
    aria-label="Posts"
    fill="#fafafa"
    height="12"
    viewBox="0 0 48 48"
    width="12"
  >
    <path
      clipRule="evenodd"
      d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z"
      fillRule="evenodd"
    ></path>
  </svg>
);

const SavedIcon = () => (
  <svg
    aria-label="Saved"
    fill="#8e8e8e"
    height="12"
    viewBox="0 0 48 48"
    width="12"
  >
    <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
  </svg>
);

const ProfileNavbar = ({ user, isMyProfile }) => {
  return (
    <StyledWrapper>
      <StyledNavbar>
        <StyledLink
          activeStyle={{
            color: "white",
            borderTop: "1px solid",
            marginTop: "-1px",
          }}
          to={`/${user.username}/`}
          exact
        >
          <StyledContainer>
            <PostIcon />
            <StyledText>Posts</StyledText>
          </StyledContainer>
        </StyledLink>

        {isMyProfile && (
          <StyledLink
            activeStyle={{
              color: "white",
              borderTop: "1px solid",
              marginTop: "-1px",
            }}
            to={`/${user.username}/saved`}
            exact
          >
            <StyledContainer>
              <SavedIcon />
              <StyledText>Saved</StyledText>
            </StyledContainer>
          </StyledLink>
        )}
      </StyledNavbar>
    </StyledWrapper>
  );
};

export default ProfileNavbar;
