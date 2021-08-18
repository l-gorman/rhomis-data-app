import React from 'react'
import ReactDOM from 'react-dom';
import DataQueryComponent from '../data-query-component';

import { isTSAnyKeyword } from '@babel/types';

it("Data query component renders without crashing", () => {
    // Create a div
    const div = document.createElement("div")
    // Attach our component to that div
    ReactDOM.render(<DataQueryComponent />, div)
})