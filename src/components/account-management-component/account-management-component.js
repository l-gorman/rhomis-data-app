import React, { useContext } from 'react'
import AuthContext from '../authentication-component/AuthContext';

import "./account-management-component.css"



export default function AccountManagementComponent() {
    const [authToken, setAuthToken] = useContext(AuthContext)
    return (
        <div className="sub-page-container">
            <p>User Token: {authToken}</p>
        </div>
    )
}
