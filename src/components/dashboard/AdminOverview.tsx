"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaBoxesStacked,
  FaCircleCheck,
  FaClipboardList,
  FaDollarSign,
  FaHourglassHalf,
  FaUsers,
} from "react-icons/fa6";
import { formatMoney } from "@/lib/utils";
import {
  ChartCard,
  OverviewError,
  OverviewSkeleton,
  PALETTE,
  StatCard,
  axisTick,
  cap,
  tooltipStyle,
  useAnalytics,
} from "./analytics-ui";

type AdminData = {
  stats: {
    totalUsers: number;
    totalEquipment: number;
    totalBookings: number;
    pendingApprovals: number;
    completedRentals: number;
    totalRevenue: number;
  };
  monthly: { month: string; bookings: number; revenue: number }[];
  usersByRole: { name: string; value: number }[];
  equipmentByStatus: { name: string; value: number }[];
};

export default function AdminOverview() {
  const { data, loading, error } = useAnalytics<AdminData>("/analytics/admin");

  if (loading) return <OverviewSkeleton />;
  if (error || !data) return <OverviewError />;

  const { stats } = data;
  const roles = data.usersByRole.map((d) => ({ ...d, name: cap(d.name) }));
  const statuses = data.equipmentByStatus.map((d) => ({ ...d, name: cap(d.name) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={FaUsers} label="Total users" value={stats.totalUsers.toLocaleString("en-US")} />
        <StatCard icon={FaBoxesStacked} label="Total equipment" value={stats.totalEquipment.toLocaleString("en-US")} />
        <StatCard icon={FaClipboardList} label="Total bookings" value={stats.totalBookings.toLocaleString("en-US")} />
        <StatCard icon={FaHourglassHalf} label="Pending approvals" value={stats.pendingApprovals.toLocaleString("en-US")} />
        <StatCard icon={FaCircleCheck} label="Completed rentals" value={stats.completedRentals.toLocaleString("en-US")} />
        <StatCard icon={FaDollarSign} label="Total revenue" value={formatMoney(stats.totalRevenue)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Monthly bookings"
          empty={data.monthly.every((m) => m.bookings === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-base-200)" }} />
              <Bar dataKey="bookings" name="Bookings" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Monthly revenue"
          empty={data.monthly.every((m) => m.revenue === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatMoney(Number(value ?? 0))}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="var(--color-secondary)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Equipment by status" empty={statuses.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statuses} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {statuses.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Users by role" empty={roles.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={roles} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {roles.map((_, i) => (
                  <Cell key={i} fill={PALETTE[(i + 1) % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
