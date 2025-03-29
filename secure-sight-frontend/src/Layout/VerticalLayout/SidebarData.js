import { ROLES } from '../../data/app'

const SidebarData = [
	{
		label: "Dashboard",
		icon: "ri-dashboard-fill",
		url: "/dashboard",
		// issubMenubadge: true,
		bgcolor: "bg-primary",
		isMainMenu: true
	},
	{
		roles: [ROLES.ADMIN],
		label: "Report Graphs",
		icon: "ri-line-chart-fill",
		url: "/graphs",
		// issubMenubadge: true,
		bgcolor: "bg-primary",
		// badgeValue: "3",
		subItem: [
			{
				roles: ['admin'],
				sublabel: "Monthly report",
				link: "/graphs/monthly-report",
			},
			{
				roles: ['admin'],
				sublabel: "Weekly report ",
				link: "/graphs/weekly-report",
			},
		],
	},
	{
		roles: [ROLES.ADMIN, ROLES.LEVEL3],
		label: "Users",
		icon: "ri-group-line",
		url: "/users",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: [ROLES.ADMIN, ROLES.LEVEL3],
				sublabel: "List of users",
				link: "/users",
			},
		],
	},
	{
		roles: [ROLES.ADMIN, ROLES.LEVEL3],
		label: "Customers",
		icon: "ri-user-2-line",
		url: "/customers",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: [ROLES.ADMIN, ROLES.LEVEL3],
				sublabel: "List of customers",
				link: "/customers",
			},
		],
	},
	{
		roles: ['l3', 'l2'],
		label: "Assign",
		icon: "ri-send-plane-2-line",
		url: "/assign/monthly-report",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: ['l3', 'l2'],
				sublabel: "Monthly report",
				link: "/assign/monthly-report",
			},
			{
				roles: ['l3', 'l2'],
				sublabel: "Weekly report",
				link: "/assign/weekly-report",
			},
		],
	},
	{
		roles: [ROLES.LEVEL3, ROLES.LEVEL2],
		label: "Submissions",
		icon: "ri-article-line",
		subItem: [
			{
				roles: [ROLES.LEVEL3, ROLES.LEVEL2],
				sublabel: "Monthly report",
				link: "/submissions/monthly-report",
			},
			{
				roles: [ROLES.LEVEL3, ROLES.LEVEL2],
				sublabel: "Weekly report",
				link: "/submissions/weekly-report",
			}
		],
	},
	{
		roles: [ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2, ROLES.LEVEL1],
		label: "Reports",
		icon: "ri-table-2",
		subItem: [
			{
				roles: [ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2, ROLES.LEVEL1],
				sublabel: "Monthly report",
				link: "/reports/monthly-report",
			},
			{
				roles: [ROLES.ADMIN, ROLES.LEVEL3, ROLES.LEVEL2, ROLES.LEVEL1],
				sublabel: "Weekly report",
				link: "/reports/weekly-report",
			}
		],
	},
	{
		roles: ['admin'],
		label: "Connector",
		icon: "mdi mdi-transit-connection-variant",
		url: "/connector",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: ['admin'],
				sublabel: "Upload & Config",
				link: "/connector-upload"
			},
			// { sublabel: "List", link: "/connector-list" },
			{
				roles: ['admin'],
				sublabel: "Schedule",
				link: "/connector-schedule"
			},
		],
	}
];
export default SidebarData;
