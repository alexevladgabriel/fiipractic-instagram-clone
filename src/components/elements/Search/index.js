//! react
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import tw from "twin.macro";
import { db } from "utils/firebase";

const SearchInput = styled.input`
  border: 1px solid;
  padding: 2px 34px;
  ${tw`ml-8 bg-insta-dark text-center border-insta-gray rounded text-white`}
`;

const SearchDisplay = styled.div`
  position: absolute;
  height: 362px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px 0 0 0;
  width: 375px;
  background-color: black;
  margin-top: 4px;
  margin-left: -49px;
  border: 1px solid #262626;
  border-radius: 5px;
  z-index: 100;
`;

const StyledContainer = styled(Link)`
  ${tw`flex cursor-pointer`}
  :hover {
    color: white;
    background-color: #121212;
  }
`;

const StyledText = styled.span`
  ${tw`font-thin`}
  font-size: 14px;
  color: #8e8e8e;
`;

//! ORA 10:35 PM - 12.04.2021 - Scai codeaza la turatie maxima
const Container = ({ id, name, username, photoUrl }) => {
  return (
    <StyledContainer to={`/${username}`}>
      <div className="pl-4 p-2">
        <img
          className="w-12 h-12 rounded-full"
          src={photoUrl}
          alt={name + id}
        />
      </div>
      <div className="flex items-center">
        <div className="ml-2">
          <p className="text-sm font-semibold">{username}</p>
          <StyledText className="font-thin">{name}</StyledText>
        </div>
      </div>
    </StyledContainer>
  );
};

const Search = () => {
  const [queryString, setQueryString] = useState("");
  const [results, setResults] = useState([]);

  const [typingTimeout, setTimingTimeout] = useState(0);
  const handleSearch = (e) => {
    setQueryString(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    if (queryString.length > 0)
      setTimingTimeout(setTimeout(() => createQuery(queryString), 3000));
  };

  const createQuery = (userid) => {
    const username = userid.toLowerCase();
    const query = db
      .collection("users")
      .orderBy("username", "asc")
      .startAt(username)
      .endAt(username + "\uf8ff");

    query.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(docs);
    });
  };

  return (
    <div>
      <SearchInput
        onChange={(e) => handleSearch(e)}
        value={queryString}
        name="Search"
        placeholder="Search"
      />
      {results.length > 0 && (
        <SearchDisplay
          onMouseDown={(e) => {
            console.log(e.target);
            if (e.target.tagName.toLowerCase() === "div") {
              setResults([]);
              setQueryString("");
            }
          }}
        >
          {results.map((res) => (
            <Container key={res.id} {...res}></Container>
          ))}

          <div className="ml-12 mt-48">
            Click on the blank area to close that window
          </div>
        </SearchDisplay>
      )}
    </div>
  );
};

export default Search;
