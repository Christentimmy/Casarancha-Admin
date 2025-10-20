
'use client';

import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { mockUsers, mockPosts, mockReports, weeklyUserGrowth } from '@/data/mockData';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const totalPosts = mockPosts.length;
  const pendingReports = mockReports.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeUsers} active</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% this week</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockReports.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingReports} pending</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Weekly User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyUserGrowth}>
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
