//import logo from './logo.svg';
import './App.css';
import Login from './Login'
import NavBar from './NavBar'
import Editor from './Editor'

import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux'
//import {setNote, saveNote, updateNote} from './reducers/notes'
import {loadNotes, loadNote, clearNote} from './reducers/notes'
import {tryRetrieveTokens, } from './reducers/auth'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
    Redirect,
} from "react-router-dom";
import { Card, ListGroup, Container, Row, Col} from 'react-bootstrap';


function About(props) {
    return (
        <Container className="page-content">
        <div>
        <h1>{props.name}</h1>
        </div>
        </Container>
    );
}

function NewNote(props) {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearNote())
    }, [dispatch])

    return (
        <Editor/>
    )
}

function NoteEdit(props) {
    const {id} = useParams()
    const note = useSelector(
        state => state.notes.note
    )
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadNote(id))
    }, [dispatch, id])

    return (
        <Editor note={note}/>
    );
}

function NotesList(props) {
    const notes = useSelector(
        state => state.notes.notes
    )
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadNotes())
    }, [dispatch])
    return (
        <Container style={{padding: "50px 0"}}>
          <Card>
            <Card.Header>Notes</Card.Header>
            <ListGroup variant="flush">
              {notes.map((note) => 
                  <Link key={note.id} to={`/n/${note.id}`}>
                  <ListGroup.Item action key={note.url}>{note.title}</ListGroup.Item>
                  </Link>
              )}
            </ListGroup>
          </Card>
        </Container>
    )
}

function PrivateRoute({ children, ...rest }) {
  const tokens = useSelector(
      state => state.auth.tokens
  )
  return (
    <Route
      {...rest}
      render={({ location }) =>
        tokens ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App(props) {
    //props.setNote({"id":"", 'title': 'aaa', 'htmlContent':'aaaaaaaaaa'})
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(
            tryRetrieveTokens()
        )
    })

    return (
        <Row className="full-height" noGutters>
            <Router>
                <Col md="auto">
                    <NavBar />
                </Col>
                <Col style={{height:"100vh", overflow:'auto'}}>
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <PrivateRoute path="/n/:id">
                            <NoteEdit/>
                        </PrivateRoute>
                        <PrivateRoute path="/notes">
                            <NotesList />
                        </PrivateRoute>
                        <PrivateRoute path="/">
                            <NewNote/>
                        </PrivateRoute>
                    </Switch>
                </Col>
            </Router>
        </Row>
    );
}


export default App;
