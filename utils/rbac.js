export const permissions =[
    {
        role: 'user',
        actions: [
            'get_Profile',
            'update_Profile',
            'get_Ride',
        ]
    },
    {
        role: 'driver',
        actions: [
            'get_Profile',
            'update_Profile',
            'get_Ride',
            'create_Ride'
        ]
    }
]