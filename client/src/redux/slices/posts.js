import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const {
    data
  } = await api.get('/posts');
  return data;
});

export const fetchPostsWithSort = createAsyncThunk('posts/fetchPostsWithSort', async (params) => {
  const {
    data
  } = await api.get(`/posts?sort=${params}`);
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const {
    data
  } = await api.get('/posts/tags');
  return data;
});

export const fetchPostWithSearchingTag = createAsyncThunk('posts/fetchPostWithSearchingTag', async (tag) => {
  const {
    data
  } = await api.get(`/tags/${tag}`);
  return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  await api.delete(`/posts/${id}`);
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {

    // Получение статей
    [fetchPosts.pending]: (state, action) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение статей с сортировкой
    [fetchPostsWithSort.pending]: (state, action) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsWithSort.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsWithSort.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение тегов
    [fetchTags.pending]: (state, action) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // Получение постов с найденным тегом
    [fetchPostWithSearchingTag.pending]: (state, action) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostWithSearchingTag.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostWithSearchingTag.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    },
  }
});

export const postsReducer = postsSlice.reducer;