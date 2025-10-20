
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { mockReports, Report } from '@/data/mockData';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);

  const updateReportStatus = (reportId: string, status: 'resolved' | 'dismissed') => {
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, status } : report
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'resolved':
        return 'default';
      case 'dismissed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout title="Reports">
      <div className="space-y-6">
        <Card className="rounded-2xl border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Post ID</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">#{report.id}</TableCell>
                  <TableCell>#{report.postId}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status)} className="rounded-lg">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {report.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="default" size="sm" className="rounded-lg">
                              <CheckCircle size={14} className="mr-1" />
                              Resolve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Resolve Report?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Mark this report as resolved. The reported content has been reviewed and appropriate action has been taken.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-xl"
                                onClick={() => updateReportStatus(report.id, 'resolved')}
                              >
                                Resolve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <XCircle size={14} className="mr-1" />
                              Dismiss
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dismiss Report?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Mark this report as dismissed. The reported content does not violate community guidelines.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-xl"
                                onClick={() => updateReportStatus(report.id, 'dismissed')}
                              >
                                Dismiss
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
