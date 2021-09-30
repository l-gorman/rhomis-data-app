import React, { useState } from 'react'
import { Login, LoginComponent } from '../login-component'
import response from '../../../__mocks__/login-mocks'

import AuthContext from '../../authentication-component/AuthContext'

import axios from 'axios';
import '@testing-library/jest-dom';

import { render, fireEvent, waitFor, screen } from '@testing-library/react'


const mockIncorrectResponse = {}


function MockApp() {
    const [authToken, setAuthToken] = useState(null);
    // Loading the functions

    return (
        <AuthContext.Provider value={["testAuthToken", setAuthToken]}>
            <LoginComponent />
        </AuthContext.Provider>
    )
}
describe("LOGIN COMPONENT", function () {
    it("Renders without crashing", () => {
        const { getByText } = render(<MockApp />)
    })
})
