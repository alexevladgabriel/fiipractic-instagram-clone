import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  body {
      font-size: 14px;
      ${tw`bg-insta-dark`}
  }
`;

export default function GlobalStyles() {
  return (
    <>
      <CustomStyles />
      <BaseStyles />
    </>
  );
}
