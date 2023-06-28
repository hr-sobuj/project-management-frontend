import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import PageLayout from '../components/Layout/Layout'
import { useAuth } from '../contex/AuthContext'
import Toast from '../Utils/Toast'
import { Popconfirm } from 'antd'

const Dashborad = () => {
  const auth = useAuth()
  const token = localStorage.getItem('userToken')
  const [taskSpinner, setTaskSpinner] = useState(false)

  const date = new Date().toISOString().split('T')[0]

  const [newTask, setNewTask] = useState({
    task: '',
    task_type: '',
    task_deadline: '',
    developer: '',
    task_status: '',
  })
  const [tasks, setTasks] = useState([])
  const [allUsers, setAllUsers] = useState()
  const [developers, setDevelopers] = useState([])
  const { id } = useParams()

  useEffect(() => {
    loadAllUsers()
  }, [])

  const loadAllUsers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 200) {
        setAllUsers(res?.data)
      }
    } catch (error) {}
  }

  const findUser = (id) => allUsers?.find((user) => user?.id === id)?.username

  //   async function findUser(devid) {
  //     try {
  //       const res2 = await axios.get(`http://127.0.0.1:8000/user/${devid}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       if (res2.status === 200) {
  //         // setUser(res2.data.username)
  //       }
  //       // return await res2.data.username
  //     } catch (error) {}
  //   }

  useEffect(() => {
    loadAllDevelopers()
  }, [])

  const loadAllDevelopers = async () => {
    try {
      const token = localStorage.getItem('userToken')
      const res = await axios.get('http://127.0.0.1:8000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 200) {
        setDevelopers(res.data)
      }
    } catch (error) {}
  }

  const postTask = async () => {
    setTaskSpinner(true)
    const token = localStorage.getItem('userToken')
    const dataToSend = {
      ...newTask,
      project_title: id,
    }
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/task/?project_id=${id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 201) {
        Toast('success', 'Successfully task is created!')
        setNewTask({
          task: '',
          task_type: '',
          task_deadline: '',
          developer: '',
          task_status: '',
        })
        getTask(id)
        setTaskSpinner(false)
      } else throw new Error(res?.data?.detail)
    } catch (error) {
      Toast(
        'err',
        error.response?.data?.detail ||
          'Something went wrong, please try again later'
      )
      setTaskSpinner(false)
    }
  }

  useEffect(() => {
    getTask()
  }, [id])

  const getTask = async () => {
    const token = localStorage.getItem('userToken')
    const pid = parseInt(id)
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/task/?project_id=${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 200) {
        const tempArr = []
        res.data.map((t) => tempArr.push(t))
        setTasks(tempArr.reverse())
      }
    } catch (error) {}
  }

  const updateTask = async (task_status, task, type) => {
    const token = localStorage.getItem('userToken')

    const tid = parseInt(task.id)

    try {
      let res
      type === 'Update'
        ? (res = await axios.put(
            `http://127.0.0.1:8000/task/${tid}/`,
            { ...task, task_status: task_status },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ))
        : (res = await axios.delete(`http://127.0.0.1:8000/task/${tid}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }))

      if (res.status === 200 || res.status === 204) {
        Toast('success', `Task ${type}d successfully`)
        getTask()
      }
    } catch (error) {
      Toast('error', error?.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <PageLayout>
      <div className='w-100 my-2'>
        <Tabs
          defaultActiveKey={
            auth?.currentUserInfo?.is_superuser ? 'Create' : 'Design'
          }
          id='uncontrolled-tab-example'
          className='mb-3'
        >
          {auth?.currentUserInfo?.is_superuser && (
            <Tab eventKey='Create' title='Create Task'>
              <div
                className='px-2 pt-5 pb-3 my-5 bg-light '
                style={{
                  borderRadius: '4px',
                }}
              >
                <h4 className='text-center'>Create A New Task</h4>
                <Form className=' m-0 p-0'>
                  <Form.Group className='m-3' controlId='formBasicEmail'>
                    <Form.Label>Task </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Task name'
                      value={newTask?.task}
                      required={true}
                      onChange={(e) =>
                        setNewTask({ ...newTask, task: e.target.value })
                      }
                    />
                  </Form.Group>

                  <div className='row mx-1'>
                    <Form.Group className=' col-md-6 my-2'>
                      <Form.Label>Deadline</Form.Label>
                      <Form.Control
                        type='date'
                        value={newTask?.task_deadline}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            task_deadline: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className=' col-md-6 my-2'>
                      <Form.Label>Developer</Form.Label>
                      <br />
                      <Form.Select
                        aria-label='Default select example'
                        value={newTask?.developer}
                        onChange={(e) =>
                          setNewTask({ ...newTask, developer: e.target.value })
                        }
                      >
                        <option hidden>Not selected</option>
                        {developers.length > 0 &&
                          developers.map((d, idx) => (
                            <option value={d?.id} key={idx}>
                              {d?.username}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className='row mx-1'>
                    <Form.Group
                      className=' col-md-6 my-2'
                      controlId='formBasicPassword'
                    >
                      <Form.Label>Task Type</Form.Label>
                      <Form.Select
                        aria-label='Default select example'
                        value={newTask?.task_type}
                        onChange={(e) => {
                          setNewTask({ ...newTask, task_type: e.target.value })
                        }}
                      >
                        <option hidden>Not selected</option>

                        <option value='Bug'>Bug</option>
                        <option value='Design'>Design</option>
                        <option value='Development'>Development</option>
                      </Form.Select>{' '}
                    </Form.Group>

                    <Form.Group
                      className=' col-md-6 my-2'
                      controlId='formBasicPassword'
                    >
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        aria-label='Default select example'
                        value={newTask?.task_status}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            task_status: e.target.value,
                          })
                        }
                      >
                        <option hidden>Not selected</option>

                        <option value='On going'>On going</option>
                        <option value='Todo'>Todo</option>
                        <option value='Finished'>Finished</option>
                      </Form.Select>{' '}
                    </Form.Group>
                  </div>
                </Form>
                <Button
                  className=' w-100 my-3  fw-bold'
                  variant='primary'
                  type='submit'
                  onClick={() => postTask()}
                >
                  Create Task
                  {taskSpinner && (
                    <Spinner animation='border' size='sm' className='ms-1' />
                  )}
                </Button>
              </div>
            </Tab>
          )}
          <Tab eventKey='Design' title='Design'>
            <Table
              striped
              bordered
              responsive
              hover
              className='my-5 text-center'
            >
              {tasks.filter((f) =>
                auth?.currentUserInfo?.is_superuser
                  ? f?.task_type === 'Design'
                  : f?.task_type === 'Design' && f?.developer === auth?.userId
              ).length > 0 && (
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Developer</th>
                    <th>Type</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    {auth?.currentUserInfo?.is_superuser && <th>Action</th>}
                  </tr>
                </thead>
              )}
              <tbody>
                {tasks.filter((f) =>
                  auth?.currentUserInfo?.is_superuser
                    ? f?.task_type === 'Design'
                    : f?.task_type === 'Design' && f?.developer === auth?.userId
                ).length > 0 ? (
                  tasks
                    .filter((f) =>
                      auth?.currentUserInfo?.is_superuser
                        ? f?.task_type === 'Design'
                        : f?.task_type === 'Design' &&
                          f?.developer === auth?.userId
                    )
                    .map((task, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{task?.task}</td>
                        <td>{findUser(task?.developer)}</td>
                        <td>{task?.task_type}</td>
                        <td
                          className={
                            task?.task_deadline > date
                              ? 'text-success'
                              : task?.task_deadline === date
                              ? 'text-primary'
                              : 'text-danger'
                          }
                        >
                          {task?.task_deadline}
                        </td>
                        <td>
                          {' '}
                          <Form.Select
                            aria-label='Default select example'
                            className={
                              task?.task_status === 'Todo'
                                ? ' text-primary '
                                : task?.task_status === 'On going'
                                ? 'text-dark'
                                : 'text-success'
                            }
                            style={{ fontWeight: '500' }}
                            onChange={(e) =>
                              updateTask(e.target.value, task, 'Update')
                            }
                          >
                            <option
                              selected={task.task_status === 'Todo'}
                              className='text-primary fw-bold'
                              value='Todo'
                            >
                              To Do
                            </option>
                            <option
                              selected={task.task_status === 'On going'}
                              className='text-dark fw-bold'
                              value='On going'
                            >
                              On Going
                            </option>
                            <option
                              selected={task.task_status === 'Finished'}
                              className='text-success fw-bold'
                              value='Finished'
                            >
                              Finished
                            </option>
                          </Form.Select>
                        </td>
                        {auth?.currentUserInfo?.is_superuser && (
                          <td>
                            <Popconfirm
                              title='Are you sure to delete this task?'
                              onConfirm={() => updateTask('', task, 'Delete')}
                              placement='left'
                              okText='Yes'
                              cancelText='No'
                            >
                              <Button
                                variant='danger'
                                className='fw-bold'
                                size='sm'
                              >
                                Delete
                              </Button>{' '}
                            </Popconfirm>
                          </td>
                        )}
                      </tr>
                    ))
                ) : (
                  <h3 className='text-secondary text-center text-muted '>
                    No task found!
                  </h3>
                )}
              </tbody>
            </Table>{' '}
          </Tab>
          <Tab eventKey='Development' title='Development'>
            <Table
              striped
              bordered
              responsive
              hover
              className='my-5 text-center'
            >
              {tasks.filter((f) =>
                auth?.currentUserInfo?.is_superuser
                  ? f?.task_type === 'Development'
                  : f?.task_type === 'Development' &&
                    f?.developer === auth?.userId
              ).length > 0 && (
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Developer</th>
                    <th>Type</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    {auth?.currentUserInfo?.is_superuser && (
                      <th>Action</th>
                    )}{' '}
                  </tr>
                </thead>
              )}
              <tbody>
                {tasks.filter((f) =>
                  auth?.currentUserInfo?.is_superuser
                    ? f?.task_type === 'Development'
                    : f?.task_type === 'Development' &&
                      f?.developer === auth?.userId
                ).length > 0 ? (
                  tasks
                    .filter((f) =>
                      auth?.currentUserInfo?.is_superuser
                        ? f?.task_type === 'Development'
                        : f?.task_type === 'Development' &&
                          f?.developer === auth?.userId
                    )
                    .map((task, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{task?.task}</td>
                        <td>{findUser(task?.developer)}</td>
                        <td>{task?.task_type}</td>
                        <td
                          className={
                            task?.task_status === 'Todo'
                              ? ' text-primary '
                              : task?.task_status === 'On going'
                              ? 'text-dark'
                              : 'text-success'
                          }
                        >
                          {task?.task_deadline}
                        </td>
                        <td>
                          {' '}
                          <Form.Select
                            aria-label='Default select example'
                            className={
                              task?.task_status === 'Todo'
                                ? ' text-primary '
                                : task?.task_status === 'On going'
                                ? 'text-dark'
                                : 'text-success'
                            }
                            style={{ fontWeight: '500' }}
                            onChange={(e) =>
                              updateTask(e.target.value, task, 'Update')
                            }
                          >
                            <option
                              selected={
                                task.task_status === 'Todo' ? true : false
                              }
                              className='text-primary fw-bold'
                              value='Todo'
                            >
                              To Do
                            </option>
                            <option
                              selected={
                                task.task_status === 'On going' ? true : false
                              }
                              className='text-dark fw-bold'
                              value='On going'
                            >
                              On Going
                            </option>
                            <option
                              selected={
                                task.task_status === 'Finished' ? true : false
                              }
                              className='text-success fw-bold'
                              value='Finished'
                            >
                              Finished
                            </option>
                          </Form.Select>
                        </td>
                        {auth?.currentUserInfo?.is_superuser && (
                          <td>
                            <Popconfirm
                              title='Are you sure to delete this task?'
                              onConfirm={() => updateTask('', task, 'Delete')}
                              placement='left'
                              okText='Yes'
                              cancelText='No'
                            >
                              <Button
                                variant='danger'
                                className='fw-bold'
                                size='sm'
                              >
                                Delete
                              </Button>{' '}
                            </Popconfirm>
                          </td>
                        )}
                      </tr>
                    ))
                ) : (
                  <h3 className='text-secondary text-center text-muted '>
                    No task found!
                  </h3>
                )}
              </tbody>
            </Table>{' '}
          </Tab>
          <Tab eventKey='Bug' title='Bug'>
            <Table
              striped
              bordered
              responsive
              hover
              className='my-5 text-center'
            >
              {tasks.filter((f) =>
                auth?.currentUserInfo?.is_superuser
                  ? f?.task_type === 'Bug'
                  : f?.task_type === 'Bug' && f?.developer === auth?.userId
              ).length > 0 && (
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Developer</th>
                    <th>Type</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    {auth?.currentUserInfo?.is_superuser && (
                      <th>Action</th>
                    )}{' '}
                  </tr>
                </thead>
              )}
              <tbody>
                {tasks.filter((f) =>
                  auth?.currentUserInfo?.is_superuser
                    ? f?.task_type === 'Bug'
                    : f?.task_type === 'Bug' && f?.developer === auth?.userId
                ).length > 0 ? (
                  tasks
                    .filter((f) =>
                      auth?.currentUserInfo?.is_superuser
                        ? f?.task_type === 'Bug'
                        : f?.task_type === 'Bug' &&
                          f?.developer === auth?.userId
                    )
                    .map((task, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{task?.task}</td>
                        <td>{findUser(task?.developer)}</td>
                        <td>{task?.task_type}</td>
                        <td
                          className={
                            task?.task_status === 'Todo'
                              ? ' text-primary '
                              : task?.task_status === 'On going'
                              ? 'text-dark'
                              : 'text-success'
                          }
                        >
                          {task?.task_deadline}
                        </td>
                        <td>
                          {' '}
                          <Form.Select
                            aria-label='Default select example'
                            className={
                              task?.task_status === 'Todo'
                                ? ' text-primary '
                                : task?.task_status === 'On going'
                                ? 'text-dark'
                                : 'text-success'
                            }
                            style={{ fontWeight: '500' }}
                            onChange={(e) =>
                              updateTask(e.target.value, task, 'Update')
                            }
                          >
                            <option
                              selected={
                                task.task_status === 'Todo' ? true : false
                              }
                              className='text-primary fw-bold'
                              value='Todo'
                            >
                              To Do
                            </option>
                            <option
                              selected={
                                task.task_status === 'On going' ? true : false
                              }
                              className='text-dark fw-bold'
                              value='On going'
                            >
                              On Going
                            </option>
                            <option
                              selected={
                                task.task_status === 'Finished' ? true : false
                              }
                              className='text-success fw-bold'
                              value='Finished'
                            >
                              Finished
                            </option>
                          </Form.Select>
                        </td>
                        {auth?.currentUserInfo?.is_superuser && (
                          <td>
                            <Popconfirm
                              title='Are you sure to delete this task?'
                              onConfirm={() => updateTask('', task, 'Delete')}
                              placement='left'
                              okText='Yes'
                              cancelText='No'
                            >
                              <Button
                                variant='danger'
                                className='fw-bold'
                                size='sm'
                              >
                                Delete
                              </Button>{' '}
                            </Popconfirm>
                          </td>
                        )}
                      </tr>
                    ))
                ) : (
                  <h3 className='text-secondary text-center text-muted '>
                    No task found!
                  </h3>
                )}
              </tbody>
            </Table>{' '}
          </Tab>
        </Tabs>
      </div>
    </PageLayout>
  )
}

export default Dashborad
