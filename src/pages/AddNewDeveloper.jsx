import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Toast from '../Utils/Toast'
import NavBar from '../components/NavBar/NavBar'

const AddNewDeveloper = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  })

  async function postProject() {
    const newObj = {
      ...user,
      password2: user.password,
      email: 'admin@gmail.com',
      first_name: 'dev',
      last_name: 'dev',
      is_active: true,
      is_staff: true,
    }

    try {
      const token = localStorage.getItem('userToken')
      const res = await axios.post(
        'http://127.0.0.1:8000/dev/register/',
        newObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status === 201) {
        Toast('success', 'Developer created successfully!')
      }
    } catch (error) {
      Toast(
        'err',
        error?.response?.data?.details ||
          'Something went wrong, try again later'
      )
    }
  }
  return (
    <div>
      <NavBar />
      <div
        className='mx-auto p-5 my-5'
        style={{
          maxWidth: '40rem',
          // boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)',
          borderRadius: '4px',
        }}
      >
        <h3 className='mb-5'>Add New Developer</h3>

        <Form className='d-flex justify-content-center flex-column m-0 p-0'>
          <div>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Developer Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter developer name'
                onChange={(e) =>
                  setUser({
                    ...user,
                    username: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>
          <div>
            <Form.Group className='mb-2' controlId='formBasicEmail'>
              <Form.Label>Developer Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter developer password'
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>
        </Form>
        <Button
          className='my-4 w-100 fw-bold'
          variant='primary'
          type='submit'
          onClick={postProject}
        >
          Create Developer
        </Button>
      </div>
      )
    </div>
  )
}

export default AddNewDeveloper
