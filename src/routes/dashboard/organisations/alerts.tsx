import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Card, CardContent } from '../../components/ui/Card'
// import { Button } from '../../components/ui/Button'
// import { Input } from '../../components/ui/Input'
// import { Select } from '../../components/ui/Select'
// import { Badge } from '../../components/ui/Badge'
// import { Alert, AlertDescription, AlertTitle } from '../../components/ui/Alert'
// import { Search, CheckCircle2, Clock, XCircle } from 'lucide-react'
// import { demoSecurityAlerts } from '../../data/demo.alerts'
// import { useState } from 'react'

export const Route = createFileRoute("/dashboard/organisations/alerts")({
	component: SecurityAlertsPage,
});

function SecurityAlertsPage() {
	/*
  // Uncomment to restore full functionality
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredAlerts = demoSecurityAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.organisationName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity =
      severityFilter === 'all' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertTriangle className="w-5 h-5" />
      case 'acknowledged':
        return <Clock className="w-5 h-5" />
      case 'investigating':
        return <Search className="w-5 h-5" />
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <XCircle className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'danger'
      case 'acknowledged':
        return 'warning'
      case 'investigating':
        return 'info'
      case 'resolved':
        return 'success'
      default:
        return 'neutral'
    }
  }

  const stats = {
    total: demoSecurityAlerts.length,
    new: demoSecurityAlerts.filter((a) => a.status === 'new').length,
    investigating: demoSecurityAlerts.filter((a) => a.status === 'investigating')
      .length,
    resolved: demoSecurityAlerts.filter((a) => a.status === 'resolved').length,
  }
  */

	return (
		<DashboardLayout>
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<div className="p-6 bg-red-50 rounded-full">
							<AlertTriangle className="w-16 h-16 text-red-600" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900">Security Alerts</h2>
					<p className="text-gray-600 max-w-md">
						This page is coming soon. We're working on bringing you real-time
						security monitoring and alert management features.
					</p>
				</div>
			</div>
		</DashboardLayout>
	);

	/* Full page code below - uncomment to restore
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Alerts</h1>
            <p className="mt-1 text-gray-600">
              Real-time security alerts and incident management
            </p>
          </div>
        </div>

        {demoSecurityAlerts.filter(
          (a) => a.severity === 'critical' && a.status !== 'resolved'
        ).length > 0 && (
          <Alert variant="danger">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Alerts Require Attention</AlertTitle>
            <AlertDescription>
              You have{' '}
              {
                demoSecurityAlerts.filter(
                  (a) => a.severity === 'critical' && a.status !== 'resolved'
                ).length
              }{' '}
              unresolved critical security alert(s). Please review and take action
              immediately.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Alerts</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">New Alerts</div>
              <div className="text-3xl font-bold text-red-600 mt-2">
                {stats.new}
              </div>
              <div className="text-xs text-gray-500 mt-1">Requires action</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Under Investigation</div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                {stats.investigating}
              </div>
              <div className="text-xs text-gray-500 mt-1">In progress</div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Resolved</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {stats.resolved}
              </div>
              <div className="text-xs text-gray-500 mt-1">Completed</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Severities' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'new', label: 'New' },
                  { value: 'acknowledged', label: 'Acknowledged' },
                  { value: 'investigating', label: 'Investigating' },
                  { value: 'resolved', label: 'Resolved' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`hover:shadow-md transition-shadow ${
                alert.severity === 'critical' && alert.status !== 'resolved'
                  ? 'border-red-300'
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}
                  >
                    {getStatusIcon(alert.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <Badge
                          variant={
                            alert.severity === 'critical' || alert.severity === 'high'
                              ? 'danger'
                              : alert.severity === 'medium'
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-gray-500">Organisation</div>
                        <div className="font-medium text-gray-900 mt-1">
                          {alert.organisationName}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Location</div>
                        <div className="font-medium text-gray-900 mt-1">
                          {alert.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Reported By</div>
                        <div className="font-medium text-gray-900 mt-1">
                          {alert.reportedBy}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {alert.reportedByRole}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Time</div>
                        <div className="font-medium text-gray-900 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {(alert.acknowledgedAt || alert.resolvedAt) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 space-y-2">
                          <div>
                            Created:{' '}
                            {new Date(alert.createdAt).toLocaleString()}
                          </div>
                          {alert.acknowledgedAt && (
                            <div>
                              Acknowledged:{' '}
                              {new Date(alert.acknowledgedAt).toLocaleString()}
                            </div>
                          )}
                          {alert.resolvedAt && (
                            <div>
                              Resolved:{' '}
                              {new Date(alert.resolvedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                      {alert.status === 'new' && (
                        <Button size="sm">Acknowledge</Button>
                      )}
                      {(alert.status === 'new' ||
                        alert.status === 'acknowledged') && (
                        <Button size="sm" variant="outline">
                          Start Investigation
                        </Button>
                      )}
                      {alert.status === 'investigating' && (
                        <Button size="sm" variant="success">
                          Mark Resolved
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No alerts found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
  */
}
