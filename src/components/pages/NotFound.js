import { Link } from "react-router-dom";

import styled from "styled-components";
import tw from "twin.macro";

const StyledContainer = styled.div`
  ${tw`text-white text-center`}
`;

const StyledHeader = styled.h1`
  ${tw`text-white font-semibold mt-10`}
  font-size: 20px;
  line-height: 26px;
`;

const StyledDescription = styled.div`
  font-size: 14px;
  ${tw`mt-6`}
`;

const StyledLink = styled(Link)`
  color: #40a9ff;
`;

const NotFound = ({ title, message }) => {
  return (
    <StyledContainer>
      <StyledHeader>
        {title || "Sorry, this page isn't available."}
      </StyledHeader>
      <StyledDescription>
        {message ||
          "The link you followed may be broken, or the page may have been removed."}{" "}
        <StyledLink to={"/"}>Go back to Instagram</StyledLink>
      </StyledDescription>
    </StyledContainer>
  );
};

export default NotFound;
