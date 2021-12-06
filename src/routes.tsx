import React from 'react'
import managementRoutes from 'views/management/managementRoutes';
import statusEventRoutes from 'views/statusEvent/statusEventRoutes';
import maintenanceRoutes from 'views/maintenance/maintenanceRoutes';
const routes = [
    ...managementRoutes,
    ...statusEventRoutes,
    ...maintenanceRoutes
]

export default routes;