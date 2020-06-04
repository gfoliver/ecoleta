import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './components/Home'
import Register from './components/Register'

export default function Routes() {
    return (
        <Router>
            <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/cadastro">
                <Register />
            </Route>
            </Switch>
        </Router>
    )
}