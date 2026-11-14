import { MenuItem, ServiceMasterItems } from "./types";

export const menuItems: MenuItem[] = [
  {
    type: 'link',
    label: 'Approvals',
    path: '/approvals-list',
    claim: 'Menu_Approvals',
  },
  {
    type: 'module',
    title: 'Masters',
    claim: 'Menu_Masters',
    children: [
      { label: 'Service Maintainence',
        path: '/service-home',
        claim: 'Menu_Masters_ServiceMaintainence'
      }
    ],
  },
  {
    type: 'module',
    title: 'Setup',
    claim: 'Menu_Setup',
    children: [
      { label: 'Manage Users',
        path: '/manage-users-list',
        claim: 'Menu_Setup_ManageUsers'
      },
      { label: 'Manage Rights',
        path: '/manage-claim',
        claim: 'Menu_Setup_ManageRights'
      },
      { label: 'Manage Services',
        path: '/manage-services-list',
        claim: 'Menu_Setup_ManageServices'
      },
    ],
  },
];


export const serviceMasterItems: ServiceMasterItems[] = [
  {
    title: 'Categories',
    description: 'Add or update service categories used to classify different offerings.',
    path: '/manage-service-categories',
  },
  {
    title: 'Services',
    description: 'Manage and configure individual services offered to customers.',
    path: '/manage-services',
  },
  {
    title: 'Location',
    description: 'Customize your service reach by managing the countries, cities, and local areas where customers can find you.',
    path: '/manage-location-tab',
  }
]