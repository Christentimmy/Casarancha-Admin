"use client";

import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '@/config/storage';
import { validateToken } from '@/data/auth';
import { useState } from 'react';
import { getDashboardStats, DashboardStats } from '@/data/dashboard';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    validateToken(token).then((ok) => {
      if (!ok) {
        removeToken();
        router.replace('/login');
      } else {
        getDashboardStats()
          .then((data) => setStats(data))
          .catch((e: unknown) => {
            const msg = e instanceof Error ? e.message : 'Failed to load stats';
            setError(msg);
          })
          .finally(() => setLoadingStats(false));
      }
    });
  }, [router]);
  const totalUsers = stats?.totalUser ?? 0;
  const totalPosts = stats?.totalPost ?? 0;
  const totalReports = stats?.totalReport ?? 0;
  const totalGroups = stats?.totalGroup ?? 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{loadingStats ? '—' : totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Users total</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{loadingStats ? '—' : totalPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">Posts total</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{loadingStats ? '—' : totalReports}</div>
              <p className="text-xs text-muted-foreground mt-1">Reports total</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Groups</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{loadingStats ? '—' : totalGroups}</div>
              <p className="text-xs text-muted-foreground mt-1">Groups total</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Weekly User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(stats?.days || []).map(d => ({ day: d.weekday, users: d.count }))}>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="users" fill="hsl(351, 42%, 31%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/users">
              <Button className="rounded-xl">View All Users</Button>
            </Link>
            <Link href="/posts">
              <Button variant="outline" className="rounded-xl">Moderate Posts</Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="rounded-xl">Review Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
