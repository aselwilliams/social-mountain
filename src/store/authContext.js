import { useState, useEffect, useCallback, createContext } from 'react'

let logoutTimer

export const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
})

const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime()
  const expTime = exp 
  const remainingTime = expTime - currentTime
  return remainingTime
}

const getLocalData = () => {
  const storedToken = localStorage.getItem('token')
  const storedExp = localStorage.getItem('exp')

  const remainingTime = calculateRemainingTime(storedExp)

  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem('token')
    localStorage.removeItem('exp')
    return null
  }

  return {
    token: storedToken,
    duration: remainingTime,
  }
}

export const AuthContextProvider = (props) => {
  const localData = getLocalData()
  
  let initialToken
  if (localData) {
    initialToken = localData.token
  }

  const [token, setToken] = useState(initialToken)
  const [userId, setUserId] = useState(null)


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('exp')
    localStorage.removeItem('userId')

    if(logoutTimer){
      console.log('logout')
      clearTimeout(logoutTimer)
    }
  }, [])

  const login = (token, expTime, userId) => {
    setToken(token);
    setUserId(userId)
    localStorage.setItem('token', token)
    localStorage.setItem('expTime', expTime)
    localStorage.setItem('userId', JSON.stringify(userId))

    const remainingTime = calculateRemainingTime(expTime)
    console.log('login')
    logoutTimer = setTimeout(logout, remainingTime)
  }

  useEffect(()=> {
    if(localData){
      console.log(localData.duration)
      logoutTimer = setTimeout(logout, localData.duration)
    }
  }, [localData, logout])

  const contextValue = {
    token,
    login,
    logout, 
    userId
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
