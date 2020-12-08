import { useMemo } from "react";
//import PropTypes from 'prop-types';
import { saveNote } from "./reducers/notes";
import { Note } from "./models/notes";
import ReactQuill from "react-quill";
import "./Editor.css";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";

function Editor(props: { note: Note }) {
  const dispatch = useDispatch();

  const onNoteChange = useMemo(
    () =>
      debounce((html: string) => {
        dispatch(saveNote(html));
      }, 1000),
    [dispatch]
  );

  return (
    <ReactQuill
      className="editor"
      theme="snow"
      onChange={onNoteChange}
      value={props.note?.htmlContent}
      modules={Editor.modules}
      formats={Editor.formats}
      bounds={".app"}
      placeholder="What's on your mind ?"
    />
  );
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];

/*
 * PropType validation
 */
Editor.propTypes = {};

export default Editor;
