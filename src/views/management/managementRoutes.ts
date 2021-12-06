import React from 'react'
import Management from './Management'
import DeviceDetail from './DeviceDetail'
import SeniorDetail from './components/Senior/SeniorDetail'

const dashboardRoutes = [
    {
        path: '/management/:tab',
        component: Management,
    },
    {
        path: '/management/devices/:id',
        component: DeviceDetail,
    },
    {
        path: '/management/seniors/:id',
        component: SeniorDetail,
    },
    {
        path: '/management',
        component: Management,
    },
]

export default dashboardRoutes
