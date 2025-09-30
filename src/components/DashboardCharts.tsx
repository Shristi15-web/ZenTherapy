import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
  Activity,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { therapyServices } from "@/data/services.js";
import { therapists } from "@/data/therapists.js";
import { mockAppointments, bookingService } from "@/data/appointments.js";
import { testimonials, reviewStats } from "@/data/testimonials.js";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

const DashboardCharts = () => {
  const [timeRange, setTimeRange] = useState("30"); // 7, 30, 90 days
  const [viewType, setViewType] = useState("overview"); // overview, financial, operational

  // Get all appointments including localStorage ones
  const allAppointments = useMemo(() => {
    return bookingService.getAllAppointments();
  }, []);

  // Filter appointments by time range
  const filteredAppointments = useMemo(() => {
    const days = parseInt(timeRange);
    const startDate = subDays(new Date(), days);
    return allAppointments.filter(
      (apt) => new Date(apt.date) >= startDate && apt.status !== "cancelled"
    );
  }, [allAppointments, timeRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(
      (apt) => apt.status === "completed"
    ).length;
    const totalRevenue = filteredAppointments
      .filter(
        (apt) => apt.status === "completed" && apt.paymentStatus === "paid"
      )
      .reduce((sum, apt) => sum + apt.price, 0);

    const previousPeriodStart = subDays(new Date(), parseInt(timeRange) * 2);
    const previousPeriodEnd = subDays(new Date(), parseInt(timeRange));
    const previousAppointments = allAppointments.filter(
      (apt) =>
        new Date(apt.date) >= previousPeriodStart &&
        new Date(apt.date) < previousPeriodEnd &&
        apt.status !== "cancelled"
    );

    const appointmentGrowth =
      previousAppointments.length > 0
        ? ((totalAppointments - previousAppointments.length) /
            previousAppointments.length) *
          100
        : 0;

    const averageRating = reviewStats.averageRating;
    const totalReviews = reviewStats.totalReviews;

    return {
      totalAppointments,
      completedAppointments,
      totalRevenue,
      appointmentGrowth,
      averageRating,
      totalReviews,
      completionRate:
        totalAppointments > 0
          ? (completedAppointments / totalAppointments) * 100
          : 0,
    };
  }, [filteredAppointments, allAppointments, timeRange]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Daily appointments chart
    const days = parseInt(timeRange);
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date(),
    });

    const dailyData = dateRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayAppointments = filteredAppointments.filter(
        (apt) => apt.date === dateStr
      );
      const revenue = dayAppointments
        .filter(
          (apt) => apt.status === "completed" && apt.paymentStatus === "paid"
        )
        .reduce((sum, apt) => sum + apt.price, 0);

      return {
        date: format(date, "MMM dd"),
        appointments: dayAppointments.length,
        revenue: revenue,
        completed: dayAppointments.filter((apt) => apt.status === "completed")
          .length,
      };
    });

    // Service popularity
    const serviceStats = therapyServices
      .map((service) => {
        const serviceAppointments = filteredAppointments.filter(
          (apt) => apt.serviceId === service.id
        );
        const revenue = serviceAppointments
          .filter(
            (apt) => apt.status === "completed" && apt.paymentStatus === "paid"
          )
          .reduce((sum, apt) => sum + apt.price, 0);

        return {
          name:
            service.name.length > 15
              ? service.name.substring(0, 15) + "..."
              : service.name,
          fullName: service.name,
          appointments: serviceAppointments.length,
          revenue: revenue,
          price: service.price,
        };
      })
      .filter((service) => service.appointments > 0)
      .sort((a, b) => b.appointments - a.appointments);

    // Therapist performance
    const therapistStats = therapists
      .map((therapist) => {
        const therapistAppointments = filteredAppointments.filter(
          (apt) => apt.therapistId === therapist.id
        );
        const revenue = therapistAppointments
          .filter(
            (apt) => apt.status === "completed" && apt.paymentStatus === "paid"
          )
          .reduce((sum, apt) => sum + apt.price, 0);

        const therapistReviews = testimonials.filter(
          (t) => t.therapistId === therapist.id
        );
        const avgRating =
          therapistReviews.length > 0
            ? therapistReviews.reduce((sum, r) => sum + r.rating, 0) /
              therapistReviews.length
            : 0;

        return {
          name: therapist.name.split(" ")[0], // First name only for chart
          fullName: therapist.name,
          appointments: therapistAppointments.length,
          revenue: revenue,
          rating: avgRating,
          reviews: therapistReviews.length,
        };
      })
      .filter((therapist) => therapist.appointments > 0)
      .sort((a, b) => b.appointments - a.appointments);

    // Status distribution
    const statusData = [
      {
        name: "Completed",
        value: filteredAppointments.filter((apt) => apt.status === "completed")
          .length,
        color: "#22c55e",
      },
      {
        name: "Confirmed",
        value: filteredAppointments.filter((apt) => apt.status === "confirmed")
          .length,
        color: "#3b82f6",
      },
      {
        name: "Pending",
        value: filteredAppointments.filter((apt) => apt.status === "pending")
          .length,
        color: "#f59e0b",
      },
      {
        name: "Cancelled",
        value: allAppointments.filter((apt) => apt.status === "cancelled")
          .length,
        color: "#ef4444",
      },
    ].filter((status) => status.value > 0);

    return {
      dailyData,
      serviceStats,
      therapistStats,
      statusData,
    };
  }, [filteredAppointments, allAppointments, timeRange]);

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = "number",
  }) => {
    const formattedValue =
      format === "currency"
        ? `$${value.toLocaleString()}`
        : format === "percentage"
        ? `${value.toFixed(1)}%`
        : format === "rating"
        ? `${value.toFixed(1)}/5`
        : value.toLocaleString();

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          {change !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : change < 0 ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={
                  change > 0
                    ? "text-green-500"
                    : change < 0
                    ? "text-red-500"
                    : ""
                }
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              <span>from last period</span>
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your practice performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Appointments"
          value={metrics.totalAppointments}
          change={metrics.appointmentGrowth}
          icon={Calendar}
        />
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Average Rating"
          value={metrics.averageRating}
          icon={Star}
          format="rating"
        />
        <MetricCard
          title="Completion Rate"
          value={metrics.completionRate}
          icon={Target}
          format="percentage"
        />
      </div>

      {/* Charts */}
      <Tabs value={viewType} onValueChange={setViewType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Appointments Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>
                  Daily appointment bookings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>
                  Distribution of appointment statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {chartData.statusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>
                Most booked services in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.serviceStats.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => {
                      const service = chartData.serviceStats.find(
                        (s) => s.name === label
                      );
                      return service ? service.fullName : label;
                    }}
                  />
                  <Bar dataKey="appointments" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>
                  Income generated by each service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.serviceStats.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Revenue"]}
                      labelFormatter={(label) => {
                        const service = chartData.serviceStats.find(
                          (s) => s.name === label
                        );
                        return service ? service.fullName : label;
                      }}
                    />
                    <Bar dataKey="revenue" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${metrics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  From {metrics.completedAppointments} completed appointments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Average Revenue per Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  $
                  {metrics.completedAppointments > 0
                    ? (
                        metrics.totalRevenue / metrics.completedAppointments
                      ).toFixed(0)
                    : 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Per completed session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600">
                  {chartData.serviceStats[0]?.fullName || "N/A"}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {chartData.serviceStats[0]?.appointments || 0} bookings
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          {/* Therapist Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Therapist Performance</CardTitle>
              <CardDescription>
                Appointment bookings by therapist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.therapistStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => {
                      const therapist = chartData.therapistStats.find(
                        (t) => t.name === label
                      );
                      return therapist ? therapist.fullName : label;
                    }}
                  />
                  <Bar dataKey="appointments" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Operational Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Therapists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{therapists.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total practitioners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {therapyServices.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available treatments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalReviews}</div>
                <p className="text-xs text-muted-foreground">
                  Patient feedback
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Booking Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    (metrics.totalAppointments / (parseInt(timeRange) * 5)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Capacity utilization
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardCharts;
