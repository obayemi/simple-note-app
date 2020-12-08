import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, refreshToken } from "./auth";
import { TokenPair } from "../models/auth";
import {
  fetchNotes,
  fetchNote,
  updateNote,
  createNote,
} from "../services/notes";
import { Note } from "../models/notes";

export interface NoteContent {
  htmlContent: string;
}

export interface NotesState {
  notes: Note[];
  note?: Note;
}

const initialState: NotesState = {
  notes: [],
  note: undefined,
};

export const loadNotes = createAsyncThunk(
  "notes/loadNotes",
  async (_: void, thunkAPI) => {
    return await fetchNotes();
  }
);

export const loadNote = createAsyncThunk(
  "notes/loadNote",
  async (note: number, thunkAPI) => {
    return await fetchNote(note);
  }
);
export const saveNote = createAsyncThunk(
  "notes/saveNote",
  async (html: string, thunkAPI) => {
    const state = thunkAPI.getState() as { notes: NotesState };
    const currentNote = state.notes.note;
    if (currentNote !== undefined) {
      return await updateNote(currentNote.id, {
        ...currentNote,
        htmlContent: html,
      });
    } else {
      return await createNote({
        title: `new note (${new Date()})`,
        htmlContent: html,
      });
    }
  }
);

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNote(state) {
      return {
        ...state,
        note: undefined,
      };
    },
  },
  extraReducers: {
    [`${loadNotes.fulfilled}`]: (state, action: PayloadAction<Note[]>) => {
      return {
        ...state,
        notes: action.payload,
      };
    },
    [`${loadNote.fulfilled}`]: (state, action: PayloadAction<Note>) => {
      return {
        ...state,
        note: action.payload,
      };
    },
    [`${saveNote.fulfilled}`]: (state, action: PayloadAction<Note>) => {
      return {
        ...state,
        note: action.payload,
      };
    },
  },
});

export const { clearNote } = notesSlice.actions;

export default notesSlice.reducer;
