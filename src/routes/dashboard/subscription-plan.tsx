import { createFileRoute } from "@tanstack/react-router";
import {
  Building,
  Check,
  Edit,
  FileText,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "../../components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import {
  demoInvoices,
  demoPlans,
  demoSubscriptions,
} from "../../data/demo.subscriptions";

export const Route = createFileRoute("/dashboard/subscription-plan")({
  component: SubscriptionsPage,
});

// Demo data for organizations on plans
const demoOrganizationsOnPlan = {
  basic: [
    {
      id: 1,
      name: "Lekki Gardens Estate",
      users: 150,
      joinedDate: "2024-01-15",
    },
    { id: 2, name: "Ikoyi Heights", users: 120, joinedDate: "2024-01-20" },
  ],
  premium: [
    {
      id: 3,
      name: "Victoria Island Plaza",
      users: 450,
      joinedDate: "2023-12-10",
    },
    {
      id: 4,
      name: "Banana Island Complex",
      users: 380,
      joinedDate: "2024-01-05",
    },
  ],
  enterprise: [
    {
      id: 5,
      name: "Eko Atlantic Towers",
      users: 1200,
      joinedDate: "2023-11-20",
    },
  ],
};

function SubscriptionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [viewOrgsForPlan, setViewOrgsForPlan] = useState<string | null>(null);

  const getInvoiceStatusColor = (
    status: "paid" | "pending" | "overdue" | "cancelled",
  ) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      case "cancelled":
        return "neutral";
    }
  };

  const totalRevenue = demoInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingRevenue = demoInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDeletePlan = (planId: string) => {
    // In real app, this would call an API
    if (confirm("Are you sure you want to delete this plan?")) {
      console.log("Deleting plan:", planId);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription & Billing
            </h1>
            <p className="mt-1 text-gray-600">
              Manage plans, subscriptions, invoices, and promo codes
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Tag className="w-4 h-4" />
              Promo Codes
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Plan
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                ₦{totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">All time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Pending Revenue</div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                ₦{pendingRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Awaiting payment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Active Subscriptions</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {demoSubscriptions.filter((s) => s.status === "active").length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {demoSubscriptions.length} total
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">MRR</div>
              <div className="text-3xl font-bold text-success mt-2">
                ₦
                {demoSubscriptions
                  .filter((s) => s.status === "active")
                  .reduce((sum, s) => sum + s.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Monthly recurring revenue
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demoPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  {plan.name === "enterprise" && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="purple">Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl capitalize">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ₦{plan.price}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit Plan
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setViewOrgsForPlan(plan.name)}
                      >
                        <Building className="w-4 h-4" />
                        View Organisations
                      </Button>
                      <Button
                        className="w-full"
                        variant="danger"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {sub.organisationName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sub.plan === "enterprise"
                                ? "purple"
                                : sub.plan === "premium"
                                  ? "default"
                                  : "neutral"
                            }
                            className="capitalize"
                          >
                            {sub.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sub.status === "active"
                                ? "success"
                                : sub.status === "trial"
                                  ? "warning"
                                  : "neutral"
                            }
                            className="capitalize"
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₦{sub.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="capitalize">{sub.billingCycle}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(sub.nextBillingDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              Upgrade
                            </Button>
                            <Button size="sm" variant="ghost">
                              •••
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

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoices</CardTitle>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {invoice.organisationName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₦{invoice.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getInvoiceStatusColor(invoice.status)}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {invoice.paidDate
                              ? new Date(invoice.paidDate).toLocaleDateString()
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {invoice.status === "pending" && (
                              <Button size="sm">Send Reminder</Button>
                            )}
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

        {/* Create Plan Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="lg"
        >
          <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
            Create New Plan
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Plan Name"
                placeholder="e.g., Basic, Premium, Enterprise"
                required
              />
              <Input label="Price (₦)" type="number" placeholder="0" required />
              <Input
                label="Description"
                placeholder="Brief description of the plan"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Features</p>
                <Input placeholder="Feature 1" />
                <Input placeholder="Feature 2" />
                <Input placeholder="Feature 3" />
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Feature
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button>Create Plan</Button>
          </ModalFooter>
        </Modal>

        {/* Edit Plan Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          }}
          size="lg"
        >
          <ModalHeader
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedPlan(null);
            }}
          >
            Edit Plan
          </ModalHeader>
          <ModalBody>
            {selectedPlan && (
              <div className="space-y-4">
                <Input
                  label="Plan Name"
                  defaultValue={selectedPlan.name}
                  className="capitalize"
                  required
                />
                <Input
                  label="Price (₦)"
                  type="number"
                  defaultValue={selectedPlan.price}
                  required
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Features</p>
                  {selectedPlan.features.map((feature: string) => (
                    <Input key={feature} defaultValue={feature} />
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </Button>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button>Update Plan</Button>
          </ModalFooter>
        </Modal>

        {/* View Organizations on Plan Modal */}
        <Modal
          isOpen={viewOrgsForPlan !== null}
          onClose={() => setViewOrgsForPlan(null)}
          size="lg"
        >
          <ModalHeader onClose={() => setViewOrgsForPlan(null)}>
            Organisations on{" "}
            {viewOrgsForPlan
              ? viewOrgsForPlan.charAt(0).toUpperCase() +
                viewOrgsForPlan.slice(1)
              : ""}{" "}
            Plan
          </ModalHeader>
          <ModalBody>
            {viewOrgsForPlan && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    demoOrganizationsOnPlan[
                      viewOrgsForPlan as keyof typeof demoOrganizationsOnPlan
                    ] || []
                  ).map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {org.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>{org.users}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(org.joinedDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setViewOrgsForPlan(null)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}
