import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'api'

type State = {
    isAuthenticated: boolean
    isInitialised: boolean
    user: any
}

const initialState: State = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken: string | undefined) => {
    if (!accessToken) {
        return false
    }

    const decodedToken: any = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken?.exp > currentTime
}

const setSession = (accessToken: string | undefined) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state: State , action: any) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: (emailOrPhone: string, password: string, remember: boolean) => Promise.resolve(),
    logout: () => {},
    register: (email: string, username: string, password: string) => Promise.resolve(),
})

export const AuthProvider = ({ children }: { children: any}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (emailOrPhone: string, password: string, remember: boolean) => {
        const formData = new FormData();
        formData.append('emailOrPhone', emailOrPhone);
        formData.append('password', password);
        const response = await axios.post(
            `/auth/login`, { 
                emailOrPhone, password
            }
        );
        localStorage.setItem('remember', remember.toString());
        localStorage.setItem('user', emailOrPhone.toString());
        localStorage.setItem('refreshToken', response.data.data['refresh-token']);
        const accessToken = response.data.data['id-token'];
        const { user } = response.data.data;

        setSession(accessToken)

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const register = async (email: string, username: string, password: string) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(undefined)
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ;(async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    // const response = await axios.get('/api/auth/profile')
                    // const { user } = response.data

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user: null,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
