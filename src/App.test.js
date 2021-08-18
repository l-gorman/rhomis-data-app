import React from 'react';
import { render, screen } from '@testing-library/react'

import App from './App';

it("App renders without crashing", () => {
  render(<App />)
});
