import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Offcanvas } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contex/AuthContext'
import Toast from '../../Utils/Toast'
import './sidebar.css'
const Sidebar = () => {
  const [allProjects, setAllProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [projectsForDeveloper, setProjectForDeveloper] = useState([])
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const auth = useAuth()

  useEffect(() => {
    loadAllProjects()
  }, [])

  const loadAllProjects = async () => {
    const token = localStorage.getItem('userToken')
    try {
      const res = await axios.get('http://127.0.0.1:8000/project/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 200) {
        setAllProjects(res.data)

        if (!auth?.currentUserInfo?.is_superuser) {
          loadTaskForDeveloper(res.data)
        }
      }
    } catch (error) {}
  }

  const loadTaskForDeveloper = async (projects) => {
    let id = localStorage.getItem('id')

    try {
      const token = localStorage.getItem('userToken')
      const res = await axios.get(
        `http://127.0.0.1:8000/task/?developer=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 200) {
        setTasks(res?.data)
        if (!auth?.currentUserInfo?.is_superuser) {
          filterProjectForDeveloper(res?.data, projects)
        }
      }
    } catch (error) {
      Toast('err', error?.response?.data?.detail)
    }
  }

  const filterProjectForDeveloper = (tasks, projects) => {
    let tempSet = new Set()
    for (let i = 0; i < tasks.length; i++) {
      let project = projects.find((f) => f?.id === tasks[i]?.project_title)

      tempSet.add(project)

      if (i === tasks.length - 1) {
        setProjectForDeveloper([...tempSet])
      }
    }
  }

  return (
    <>
      <Button
        variant='primary'
        className='launch-btn mb-5 mt-3'
        onClick={handleShow}
      >
        Show Project List
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Projects</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='p-0'>
          <ul className='list-group sticky-top  py-2'>
            {auth?.currentUserInfo?.is_superuser
              ? allProjects.length > 0 &&
                allProjects.map((p, idx) => (
                  <NavLink
                    key={idx}
                    as='li'
                    className='list-group-item py-3 fw-bold'
                    to={`/dashboard/${p?.id}`}
                    exact
                  >
                    {p?.project_title}
                  </NavLink>
                ))
              : allProjects?.length > 0 &&
                projectsForDeveloper?.length > 0 &&
                projectsForDeveloper.map((p, idx) => (
                  <NavLink
                    key={idx}
                    as='li'
                    className='list-group-item fw-bold py-3'
                    to={`/dashboard/${p?.id}`}
                    exact
                  >
                    {p?.project_title}
                  </NavLink>
                ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <ul className='sidebar list-group sticky-top  py-2 '>
        {auth?.currentUserInfo?.is_superuser
          ? allProjects.length > 0 &&
            allProjects.map((p, idx) => (
              <NavLink
                key={idx}
                as='li'
                className='list-group-item py-3 fw-bold'
                to={`/dashboard/${p?.id}`}
                exact
              >
                {p?.project_title}
              </NavLink>
            ))
          : projectsForDeveloper?.length > 0 &&
            projectsForDeveloper.map((p, idx) => (
              <NavLink
                key={idx}
                as='li'
                className='list-group-item fw-bold py-3'
                to={`/dashboard/${p?.id}`}
                exact
              >
                {p?.project_title}
              </NavLink>
            ))}
      </ul>
    </>
  )
}

export default Sidebar
