import { Credentials } from "../models/auth";
import { Note } from "../models/notes";
import axios from "axios";

export interface PaginatedResponse<T> {
  count: number;
  next: any;
  previous: any;
  results: T[];
}

export async function fetchNote(noteId: number) {
  const response = await axios.get<Note>(`/notes/${noteId}/`);
  return response.data;
}

export async function fetchNotes() {
  const response = await axios.get<PaginatedResponse<Note>>("/notes/");
  console.log(response);
  return response.data.results;
}

export async function createNote(note: any) {
  const response = await axios.post<Note>("/notes/", note);
  return response.data;
}

export async function updateNote(noteId: number, note: Note) {
  const response = await axios.put<Note>(`/notes/${noteId}/`, note);
  return response.data;
}
