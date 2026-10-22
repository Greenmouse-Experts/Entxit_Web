import { createFileRoute, Link } from '@tanstack/react-router'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../components/ui/Modal'
import { BottomSheet, BottomSheetHeader, BottomSheetTitle, BottomSheetDescription } from '../../components/ui/BottomSheet'
import { Search, Plus, Edit, Eye, MoreVertical, Users, Shield, UserCheck, Activity, Clock, AlertTriangle, CheckCircle, Calendar, MapPin } from 'lucide-react'
import { demoOrganisations, type Organisation } from '../../data/demo.organisations'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/organisations')({
  component: OrganisationsPage,
})

// Demo data for hosts and securities
const demoHosts = [
  { id: 1, name: 'John Doe', orgName: 'Lekki Gardens Estate', email: 'john@example.com', phone: '+234 801 234 5678', apartment: 'Block A, Flat 12', status: 'active', totalVisitors: 45 },
  { id: 2, name: 'Jane Smith', orgName: 'Victoria Island Plaza', email: 'jane@example.com', phone: '+234 802 345 6789', apartment: 'Suite 305', status: 'active', totalVisitors: 32 },
  { id: 3, name: 'Mike Johnson', orgName: 'Lekki Gardens Estate', email: 'mike@example.com', phone: '+234 803 456 7890', apartment: 'Block B, Flat 8', status: 'inactive', totalVisitors: 18 },
]

const demoSecurities = [
  { id: 1, name: 'David Security', orgName: 'Lekki Gardens Estate', email: 'david@example.com', phone: '+234 804 567 8901', shift: 'Morning', status: 'active', totalEntries: 234 },
  { id: 2, name: 'Sarah Guard', orgName: 'Victoria Island Plaza', email: 'sarah@example.com', phone: '+234 805 678 9012', shift: 'Evening', status: 'active', totalEntries: 189 },
  { id: 3, name: 'Tom Watchman', orgName: 'Lekki Gardens Estate', email: 'tom@example.com', phone: '+234 806 789 0123', shift: 'Night', status: 'active', totalEntries: 156 },
]

// Demo data for visitors
const demoVisitors = [
  {
    id: 1,
    name: 'Alice Johnson',
    phone: '+234 807 123 4567',
    purpose: 'Business Meeting',
    checkIn: '2024-01-15 10:30 AM',
    checkOut: '2024-01-15 2:45 PM',
    status: 'completed',
    vehicle: 'ABC-123-XY',
  },
  {
    id: 2,
    name: 'Bob Williams',
    phone: '+234 808 234 5678',
    purpose: 'Social Visit',
    checkIn: '2024-01-16 3:15 PM',
    checkOut: null,
    status: 'checked-in',
    vehicle: 'DEF-456-ZW',
  },
  {
    id: 3,
    name: 'Carol Brown',
    phone: '+234 809 345 6789',
    purpose: 'Delivery',
    checkIn: '2024-01-16 9:00 AM',
    checkOut: '2024-01-16 9:15 AM',
    status: 'completed',
    vehicle: null,
  },
]

// Demo data for security activities
const demoActivities = [
  {
    id: 1,
    timestamp: '2024-01-16 8:00 AM',
    type: 'entry',
    visitorName: 'John Smith',
    action: 'Visitor Check-In',
    notes: 'Business meeting with Apartment 12',
    duration: '2.5 hours',
  },
  {
    id: 2,
    timestamp: '2024-01-16 9:15 AM',
    type: 'incident',
    visitorName: null,
    action: 'Incident Report',
    notes: 'Suspicious activity near Block C reported',
    duration: null,
  },
  {
    id: 3,
    timestamp: '2024-01-16 10:30 AM',
    type: 'exit',
    visitorName: 'Jane Doe',
    action: 'Visitor Check-Out',
    notes: 'Delivery completed',
    duration: '15 minutes',
  },
  {
    id: 4,
    timestamp: '2024-01-16 11:45 AM',
    type: 'patrol',
    visitorName: null,
    action: 'Routine Patrol',
    notes: 'Perimeter check completed - all clear',
    duration: '45 minutes',
  },
]

function OrganisationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedHost, setSelectedHost] = useState<typeof demoHosts[0] | null>(null)
  const [selectedSecurity, setSelectedSecurity] = useState<typeof demoSecurities[0] | null>(null)
  const [isVisitorsSheetOpen, setIsVisitorsSheetOpen] = useState(false)
  const [isActivitiesSheetOpen, setIsActivitiesSheetOpen] = useState(false)

  const filteredOrgs = demoOrganisations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Organisation['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'trial':
        return 'warning'
      case 'suspended':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  const getPlanColor = (plan: Organisation['plan']) => {
    switch (plan) {
      case 'enterprise':
        return 'purple'
      case 'premium':
        return 'default'
      case 'basic':
        return 'neutral'
      default:
        return 'neutral'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organisations</h1>
            <p className="mt-1 text-gray-600">
              Manage organisations, hosts, and security personnel
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Organisation
          </Button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="organisations">
          <TabsList>
            <TabsTrigger value="organisations">Organisations</TabsTrigger>
            <TabsTrigger value="hosts">
              <Users className="w-4 h-4" />
              Hosts
            </TabsTrigger>
            <TabsTrigger value="securities">
              <Shield className="w-4 h-4" />
              Securities
            </TabsTrigger>
          </TabsList>

          {/* Organisations Tab */}
          <TabsContent value="organisations"  className="space-y-6">

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search organisations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'trial', label: 'Trial' },
                  { value: 'suspended', label: 'Suspended' },
                ]}
                className="sm:w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Organisations</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {demoOrganisations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {demoOrganisations.filter((o) => o.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Trial</div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                {demoOrganisations.filter((o) => o.status === 'trial').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Monthly Revenue</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                ₦
                {demoOrganisations
                  .reduce((sum, o) => sum + o.monthlyRevenue, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organisations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Organisations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{org.name}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(org.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanColor(org.plan)}>
                        {org.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{org.residents} Residents</div>
                        <div className="text-gray-500">
                          {org.guards} Guards, {org.admins} Admins
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₦{org.monthlyRevenue}/mo
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(org.subscriptionExpiry).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrg(org)
                            setIsModalOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOrgs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No organisations found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Hosts Tab */}
          <TabsContent value="hosts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organisation Hosts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoHosts.map((host) => (
                      <TableRow key={host.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900">{host.name}</div>
                          <div className="text-sm text-gray-500">{host.email}</div>
                        </TableCell>
                        <TableCell>{host.orgName}</TableCell>
                        <TableCell>
                          <div className="text-sm">{host.phone}</div>
                        </TableCell>
                        <TableCell>{host.apartment}</TableCell>
                        <TableCell>
                          <Badge variant={host.status === 'active' ? 'success' : 'neutral'}>
                            {host.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{host.totalVisitors}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedHost(host)
                                setIsVisitorsSheetOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              View Visitors
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Securities Tab */}
          <TabsContent value="securities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organisation Securities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Entries</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoSecurities.map((security) => (
                      <TableRow key={security.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900">{security.name}</div>
                          <div className="text-sm text-gray-500">{security.email}</div>
                        </TableCell>
                        <TableCell>{security.orgName}</TableCell>
                        <TableCell>
                          <div className="text-sm">{security.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{security.shift}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={security.status === 'active' ? 'success' : 'neutral'}>
                            {security.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{security.totalEntries}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedSecurity(security)
                                setIsActivitiesSheetOpen(true)
                              }}
                            >
                              <Activity className="w-4 h-4" />
                              View Activities
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrg(null)
        }}
        size="lg"
      >
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {selectedOrg ? 'Organisation Details' : 'Add New Organisation'}
        </ModalHeader>
        <ModalBody>
          {selectedOrg ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Name</div>
                  <div className="text-gray-900 font-semibold mt-1">
                    {selectedOrg.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Type</div>
                  <Badge variant="outline" className="mt-1">
                    {selectedOrg.type}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Plan</div>
                  <Badge variant={getPlanColor(selectedOrg.plan)} className="mt-1">
                    {selectedOrg.plan}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <Badge
                    variant={getStatusColor(selectedOrg.status)}
                    className="mt-1"
                  >
                    {selectedOrg.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Residents
                  </div>
                  <div className="text-gray-900 font-semibold mt-1">
                    {selectedOrg.residents}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Guards</div>
                  <div className="text-gray-900 font-semibold mt-1">
                    {selectedOrg.guards}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </div>
                  <div className="text-gray-900 font-semibold mt-1">
                    ₦{selectedOrg.monthlyRevenue}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Subscription Expiry
                  </div>
                  <div className="text-gray-900 font-semibold mt-1">
                    {new Date(selectedOrg.subscriptionExpiry).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Organisation Name" placeholder="Enter name" required />
              <Select
                label="Type"
                options={[
                  { value: 'HOA', label: 'HOA' },
                  { value: 'Estate', label: 'Estate' },
                  { value: 'Company', label: 'Company' },
                ]}
                required
              />
              <Select
                label="Plan"
                options={[
                  { value: 'basic', label: 'Basic' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'enterprise', label: 'Enterprise' },
                ]}
                required
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsModalOpen(false)
              setSelectedOrg(null)
            }}
          >
            {selectedOrg ? 'Close' : 'Cancel'}
          </Button>
          {!selectedOrg && <Button>Create Organisation</Button>}
          {selectedOrg && (
            <>
              <Button variant="warning">Upgrade Plan</Button>
              <Button variant="danger">Suspend</Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      {/* Visitors Bottom Sheet */}
      <BottomSheet
        isOpen={isVisitorsSheetOpen}
        onClose={() => {
          setIsVisitorsSheetOpen(false)
          setSelectedHost(null)
        }}
        title={selectedHost ? `Visitors for ${selectedHost.name}` : 'Host Visitors'}
        size="lg"
      >
        {selectedHost && (
          <div className="space-y-6">
            {/* Host Info & Stats - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Host Info Card */}
              <div className="lg:col-span-2 bg-gradient-to-r from-primary to-success rounded-xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedHost.name}</h3>
                    <p className="text-white/80 mt-1">{selectedHost.apartment}</p>
                    <p className="text-white/60 text-sm mt-2">{selectedHost.orgName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedHost.totalVisitors}</div>
                    <div className="text-white/80 text-sm">Total Visitors</div>
                  </div>
                </div>
                {/* Gate Illustrations - Multiple sizes */}
                {/* Large gate - bottom right */}
                <div className="absolute bottom-0 right-0 opacity-10">
                  <svg width="200" height="140" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
                {/* Medium gate - center bottom */}
                <div className="absolute -bottom-4 left-1/3 opacity-8">
                  <svg width="140" height="100" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
                {/* Small gate - left bottom */}
                <div className="absolute bottom-2 left-4 opacity-6">
                  <svg width="90" height="65" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total</div>
                      <div className="text-xl font-bold text-gray-900">{demoVisitors.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Active</div>
                      <div className="text-xl font-bold text-gray-900">
                        {demoVisitors.filter((v) => v.status === 'checked-in').length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">With Vehicle</div>
                      <div className="text-xl font-bold text-gray-900">
                        {demoVisitors.filter((v) => v.vehicle).length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Visitors List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visitors</h3>
              <div className="space-y-3">
                {demoVisitors.map((visitor) => (
                  <Card key={visitor.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-semibold text-gray-900">{visitor.name}</div>
                            <Badge variant={visitor.status === 'checked-in' ? 'success' : 'neutral'}>
                              {visitor.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <span className="ml-2 text-gray-900">{visitor.phone}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Purpose:</span>
                              <Badge variant="outline" className="ml-2">{visitor.purpose}</Badge>
                            </div>
                            <div>
                              <span className="text-gray-500">Check-in:</span>
                              <span className="ml-2 text-gray-900">{visitor.checkIn}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Check-out:</span>
                              <span className="ml-2 text-gray-900">
                                {visitor.checkOut || <span className="text-amber-600">Still visiting</span>}
                              </span>
                            </div>
                            {visitor.vehicle && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Vehicle:</span>
                                <span className="ml-2 font-mono text-gray-900">{visitor.vehicle}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Activities Bottom Sheet */}
      <BottomSheet
        isOpen={isActivitiesSheetOpen}
        onClose={() => {
          setIsActivitiesSheetOpen(false)
          setSelectedSecurity(null)
        }}
        title={selectedSecurity ? `Activities for ${selectedSecurity.name}` : 'Security Activities'}
        size="lg"
      >
        {selectedSecurity && (
          <div className="space-y-6">
            {/* Security Info & Stats - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Security Info Card */}
              <div className="lg:col-span-3 bg-gradient-to-r from-primary to-success rounded-xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedSecurity.name}</h3>
                    <p className="text-white/80 mt-1">{selectedSecurity.shift} Shift</p>
                    <p className="text-white/60 text-sm mt-2">{selectedSecurity.orgName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedSecurity.totalEntries}</div>
                    <div className="text-white/80 text-sm">Total Entries</div>
                  </div>
                </div>
                {/* Gate Illustrations - Multiple sizes */}
                {/* Large gate - bottom right */}
                <div className="absolute bottom-0 right-0 opacity-10">
                  <svg width="200" height="140" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
                {/* Medium gate - center bottom */}
                <div className="absolute -bottom-4 left-1/3 opacity-8">
                  <svg width="140" height="100" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
                {/* Small gate - left bottom */}
                <div className="absolute bottom-2 left-4 opacity-6">
                  <svg width="90" height="65" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="145" y="20" width="15" height="100" fill="currentColor" />
                    <rect x="35" y="40" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="70" width="110" height="8" fill="currentColor" />
                    <rect x="35" y="100" width="110" height="8" fill="currentColor" />
                    <rect x="50" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="70" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="90" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="110" y="40" width="6" height="68" fill="currentColor" />
                    <rect x="130" y="40" width="6" height="68" fill="currentColor" />
                    <path d="M 20 20 Q 90 -10 160 20" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {demoActivities.filter((a) => a.type === 'entry').length}
                    </div>
                    <div className="text-xs text-gray-600">Check-ins</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {demoActivities.filter((a) => a.type === 'exit').length}
                    </div>
                    <div className="text-xs text-gray-600">Check-outs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {demoActivities.filter((a) => a.type === 'incident').length}
                    </div>
                    <div className="text-xs text-gray-600">Incidents</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {demoActivities.filter((a) => a.type === 'patrol').length}
                    </div>
                    <div className="text-xs text-gray-600">Patrols</div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Activities Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {demoActivities.map((activity) => {
                  const getActivityIcon = (type: string) => {
                    switch (type) {
                      case 'entry':
                        return <CheckCircle className="w-5 h-5 text-green-600" />
                      case 'exit':
                        return <CheckCircle className="w-5 h-5 text-blue-600" />
                      case 'incident':
                        return <AlertTriangle className="w-5 h-5 text-red-600" />
                      case 'patrol':
                        return <Activity className="w-5 h-5 text-purple-600" />
                      default:
                        return <Activity className="w-5 h-5 text-gray-600" />
                    }
                  }

                  const getActivityColor = (type: string) => {
                    switch (type) {
                      case 'entry':
                        return 'success'
                      case 'exit':
                        return 'default'
                      case 'incident':
                        return 'danger'
                      case 'patrol':
                        return 'purple'
                      default:
                        return 'neutral'
                    }
                  }

                  return (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="font-semibold text-gray-900">{activity.action}</div>
                              <Badge variant={getActivityColor(activity.type) as any}>
                                {activity.type}
                              </Badge>
                              {activity.duration && (
                                <Badge variant="outline">{activity.duration}</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{activity.notes}</div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.timestamp}
                              </div>
                              {activity.visitorName && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {activity.visitorName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </DashboardLayout>
  )
}
