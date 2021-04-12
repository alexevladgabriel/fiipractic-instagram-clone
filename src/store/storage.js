import { action } from "easy-peasy";
const storage = {
  file: null,
  setFile: action((state, payload) => {
    state.file = payload;
  }),
};
export default storage;
