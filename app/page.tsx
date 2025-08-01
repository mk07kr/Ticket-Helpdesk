"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Ticket,
  BarChart,
  Home,
  Download,
  Users,
  Shield,
  Zap,
  HeadphonesIcon,
} from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

// Mock data and types
interface User {
  id: string
  email: string
  role: "ADMIN" | "USER"
  name: string
  createdAt: string
}

interface TicketType {
  id: string
  title: string
  description: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  createdBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export default function Component() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", role: "USER" })
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: "1",
      title: "Login Issue",
      description: "Cannot login to the system",
      status: "OPEN",
      priority: "HIGH",
      createdBy: "user@example.com",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Feature Request",
      description: "Need dark mode support",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      createdBy: "user2@example.com",
      assignedTo: "admin@example.com",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-16",
    },
    {
      id: "3",
      title: "Bug Report",
      description: "Application crashes on startup",
      status: "RESOLVED",
      priority: "HIGH",
      createdBy: "user3@example.com",
      createdAt: "2024-01-13",
      updatedAt: "2024-01-17",
    },
    {
      id: "4",
      title: "Performance Issue",
      description: "Page loads slowly",
      status: "OPEN",
      priority: "LOW",
      createdBy: "user@example.com",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
    },
  ])
  const [users, setUsers] = useState<User[]>([
    { id: "1", email: "admin@example.com", role: "ADMIN", name: "Admin User", createdAt: "2024-01-01" },
    { id: "2", email: "user@example.com", role: "USER", name: "Regular User", createdAt: "2024-01-10" },
  ])
  const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: "MEDIUM" })
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)

  // Calculate real-time analytics based on actual ticket data
  const ticketAnalytics = {
    statusDistribution: [
      { name: "Open", value: tickets.filter((t) => t.status === "OPEN").length, color: "#ef4444" },
      { name: "In Progress", value: tickets.filter((t) => t.status === "IN_PROGRESS").length, color: "#f59e0b" },
      { name: "Resolved", value: tickets.filter((t) => t.status === "RESOLVED").length, color: "#10b981" },
    ],
    priorityDistribution: [
      { priority: "High", count: tickets.filter((t) => t.priority === "HIGH").length, color: "#ef4444" },
      { priority: "Medium", count: tickets.filter((t) => t.priority === "MEDIUM").length, color: "#f59e0b" },
      { priority: "Low", count: tickets.filter((t) => t.priority === "LOW").length, color: "#10b981" },
    ],
    resolutionTime: [
      { range: "< 1 day", count: 1 },
      { range: "1-3 days", count: 2 },
      { range: "3-7 days", count: 1 },
      { range: "> 7 days", count: 0 },
    ],
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - in real app, this would call Spring Boot API
    const user = users.find((u) => u.email === loginForm.email)
    if (user) {
      setCurrentUser(user)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock signup - in real app, this would call Spring Boot API
    const newUser: User = {
      id: Date.now().toString(),
      email: signupForm.email,
      role: signupForm.role as "ADMIN" | "USER",
      name: signupForm.name,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    const ticket: TicketType = {
      id: Date.now().toString(),
      title: newTicket.title,
      description: newTicket.description,
      status: "OPEN",
      priority: newTicket.priority as "LOW" | "MEDIUM" | "HIGH",
      createdBy: currentUser.email,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setTickets([...tickets, ticket])
    setNewTicket({ title: "", description: "", priority: "MEDIUM" })
    setIsCreateTicketOpen(false)
  }

  const updateTicketStatus = (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date().toISOString().split("T")[0] } : ticket,
      ),
    )
  }

  const exportToExcel = () => {
    // Filter tickets based on user role
    const ticketsToExport =
      currentUser?.role === "ADMIN" ? tickets : tickets.filter((ticket) => ticket.createdBy === currentUser?.email)

    // Create CSV content
    const headers = [
      "Ticket ID",
      "Title",
      "Description",
      "Status",
      "Priority",
      "Created By",
      "Assigned To",
      "Created Date",
      "Updated Date",
    ]
    const csvContent = [
      headers.join(","),
      ...ticketsToExport.map((ticket) =>
        [
          ticket.id,
          `"${ticket.title.replace(/"/g, '""')}"`, // Escape quotes in title
          `"${ticket.description.replace(/"/g, '""')}"`, // Escape quotes in description
          ticket.status,
          ticket.priority,
          ticket.createdBy,
          ticket.assignedTo || "Unassigned",
          ticket.createdAt,
          ticket.updatedAt,
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `tickets_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Ticket System</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold">Ticket Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser.name}</span>
              <Button variant="outline" onClick={() => setCurrentUser(null)}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">
              <Home className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <Ticket className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative px-8 py-16 text-center text-white">
                <div className="mx-auto max-w-3xl">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                    Welcome to Your
                    <span className="block text-yellow-300">Support Hub</span>
                  </h1>
                  <p className="text-xl leading-8 text-blue-100 mb-8">
                    Streamline your support experience with our comprehensive ticket management system. Get help faster,
                    track progress, and stay connected with our support team.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-300" />
                      <span>Fast Response</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-300" />
                      <span>Secure Platform</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Your Account</span>
                  </CardTitle>
                  <CardDescription>Account information and current status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <p className="text-lg font-semibold">{currentUser.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <p className="text-lg font-semibold">{currentUser.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                      <Badge
                        variant={currentUser.role === "ADMIN" ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {currentUser.role === "ADMIN" ? "Administrator" : "User"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                      <p className="text-lg font-semibold">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-green-600" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Your Tickets</span>
                      <span className="font-bold text-lg">
                        {tickets.filter((t) => t.createdBy === currentUser.email).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Open Issues</span>
                      <span className="font-bold text-lg text-red-600">
                        {tickets.filter((t) => t.createdBy === currentUser.email && t.status === "OPEN").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resolved</span>
                      <span className="font-bold text-lg text-green-600">
                        {tickets.filter((t) => t.createdBy === currentUser.email && t.status === "RESOLVED").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Create Tickets</h3>
                  <p className="text-gray-600 text-sm">Submit support requests and track their progress in real-time</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeadphonesIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">
                    Get help whenever you need it with our round-the-clock support team
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600 text-sm">Monitor your tickets and get updates on resolution progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            {currentUser.role === "USER" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Tickets</CardTitle>
                  <CardDescription>Latest support requests and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets
                      .filter((t) => t.createdBy === currentUser.email)
                      .slice(0, 3)
                      .map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(ticket.status)}
                            <div>
                              <p className="font-medium">{ticket.title}</p>
                              <p className="text-sm text-gray-500">Created on {ticket.createdAt}</p>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                      ))}
                    {tickets.filter((t) => t.createdBy === currentUser.email).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No tickets yet. Create your first support ticket to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {currentUser.role === "ADMIN" && (
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <div className="flex items-center space-x-4">
                  <Button onClick={exportToExcel} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Badge variant="outline">Last updated: {new Date().toLocaleDateString()}</Badge>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                        <p className="text-2xl font-bold">{tickets.length}</p>
                      </div>
                      <Ticket className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                        <p className="text-2xl font-bold text-red-600">
                          {tickets.filter((t) => t.status === "OPEN").length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {tickets.filter((t) => t.status === "IN_PROGRESS").length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Resolved</p>
                        <p className="text-2xl font-bold text-green-600">
                          {tickets.filter((t) => t.status === "RESOLVED").length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Status Distribution</CardTitle>
                    <CardDescription>Current status breakdown of all tickets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ticketAnalytics.statusDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {ticketAnalytics.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Priority Distribution Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tickets by Priority</CardTitle>
                    <CardDescription>Distribution of tickets across priority levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={ticketAnalytics.priorityDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="priority" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {ticketAnalytics.priorityDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resolution Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Time Analysis</CardTitle>
                  <CardDescription>How quickly tickets are being resolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={ticketAnalytics.resolutionTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest ticket updates and system activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.slice(0, 3).map((ticket) => (
                      <div key={ticket.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {getStatusIcon(ticket.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{ticket.title}</p>
                          <p className="text-xs text-gray-500">
                            {ticket.status} • Created by {ticket.createdBy} • {ticket.createdAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{currentUser.role === "ADMIN" ? "All Tickets" : "My Tickets"}</h2>
              <div className="flex items-center space-x-4">
                <Button onClick={exportToExcel} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
                {currentUser.role === "USER" && (
                  <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Ticket</DialogTitle>
                        <DialogDescription>Describe your issue and we'll help you resolve it.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ticket-title">Title</Label>
                          <Input
                            id="ticket-title"
                            value={newTicket.title}
                            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket-description">Description</Label>
                          <Textarea
                            id="ticket-description"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket-priority">Priority</Label>
                          <Select
                            value={newTicket.priority}
                            onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">
                          Create Ticket
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created Date</TableHead>
                      {currentUser.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets
                      .filter((ticket) => currentUser.role === "ADMIN" || ticket.createdBy === currentUser.email)
                      .map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(ticket.status)}
                              <span className="text-sm">{ticket.status.replace("_", " ")}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{ticket.title}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          </TableCell>
                          <TableCell>{ticket.createdBy}</TableCell>
                          <TableCell>{ticket.createdAt}</TableCell>
                          {currentUser.role === "ADMIN" && (
                            <TableCell>
                              <Select
                                value={ticket.status}
                                onValueChange={(value) => updateTicketStatus(ticket.id, value as any)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">Open</SelectItem>
                                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
