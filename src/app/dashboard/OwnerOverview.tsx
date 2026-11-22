"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaBoxesStacked,
  FaCalendarCheck,
  FaCircleCheck,
  FaClipboardList,
  FaDollarSign,
  FaHourglassHalf,
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

type OwnerData = {
  stats: {
    totalListed: number;
    pendingEquipment: number;
    totalRentals: number;
    activeRentals: number;
    completedRentals: number;
    totalEarnings: number;
  };
  monthly: { month: string; earnings: number }[];
  topEquipment: { name: string; earnings: number }[];
  equipmentByStatus: { name: string; value: number }[];
};

export default function OwnerOverview() {
  const { data, loading, error } = useAnalytics<OwnerData>("/analytics/owner");

  if (loading) return <OverviewSkeleton />;
  if (error || !data) return <OverviewError />;

  const { stats } = data;
  const statuses = data.equipmentByStatus.map((d) => ({ ...d, name: cap(d.name) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={FaBoxesStacked} label="Listed equipment" value={stats.totalListed.toLocaleString("en-US")} />
        <StatCard icon={FaHourglassHalf} label="Pending approval" value={stats.pendingEquipment.toLocaleString("en-US")} />
        <StatCard icon={FaClipboardList} label="Total rentals" value={stats.totalRentals.toLocaleString("en-US")} />
        <StatCard icon={FaCalendarCheck} label="Active rentals" value={stats.activeRentals.toLocaleString("en-US")} />
        <StatCard icon={FaCircleCheck} label="Completed rentals" value={stats.completedRentals.toLocaleString("en-US")} />
        <StatCard icon={FaDollarSign} label="Total earnings" value={formatMoney(stats.totalEarnings)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Monthly earnings"
          empty={data.monthly.every((m) => m.earnings === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "var(--color-base-200)" }}
                formatter={(value) => formatMoney(Number(value ?? 0))}
              />
              <Bar dataKey="earnings" name="Earnings" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top earning equipment" empty={data.topEquipment.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topEquipment}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" horizontal={false} />
              <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(name: string) =>
                  name.length > 18 ? `${name.slice(0, 18)}...` : name
                }
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "var(--color-base-200)" }}
                formatter={(value) => formatMoney(Number(value ?? 0))}
              />
              <Bar dataKey="earnings" name="Earnings" fill="var(--color-secondary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="My equipment by status" empty={statuses.length === 0}>
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
      </div>
    </div>
  );
}