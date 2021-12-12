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
import ws from 'ws.graphql';
import { ApolloProvider } from '@apollo/client';

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
                                <ApolloProvider client={ws}>
                                    <QueryClientProvider client={queryClient}>
                                        <Layout />
                                    </QueryClientProvider>
                                </ApolloProvider>
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
