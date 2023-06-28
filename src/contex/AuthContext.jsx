import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../Utils/Toast'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const history = useNavigate()
  const [currentUser, setCurrentUser] = useState('')
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(null)
  const [users, setUsers] = useState()
  const [currentUserInfo, setCurrentUserInfo] = useState({})

  useEffect(() => {
    let token = localStorage.getItem('userToken')
    let username = localStorage.getItem('userName')
    if (token && username) {
      setToken(token)
      setCurrentUser(username)

      loggedInUserInfo(token, username)
    }
  }, [])
  async function Login(username, password) {
    const authBody = {
      username: username,
      password: password,
    }
    const header = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/token/',
        authBody,
        header
      )
      if (res.status === 200) {
        const data = await res.data.access
        localStorage.setItem('userToken', data)
        loggedInUserInfo(data, username)
        Toast('success', 'Successfully logged in!')
      } else throw new Error(res?.data?.detail)
    } catch (error) {
      Toast('err', error.response?.data?.detail || 'Something went wrong')
    }
  }

  const loggedInUserInfo = async (token, username) => {
    try {
      const res2 = await axios.get(
        `http://127.0.0.1:8000/user/?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res2.status === 200) {
        setCurrentUserInfo(res2?.data[0])
        localStorage.setItem('userName', res2.data[0].username)
        localStorage.setItem('id', res2.data[0].id)
        setUserId(res2.data[0].id)
        setCurrentUser(res2.data[0].username)
        history('/dashboard/1')
      } else throw new Error(res2?.data?.detail)
    } catch (error) {
      Toast('err', error || 'Something went wrong')
    }
  }

  async function UserInfo() {
    try {
      const res2 = await axios.get(`http://127.0.0.1:8000/user/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      })

      setUsers(res2.data)
    } catch (error) {}
  }
  // UserInfo()
  function Logout() {
    setCurrentUser('')
    localStorage.removeItem('userName')
    localStorage.removeItem('userToken')
    localStorage.removeItem('id')

    history('/login')
  }

  const value = {
    Login,
    token,
    currentUser,
    Logout,
    userId,
    users,
    UserInfo,
    currentUserInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
