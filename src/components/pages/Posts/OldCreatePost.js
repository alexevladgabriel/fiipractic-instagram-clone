import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";

//! store
import { useStoreState, useStoreActions } from "easy-peasy";

//! styled
import styled from "styled-components";
import tw from "twin.macro";

const StyledContainer = styled.div`
  ${tw`flex justify-center mt-8`}
`;

const StyledImagePreview = styled.div`
  ${tw`flex`}
`;

const StyledSideBar = styled.div`
  ${tw`ml-4 w-1/2 h-1/2 bg-gray-900`}
`;

const StyledNav = styled.nav`
  ${tw`h-10 flex items-center bg-gray-700`}
  ${tw`list-none text-white text-center`}
`;

const StyledButton = styled.button`
  ${tw`w-1/2`}
`;

const StyledGrid = styled.div`
  ${tw`flex flex-col`}
`;
const StyledSubmit = styled.button``;

const CreatePost = () => {
  const history = useHistory();
  const file = useStoreState((state) => state.storage.file);
  const setFile = useStoreActions((action) => action.storage.setFile);
  const [preview, setPreview] = useState();

  const handleUpload = () => {};

  useEffect(() => {
    if (!file) history.push("/");

    file && setPreview(URL.createObjectURL(file));

    return () => {
      //setFile(null);
    };
  }, [file, setFile, history]);
  return (
    <StyledContainer>
      <StyledGrid>
        <StyledImagePreview>
          <img
            className="w-1/2 h-1/2 object-cover"
            src={preview ?? ""}
            alt="gicolo"
          />
          <StyledSideBar>
            <StyledNav>
              <StyledButton>Filter</StyledButton>
              <StyledButton>Edit</StyledButton>
            </StyledNav>
          </StyledSideBar>
        </StyledImagePreview>
        <StyledSubmit>Next</StyledSubmit>
      </StyledGrid>
    </StyledContainer>
  );
};

export default CreatePost;
