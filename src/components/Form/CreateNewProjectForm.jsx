import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Toast from '../../Utils/Toast'

export default function CreateNewProjectForm() {
  const [project, setProject] = useState({
    project_title: '',
    project_description: '',
  })
  async function postProject() {
    try {
      const token = localStorage.getItem('userToken')
      const res = await axios.post('http://127.0.0.1:8000/project/', project, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 201) {
        Toast('success', 'Project created successfully!')
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
    <div
      className='mx-auto p-5 my-5'
      style={{
        maxWidth: '40rem',
        // boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px',
      }}
    >
      <h3 className='mb-5'>Create New Project</h3>

      <Form className='d-flex justify-content-center flex-column m-0 p-0'>
        <div>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Project Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='Project Title'
              onChange={(e) =>
                setProject({
                  ...project,
                  project_title: e.target.value,
                })
              }
            />
          </Form.Group>
        </div>
        <div>
          <Form.Group className='mb-2' controlId='formBasicEmail'>
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Project Description'
              onChange={(e) =>
                setProject({
                  ...project,
                  project_description: e.target.value,
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
        Create New Project
      </Button>
    </div>
  )
}
