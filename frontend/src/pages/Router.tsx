import React from 'react';
import {
  HashRouter,
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Home from './Home';
import Channel from './Channel';
import Meeting from './Meeting';
import Test from './Test';

const AppRouter = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="" element={<Navigate replace to="/0/0" />} />
            <Route path="/:workspaceId/:channelId" element={<Channel />} />
            <Route path="/test" element={<Test />} />
            <Route
              path="/meeting/:workspaceId/:channelId"
              element={<Meeting />}
            />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRouter;
