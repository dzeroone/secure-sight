
const SidebarData = [
	{
		label: "Dashboard",
		isMainMenu: true,
		roles: ['admin']
	},
	{
		roles: ['admin'],
		label: "Dashboard",
		icon: "ri-dashboard-fill",
		url: "/dashboard",
		// issubMenubadge: true,
		bgcolor: "bg-primary",
		// badgeValue: "3",
		subItem: [
			{
				roles: ['admin'],
				sublabel: "Monthly report",
				link: "/dashboard/monthly-report",
			},
			{
				roles: ['admin'],
				sublabel: "Weekly report ",
				link: "/dashboard/weekly-report",
			},
		],
	},
	{
		roles: ['admin'],
		label: "Users",
		icon: "ri-group-line",
		url: "/users",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: ['admin'],
				sublabel: "List of users",
				link: "/users",
			},
		],
	},
	{
		label: "Report",
		isMainMenu: true,
		roles: ['admin', 'l3', 'l2', 'l1']
	},
	{
		roles: ['admin', 'l3', 'l2', 'l1'],
		label: "Reports",
		icon: "ri-table-2",
		subItem: [
			{
				roles: ['admin', 'l3', 'l2', 'l1'],
				sublabel: "Monthly report",
				link: "/reports/monthly-report",
			},
			{
				roles: ['admin', 'l3', 'l2', 'l1'],
				sublabel: "Weekly report",
				link: "/reports/weekly-report",
			}
		],
	},
	{
		label: "Connector",
		isMainMenu: true,
		roles: ['admin'],
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
	},
	{
		label: "CSV Data",
		isMainMenu: true,
		roles: ['admin']
	},
	{
		roles: ['admin'],
		label: "CSV-Data",
		icon: "ri-file-excel-2-fill",
		url: "/csv",
		bgcolor: "bg-primary",
		subItem: [
			{
				roles: ['admin'],
				sublabel: "CSV List",
				link: "/csv-list"
			},
		],
	},
];
export default SidebarData;
