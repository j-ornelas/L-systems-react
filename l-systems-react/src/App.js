import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import styled from 'styled-components';

import { Simple } from './pages/Simple';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <StyledNav>
          <ul>
            <li>
              <Link to="/simple">Simple Example</Link>
            </li>
          </ul>
        </StyledNav>
        <Routes>
          <Route path="/simple" element={<Simple />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const StyledNav = styled.ul`
  border: 1px solid black;
  padding: 18px;
`;

export default App;
