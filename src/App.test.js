import React from 'react';
import { render, screen } from '@testing-library/react'

import App from './App';

describe("APP", function () {
  it("Renders without crashing", () => {
    render(<App />)
  });
})

