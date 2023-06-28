import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useAuth } from '../../contex/AuthContext'

export default function NavBar() {
  const { Logout, currentUserInfo } = useAuth()
  console.log(currentUserInfo)
  return (
    <>
      <Navbar bg='primary' expand='md' className='px-4 py-3'>
        <Navbar.Brand href='#home'>
          {' '}
          <Link to='/dashboard/1'>
            <h3 className='text-light'>Project Management Application</h3>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse
          id='basic-navbar-nav'
          className=' justify-content-end '
        >
          <Nav className='align-items-center'>
            <Nav.Link>
              <Link to='/dashboard/1'>
                <span className='text-light fw-bold'>Tasks</span>
              </Link>
            </Nav.Link>

            {currentUserInfo?.is_superuser && (
              <Nav.Link>
                <Link to='/add-new-dev'>
                  <span className='text-light fw-bold'>Add Developer</span>
                </Link>
              </Nav.Link>
            )}

            {currentUserInfo?.is_superuser && (
              <Nav.Link>
                <Link to='/create/'>
                  <span className='text-light fw-bold'>Create New Project</span>
                </Link>
              </Nav.Link>
            )}
            <Nav.Link>
              <button
                className='btn btn-outline-light fw-bold logout-btn '
                style={{ borderRadius: '5rem' }}
                onClick={Logout}
              >
                <span className=' username'>Logout</span>{' '}
                <span className='logout'> {currentUserInfo?.username}</span>
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
