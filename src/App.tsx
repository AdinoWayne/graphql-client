import React, { Suspense } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { AuthProvider } from 'contexts/JWTAuthContext'

import {
    QueryClientProvider
} from "react-query";
import AppContext from 'contexts/AppContext';
import routes from 'routes';
import Layout from 'components/Layout/Layout';
import Login from 'views/Login/Login';
import queryClient from 'queryClient';

function App() {
    return (
        <AppContext.Provider value={routes}>
            <AuthProvider>
                <Suspense
                    fallback={<div>Loading...</div>}
                >
                    <BrowserRouter>
                        <Switch>
                            <Route path="/login" exact={true}>
                                <Login />
                            </Route>
                            <Route path="/">
                                <QueryClientProvider client={queryClient}>
                                    <Layout />
                                </QueryClientProvider>
                            </Route>
                            <Redirect to={'/home'} />
                        </Switch>
                    </BrowserRouter>
                </Suspense>
            </AuthProvider>
        </AppContext.Provider>
    );
}

export default App;
