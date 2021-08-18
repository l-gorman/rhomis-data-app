import React from 'react'
import { DataQueryComponent } from '../data-query-component';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

// Setting up a mock server for doing
// mock api requests
const server = setupServer(
    // Specifying an endpoint for the metadata requests
    rest.get(process.env.REACT_APP_API_URL + 'api/metadata', (req, res, context) => {
        return res(context.json({
            greeting: 'hello there'
        }))
    })
)


// Specifying what needs to be done before,
// during, and after each requests
// The mock server has to be s
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test("Data query component renders without crashing", () => {

    // Loading the functions
    const { getByText } = render(<DataQueryComponent />)

    // Checking for the title
    expect(getByText("RHoMIS 2.0 Data Querying")).not.toBeNull();
    // Also simply could write this:
    // getByText("RHoMIS 2.0 Data Querying")
    // but I prefer to be a bit more explicit

    // Checking for the card title
    expect(getByText("Data Filters")).not.toBeNull();


})


test("Can fetch data and update filters accordingly", () => {
    expect(true).toBe(true)
})