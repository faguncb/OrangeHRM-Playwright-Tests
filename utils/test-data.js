const testData = {
    validCredentials: {
        username: 'Admin',
        password: 'admin123'
    },
    invalidCredentials: {
        username: 'InvalidUser',
        password: 'wrongpass123'
    },
    employees: [
        {
            firstName: 'John',
            middleName: 'Michael',
            lastName: 'Doe',
            employeeId: 'EMP001'
        },
        {
            firstName: 'Jane',
            middleName: 'Elizabeth',
            lastName: 'Smith',
            employeeId: 'EMP002'
        }
    ],
    apiEndpoints: {
        login: '/web/index.php/auth/validate',
        employees: '/web/index.php/api/v2/pim/employees',
        dashboard: '/web/index.php/api/v2/dashboard/employees/time-at-work',
        leave: '/web/index.php/api/v2/leave/leave-requests'
    }
};

module.exports = testData;