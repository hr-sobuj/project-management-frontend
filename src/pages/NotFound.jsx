import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const history = useNavigate()
  function backToHome() {
    history('/')
  }
  return (
    <>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Button onClick={backToHome} type='primary'>
            Back Home
          </Button>
        }
      />
    </>
  )
}
