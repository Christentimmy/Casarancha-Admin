
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReportItem, getAllReports, updateReportStatus, MediaItem, PollOption } from '@/data/reports';
import { CheckCircle, XCircle, Eye, User, FileText, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'dismissed' | 'action_taken'>('all');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllReports({
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      setReports(response.data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken') => {
    try {
      await updateReportStatus(reportId, status);
      setReports(reports.map(report =>
        report.id === reportId ? { ...report, status } : report
      ));
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status });
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to update report status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'reviewed':
        return 'default';
      case 'dismissed':
        return 'secondary';
      case 'action_taken':
        return 'default';
      default:
        return 'default';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User size={14} className="mr-1" />;
      case 'comment':
        return <MessageSquare size={14} className="mr-1" />;
      default:
        return <FileText size={14} className="mr-1" />;
    }
  };

  const formatFromNow = (iso?: string) => {
    if (!iso) return 'N/A';
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return 'N/A';
    return formatDistanceToNow(new Date(t), { addSuffix: true });
  };

  const renderReferencePreview = (report: ReportItem) => {
    if (!report.reference) return 'No reference available';
    
    if (report.type === 'post' && 'content' in report.reference) {
      const content = report.reference.content as { text?: string; content?: Array<{ text?: string }> };
      const text = content?.text || (content?.content?.[0]?.text || 'No content');
      return (
        <div className="truncate max-w-xs">
          {text}
        </div>
      );
    } else if (report.type === 'user' && 'username' in report.reference) {
      return `@${report.reference.username}`;
    }
    
    return 'View details';
  };

  return (
    <AdminLayout title="Reports">
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStatusFilter('all')}
              className="rounded-xl"
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStatusFilter('pending')}
              className="rounded-xl"
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'reviewed' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStatusFilter('reviewed')}
              className="rounded-xl"
            >
              Reviewed
            </Button>
            <Button 
              variant={statusFilter === 'action_taken' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStatusFilter('action_taken')}
              className="rounded-xl"
            >
              Action Taken
            </Button>
            <Button 
              variant={statusFilter === 'dismissed' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStatusFilter('dismissed')}
              className="rounded-xl"
            >
              Dismissed
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.reporter.avatarUrl || ''} />
                            <AvatarFallback>{report.reporter.displayName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="truncate max-w-[120px]">
                            <div className="font-medium truncate">{report.reporter.displayName}</div>
                            <div className="text-xs text-muted-foreground truncate">@{report.reporter.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.reportedUser.avatarUrl || ''} />
                            <AvatarFallback>{report.reportedUser.displayName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="truncate max-w-[120px]">
                            <div className="font-medium truncate">{report.reportedUser.displayName}</div>
                            <div className="text-xs text-muted-foreground truncate">@{report.reportedUser.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getReportTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {renderReferencePreview(report)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status)} className="rounded-lg">
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-lg"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                          </Dialog>

                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Report Details</DialogTitle>
                <DialogDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={getStatusColor(selectedReport.status)} className="rounded-lg">
                      {selectedReport.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {formatFromNow(selectedReport.createdAt)}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reported By</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={selectedReport.reporter.avatarUrl || ''} />
                        <AvatarFallback>{selectedReport.reporter.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedReport.reporter.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{selectedReport.reporter.username}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reported User</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={selectedReport.reportedUser.avatarUrl || ''} />
                        <AvatarFallback>{selectedReport.reportedUser.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedReport.reportedUser.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{selectedReport.reportedUser.username}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                  <p className="mt-1">{selectedReport.description}</p>
                </div>

                {selectedReport.reference && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {selectedReport.type === 'post' ? 'Reported Post' : 'Reported Content'}
                    </h4>
                    
                    {selectedReport.type === 'post' && 'content' in selectedReport.reference && (
                      <Card className="border-border/50">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {/* Post content */}
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {selectedReport.reference.content?.text || 'No content'}
                            </div>

                            {/* Media */}
                            {selectedReport.reference.media?.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {(selectedReport.reference.media as MediaItem[]).map((media, index) => (
                                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                    <Image
                                      src={media.thumbnailUrl || media.url}
                                      alt={`Media ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Poll */}
                            {selectedReport.reference.poll && (
                              <div className="space-y-2">
                                <h4 className="font-medium">{selectedReport.reference.poll.question}</h4>
                                <div className="space-y-2">
                                  {selectedReport.reference.poll.options.map((option: PollOption) => (
                                    <div key={option.id} className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>{option.text}</span>
                                        <span className="text-muted-foreground">{option.voteCount} votes</span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary/50 rounded-full"
                                          style={{
                                            width: `${(option.voteCount / Math.max(1, selectedReport.reference.poll?.totalVotes || 1)) * 100}%`
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {selectedReport.reference.poll.totalVotes} total votes • {selectedReport.reference.poll.allowMultipleChoices ? 'Multiple choices allowed' : 'Single choice'}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedReport.type === 'user' && 'username' in selectedReport.reference && (
                      <Card className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={selectedReport.reference.avatarUrl || ''} />
                              <AvatarFallback>{selectedReport.reference.displayName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold">{selectedReport.reference.displayName}</h3>
                              <p className="text-muted-foreground">@{selectedReport.reference.username}</p>
                              {selectedReport.reference.isBanned && (
                                <Badge variant="destructive" className="mt-1">Banned</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedReport.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                      className="rounded-xl"
                    >
                      <XCircle size={16} className="mr-2" />
                      Dismiss Report
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedReport.id, 'reviewed')}
                      className="rounded-xl"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark Reviewed
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
