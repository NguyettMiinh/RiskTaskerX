import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", 
  initialState: { 
    id: "",
    email: ""
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    }

  },
});

export const { setEmail, setId} = userSlice.actions;
export default userSlice.reducer;
