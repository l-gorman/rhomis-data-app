import React, { useState } from 'react'
import { DataQueryComponent } from '../data-query-component';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import { mockMetaDataResponse } from '../../../__mocks__/data-query-mocks'

import nock from 'nock'

import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import AuthContext from '../../authentication-component/AuthContext';

// jest.mock('axios')


// A function to render the mock application with some test context
function MockApp() {
    const [authToken, setAuthToken] = useState(null);
    // Loading the functions

    return (
        <AuthContext.Provider value={["testAuthToken", setAuthToken]}>
            <DataQueryComponent />
        </AuthContext.Provider>
    )
}


describe("DATA QUERY COMPONENT", function () {

    afterEach(nock.cleanAll)
    afterAll(function () {
        nock.restore
    })

    it("Renders without crashing", function () {
        const { getByText } = render(<MockApp />)
        // Checking for the title
        expect(getByText("RHoMIS 2.0 Data Querying")).not.toBeNull();
        // Also simply could write this:
        // getByText("RHoMIS 2.0 Data Querying")
        // but I prefer to be a bit more explicit

        // Checking for the card title
        expect(getByText("No Data found")).not.toBeNull();

        expect(getByText("Get Project Information")).not.toBeNull();

    });


    it("Can fetch metadata and update filters accordingly", async function () {
        // const response = { data: mockMetaDataResponse }
        // console.log(process.env.REACT_APP_AUTHENTICATOR_URL)

        let scope = nock(process.env.REACT_APP_API_URL)
            // Obtaining central authentication token
            .get('/api/meta-data/form-data')
            .matchHeader('Authorization', 'testAuthToken')
            .reply(200, mockMetaDataResponse)





        // console.log(mockMetaDataResponse)
        // axios.mockResolvedValue(response);
        const { getByText } = render(<MockApp />)
        const button = screen.getByTestId('fetchProjectButton')
        // fireEvent(node: HTMLElement, event: Event)

        fireEvent.click(button)
        await waitFor(() => expect(getByText("Project Name")).not.toBeNull());
        // expect(handleClick).toHaveBeenCalledTimes(1)

        // expect(true).toBe(true)
    });
})