import React from 'react'
import NavBar from '../NavBar/NavBar'
import SideBar from '../SideBar/SideBar'

const PageLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className=' my-4'>
        <div className='row mx-auto'>
          <div className='col-md-3'>
            <SideBar />
          </div>
          <div className='col-md-9'>{children}</div>
        </div>
      </div>
      <div
        className='bg-primary w-100 text-center py-2'
        style={{ position: 'fixed', bottom: '0rem' }}
      >
        <h6 className='text-white  m-0'>
          Developed @ By Zafor, Sobuj, Shishir
        </h6>
        <h6 className='text-white  m-0'>
          Department of Computer Science & Engineering
        </h6>
      </div>
    </div>
  )
}

export default PageLayout
