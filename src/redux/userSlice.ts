import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string | number;
  email: string | number;
};

const initialState: UserState = {
  id: "",
  email: ""
};
const userSlice = createSlice({
  name: "user", 
  initialState,
  reducers: {
    setEmail: (state, action :  PayloadAction<string>) => {
      state.email = action.payload;
    },
    setId: (state, action:  PayloadAction<string | number>) => {
      state.id = action.payload;
    }

  },
});

export const { setEmail, setId} = userSlice.actions;
export default userSlice.reducer;
