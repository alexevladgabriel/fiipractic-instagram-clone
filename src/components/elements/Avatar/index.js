//! react
import React, { useState } from "react";

//! antd
//import { UploadOutlined } from "@ant-design/icons";
import { message, Modal, Upload, Button } from "antd";

//! store
import { useStoreActions, useStoreState } from "easy-peasy";

//! firebase
import { auth, storage, db } from "utils/firebase";

//! vendors
import { nanoid } from "nanoid";

//! styles
import styled, { css } from "styled-components";
import tw from "twin.macro";

const PrimaryStyle = css`
  color: #0095f6;
`;
const DangerStyle = css`
  color: #ed4956;
`;

const BaseStyle = css`
  font-weight: 400;
`;

const StyledButton = styled(Button)`
  //${tw`p-0 m-0 bg-transparent border-none`}
  span {
    ${({ type }) =>
      type === "primary"
        ? PrimaryStyle
        : type === "danger"
        ? DangerStyle
        : BaseStyle}
    ${tw``}
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 400px;
    background-color: #262626;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    .ant-modal-header {
      ${tw`text-white border-insta-gray p-6 rounded-tl-lg rounded-tr-lg border-0`}
      border-radius: 50%;
      background-color: #262626;
      .ant-modal-title {
        text-align: center;
        color: #fafafa;
        ${tw`text-lg font-semibold`}
      }
    }
    .ant-modal-body {
      ${tw`hidden`}
    }
    .ant-modal-footer {
      ${tw`p-0 border-0`}
      ${tw`flex flex-col`}
      span {
        ${tw`w-full`}
        div {
          ${tw`py-0`}
          ${tw`w-full`}
        }
      }
      ${StyledButton} {
        ${tw`m-0 p-0 w-full border-none shadow-none text-white text-sm font-bold`}
        padding: 0 !important;
        border-top: 1px solid #363636;
        background-color: transparent;
      }
    }
  }
`;

function AvatarUploadModal({ isOpened, setIsOpen }) {
  const details = useStoreState((state) => state.auth.details);
  const setPhotoUrl = useStoreActions((actions) => actions.auth.setPhotoUrl);
  const [file, setFile] = useState();
  //const [progress, setProgress] = useState(0);
  //const { Dragger } = Upload;

  const uploadProps = {
    onChange: (info) => {
      handleUpload();
      setIsOpen(false);
    },
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const handleUpload = () => {
    const imageName = `${file.name}_${nanoid()}`;
    const uploadTask = storage.ref(`avatars/${imageName}`).put(file);

    uploadTask.on(
      "stage_changed",
      // progress function
      (snapshot) => {
        //const progress = Math.round(
        //  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //);
        //setProgress(progress);
      },
      // error function
      (err) => message.error(`${err.message} - ${imageName} failed to upload.`),
      // complete function
      () => {
        storage
          .ref("avatars")
          .child(imageName)
          .getDownloadURL()
          .then(async (imageUrl) => {
            auth.currentUser.updateProfile({
              photoURL: imageUrl,
            });

            const query = db.collection("users");
            query
              .where("username", "==", details.username)
              .get()
              .then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach(async (doc) => {
                    //? Possible Bug: Atunci cand iti faci prima data cont, se pune
                    //? o poza default si s-ar putea cel mai probabil sa nu o
                    //? gaseasca si sa crape in doua clona.
                    //TODO: Pt testerii mei draguti

                    //! Prima optimizare facuta, ce consta in stergerea
                    //! din storage a pozei veche.
                    const oldPhoto = storage.refFromURL(doc.data().photoUrl);
                    oldPhoto
                      .delete()
                      .then(() => {})
                      .catch((err) => console.log(err));

                    await query.doc(doc.id).update({ photoUrl: imageUrl });
                    setPhotoUrl(imageUrl);
                  });
                }
              });

            setIsOpen(false);
            setFile();
            //setProgress(0);
          });
      }
    );
  };

  return (
    <StyledModal
      title="Change profile avatar"
      visible={isOpened}
      onCancel={() => setIsOpen(false)}
      //onOk={handleUpload}
      centered={true}
      closable={false}
      footer={[
        <Upload {...uploadProps}>
          <StyledButton
            key=""
            type="primary"
            //loading={loading}
            //onClick={this.handleOk}
          >
            Upload a photo
          </StyledButton>
        </Upload>,
        <StyledButton
          key="back"
          type="danger"
          //loading={loading}
          //onClick={this.handleOk}
        >
          Delete the current avatar
        </StyledButton>,
        <StyledButton key="back" onClick={() => setIsOpen(false)}>
          Cancel
        </StyledButton>,
      ]}
    >
      {/* <Progress percent={progress} /> */}
    </StyledModal>
  );
}

export default AvatarUploadModal;
