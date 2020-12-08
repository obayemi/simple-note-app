import { useState, useEffect } from "react";
import {Form, Button, Container} from 'react-bootstrap'
import './Login.css'
import { useSelector, useDispatch } from 'react-redux'
import {login} from './reducers/auth'
import {useHistory, useLocation} from 'react-router-dom'

function Login() {
    const history = useHistory();
    const location : any = useLocation();

    const auth = useSelector((state:any) => state.auth)

    const dispatch = useDispatch()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string>()

    const from = location.state?.from || { pathname: "/" };

    const redirect = () => history.push(from)
    useEffect(() => {
        if (auth.tokens) {
            redirect()
        }
    }, [auth.tokens])

    return ( 
        <Container>
            <Form onSubmit={async (e: React.SyntheticEvent) => {
                e.preventDefault()
                const action = await dispatch(login({username, password})) as any
                if (action.type === login.fulfilled.type) {
                    redirect()
                } else {
                    setError("login failed")
                }
            }}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
                  <Form.Control
                      required
                      type="string"
                      name='username'
                      autoComplete='username'
                      placeholder="username"
                      onChange={(e) => {
                          setUsername(e.target.value)
                      }}
                  />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
                  <Form.Control
                      required
                      type="password"
                      placeholder="Password"
                      onChange={(e) => {
                          setPassword(e.target.value)
                      }}
                  />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={auth.loading}>
              Submit
            </Button>
          </Form>
        </Container>
    );
}

export default Login
