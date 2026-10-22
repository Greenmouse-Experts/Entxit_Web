export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: "resident" | "guard" | "sub-admin" | "super-admin";
	organisationId?: string;
	organisationName?: string;
	status: "active" | "inactive" | "suspended";
	createdAt: string;
	lastLogin?: string;
	avatar?: string;
}

export const demoResidents: User[] = [
	{
		id: "R1",
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 234 567 8901",
		role: "resident",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		status: "active",
		createdAt: "2024-02-15",
		lastLogin: "2024-12-08",
	},
	{
		id: "R2",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		phone: "+1 234 567 8902",
		role: "resident",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		status: "active",
		createdAt: "2024-03-20",
		lastLogin: "2024-12-09",
	},
	{
		id: "R3",
		name: "Michael Johnson",
		email: "michael.j@example.com",
		phone: "+1 234 567 8903",
		role: "resident",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		status: "inactive",
		createdAt: "2024-01-10",
		lastLogin: "2024-11-15",
	},
	{
		id: "R4",
		name: "Sarah Williams",
		email: "sarah.w@example.com",
		phone: "+1 234 567 8904",
		role: "resident",
		organisationId: "4",
		organisationName: "Greenfield Apartments",
		status: "active",
		createdAt: "2024-05-12",
		lastLogin: "2024-12-09",
	},
];

export const demoGuards: User[] = [
	{
		id: "G1",
		name: "Robert Brown",
		email: "robert.brown@example.com",
		phone: "+1 234 567 9001",
		role: "guard",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		status: "active",
		createdAt: "2024-01-20",
		lastLogin: "2024-12-09",
	},
	{
		id: "G2",
		name: "David Martinez",
		email: "david.m@example.com",
		phone: "+1 234 567 9002",
		role: "guard",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		status: "active",
		createdAt: "2024-02-15",
		lastLogin: "2024-12-09",
	},
	{
		id: "G3",
		name: "James Wilson",
		email: "james.w@example.com",
		phone: "+1 234 567 9003",
		role: "guard",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		status: "active",
		createdAt: "2024-03-10",
		lastLogin: "2024-12-08",
	},
];

export const demoSubAdmins: User[] = [
	{
		id: "SA1",
		name: "Emily Davis",
		email: "emily.davis@example.com",
		phone: "+1 234 567 7001",
		role: "sub-admin",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		status: "active",
		createdAt: "2024-01-15",
		lastLogin: "2024-12-09",
	},
	{
		id: "SA2",
		name: "Christopher Lee",
		email: "chris.lee@example.com",
		phone: "+1 234 567 7002",
		role: "sub-admin",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		status: "active",
		createdAt: "2024-02-01",
		lastLogin: "2024-12-09",
	},
];

export const demoSuperAdmins: User[] = [
	{
		id: "SU1",
		name: "Admin User",
		email: "greenmousedev+admin@gmail.com",
		phone: "+1 234 567 0001",
		role: "super-admin",
		status: "active",
		createdAt: "2023-01-01",
		lastLogin: "2024-12-09",
	},
];
