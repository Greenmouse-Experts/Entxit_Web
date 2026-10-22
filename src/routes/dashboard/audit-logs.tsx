import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../../components/DashboardLayout'
import { FileText } from 'lucide-react'

// Full page code is backed up in audit-logs-BACKUP.tsx

export const Route = createFileRoute('/dashboard/audit-logs')({
  component: AuditLogsPage,
})

function AuditLogsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-6 bg-primary/10 rounded-full">
              <FileText className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Audit Logs
          </h2>
          <p className="text-gray-600 max-w-md">
            This page is coming soon. We're working on bringing you comprehensive
            activity tracking and audit trail features.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
