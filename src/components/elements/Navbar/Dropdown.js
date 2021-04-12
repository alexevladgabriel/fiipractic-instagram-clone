//! react
//import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

//! antd
import { Menu, Dropdown, Upload } from "antd";
import { Avatar } from "antd";

//! store
import { useStoreState, useStoreActions } from "easy-peasy";

//! firebase
import { auth } from "utils/firebase";

//! styles
import styled from "styled-components";
import tw from "twin.macro";

const StyledMenu = styled(Menu)`
  left: -80%;
  border: 1px solid;
  ${tw`relative mt-1 bg-black border-insta-gray`}
  .ant-dropdown-menu-item {
    ${tw`pl-4`}
  }
  .ant-dropdown-menu-item:hover {
    ${tw`bg-insta-dark`}
  }
`;
const StyledItem = styled(Menu.Item)`
  svg {
    ${tw`mr-3 fill-current text-white`}
  }

  a {
    ${tw`flex items-center pr-32 text-white`}
    :hover {
      ${tw`text-white`}
    }
  }

  span {
    ${tw`flex items-center text-white`}
    .ant-upload {
      ${tw`w-full`}
    }
  }
`;

const StyledDivider = styled(Menu.Divider)`
  ${tw`bg-insta-gray`}
`;

const UserIcon = () => {
  return (
    <svg
      aria-label="Profil"
      fill="#262626"
      height="16"
      viewBox="0 0 32 32"
      width="16"
    >
      <path d="M16 0C7.2 0 0 7.1 0 16c0 4.8 2.1 9.1 5.5 12l.3.3C8.5 30.6 12.1 32 16 32s7.5-1.4 10.2-3.7l.3-.3c3.4-3 5.5-7.2 5.5-12 0-8.9-7.2-16-16-16zm0 29c-2.8 0-5.3-.9-7.5-2.4.5-.9.9-1.3 1.4-1.8.7-.5 1.5-.8 2.4-.8h7.2c.9 0 1.7.3 2.4.8.5.4.9.8 1.4 1.8-2 1.5-4.5 2.4-7.3 2.4zm9.7-4.4c-.5-.9-1.1-1.5-1.9-2.1-1.2-.9-2.7-1.4-4.2-1.4h-7.2c-1.5 0-3 .5-4.2 1.4-.8.6-1.4 1.2-1.9 2.1C4.2 22.3 3 19.3 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13c0 3.3-1.2 6.3-3.3 8.6zM16 5.7c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 11c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
    </svg>
  );
};

const SavedIcon = () => {
  return (
    <svg
      aria-label="Salvate"
      fill="#262626"
      height="16"
      viewBox="0 0 32 32"
      width="16"
    >
      <path d="M28.7 32c-.4 0-.8-.2-1.1-.4L16 19.9 4.4 31.6c-.4.4-1.1.6-1.6.3-.6-.2-.9-.8-.9-1.4v-29C1.8.7 2.5 0 3.3 0h25.4c.8 0 1.5.7 1.5 1.5v29c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM4.8 3v23.9l9.4-9.4c.9-.9 2.6-.9 3.5 0l9.4 9.4V3H4.8z"></path>
    </svg>
  );
};

const PostIcon = () => {
  return (
    <svg
      aria-label="Postare nouă"
      fill="#262626"
      height="16"
      viewBox="0 0 48 48"
      width="16"
    >
      <path d="M31.8 48H16.2c-6.6 0-9.6-1.6-12.1-4C1.6 41.4 0 38.4 0 31.8V16.2C0 9.6 1.6 6.6 4 4.1 6.6 1.6 9.6 0 16.2 0h15.6c6.6 0 9.6 1.6 12.1 4C46.4 6.6 48 9.6 48 16.2v15.6c0 6.6-1.6 9.6-4 12.1-2.6 2.5-5.6 4.1-12.2 4.1zM16.2 3C10 3 7.8 4.6 6.1 6.2 4.6 7.8 3 10 3 16.2v15.6c0 6.2 1.6 8.4 3.2 10.1 1.6 1.6 3.8 3.1 10 3.1h15.6c6.2 0 8.4-1.6 10.1-3.2 1.6-1.6 3.1-3.8 3.1-10V16.2c0-6.2-1.6-8.4-3.2-10.1C40.2 4.6 38 3 31.8 3H16.2z"></path>
      <path d="M36.3 25.5H11.7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h24.6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"></path>
      <path d="M24 37.8c-.8 0-1.5-.7-1.5-1.5V11.7c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v24.6c0 .8-.7 1.5-1.5 1.5z"></path>
    </svg>
  );
};

const SettingsIcon = () => {
  return (
    <svg
      aria-label="Setări"
      fill="#262626"
      height="16"
      viewBox="0 0 32 32"
      width="16"
    >
      <path d="M31.2 13.4l-1.4-.7c-.1 0-.2-.1-.2-.2v-.2c-.3-1.1-.7-2.1-1.3-3.1v-.1l-.2-.1v-.3l.5-1.5c.2-.5 0-1.1-.4-1.5l-1.9-1.9c-.4-.4-1-.5-1.5-.4l-1.5.5H23l-.1-.1h-.1c-1-.5-2-1-3.1-1.3h-.2c-.1 0-.1-.1-.2-.2L18.6.9c-.2-.5-.7-.9-1.2-.9h-2.7c-.5 0-1 .3-1.3.8l-.7 1.4c0 .1-.1.2-.2.2h-.2c-1.1.3-2.1.7-3.1 1.3h-.1l-.1.2h-.3l-1.5-.5c-.5-.2-1.1 0-1.5.4L3.8 5.7c-.4.4-.5 1-.4 1.5l.5 1.5v.5c-.5 1-1 2-1.3 3.1v.2c0 .1-.1.1-.2.2l-1.4.7c-.6.2-1 .7-1 1.2v2.7c0 .5.3 1 .8 1.3l1.4.7c.1 0 .2.1.2.2v.2c.3 1.1.7 2.1 1.3 3.1v.1l.2.1v.3l-.5 1.5c-.2.5 0 1.1.4 1.5l1.9 1.9c.3.3.6.4 1 .4.2 0 .3 0 .5-.1l1.5-.5H9l.1.1h.1c1 .5 2 1 3.1 1.3h.2c.1 0 .1.1.2.2l.7 1.4c.2.5.7.8 1.3.8h2.7c.5 0 1-.3 1.3-.8l.7-1.4c0-.1.1-.2.2-.2h.2c1.1-.3 2.1-.7 3.1-1.3h.1l.1-.1h.3l1.5.5c.1 0 .3.1.5.1.4 0 .7-.1 1-.4l1.9-1.9c.4-.4.5-1 .4-1.5l-.5-1.5V23l.1-.1v-.1c.5-1 1-2 1.3-3.1v-.2c0-.1.1-.1.2-.2l1.4-.7c.5-.2.8-.7.8-1.3v-2.7c0-.5-.4-1-.8-1.2zM16 27.1c-6.1 0-11.1-5-11.1-11.1S9.9 4.9 16 4.9s11.1 5 11.1 11.1-5 11.1-11.1 11.1z"></path>
    </svg>
  );
};

const UploadButton = () => {
  const history = useHistory();
  //const [file, setFile] = useState();
  const file = useStoreState((state) => state.storage.file);
  const setFile = useStoreActions((action) => action.storage.setFile);

  const uploadProps = {
    onChange: () => {
      history.push("/create/style");
    },

    onRemove: () => {
      setFile(null);
    },

    beforeUpload: (file) => {
      if (file.type !== "image/png") {
        console.error(`${file.name} is not a png file`);
      }
      setFile(file);
      //return false;
      return file.type === "image/png" ? true : Upload.LIST_IGNORE;
    },
    showUploadList: false,
    fileList: file ? [file] : [],
  };

  return (
    <>
      {history.location.pathname !== "/create/style" ? (
        <Upload {...uploadProps}>
          <PostIcon />
          Post
        </Upload>
      ) : (
        <Upload {...uploadProps} disabled>
          <PostIcon />
          Post
        </Upload>
      )}
    </>
  );
};

const SMenu = (displayName) => {
  return (
    <StyledMenu>
      <StyledItem key="0">
        <UploadButton />
      </StyledItem>
      <StyledItem key="1">
        <Link to={`/${displayName}/`}>
          <UserIcon />
          Profile
        </Link>
      </StyledItem>
      <StyledItem key="2">
        <Link to={`/${displayName}/saved/`}>
          <SavedIcon />
          Saved
        </Link>
      </StyledItem>
      <StyledItem key="3">
        <Link to={"/accounts/edit/"}>
          <SettingsIcon />
          Settings
        </Link>
      </StyledItem>
      <StyledDivider />
      <StyledItem key="4">
        <Link to={"/"} onClick={() => auth.signOut()}>
          Logout
        </Link>
      </StyledItem>
    </StyledMenu>
  );
};

const DropdownMenu = () => {
  const { username, photoUrl } = useStoreState(
    (state) => state.auth.details
  ) || {
    username: "",
    photoUrl: "",
  };

  return (
    <Dropdown overlay={SMenu(username)} trigger={["click"]}>
      <div className="w-6 h-6">
        {photoUrl ? (
          <img className="rounded-full cursor-pointer" src={photoUrl} alt="P" />
        ) : (
          <Avatar className="w-6 h-6 flex items-center bg-white cursor-pointer">
            <span className="text-insta-gray">
              {username[0]?.toUpperCase() ?? ""}
            </span>
          </Avatar>
        )}
      </div>
    </Dropdown>
  );
};

export default DropdownMenu;
