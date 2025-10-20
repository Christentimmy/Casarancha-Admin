

'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { mockUsers, User } from '@/data/mockData';
import { Search, Ban, CheckCircle } from 'lucide-react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'banned' : 'active' as 'active' | 'banned' }
        : user
    ));
  };

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="search"
              placeholder="Search users by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button className="rounded-xl">Export Users</Button>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className="rounded-lg"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.postsCount}</TableCell>
                  <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              View and manage user information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedUser.avatar} />
                                  <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                                  <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Email:</span>
                                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Status:</span>
                                  <p className="text-sm text-muted-foreground">{selectedUser.status}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Posts:</span>
                                  <p className="text-sm text-muted-foreground">{selectedUser.postsCount}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Joined:</span>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedUser.joinedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={user.status === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            className="rounded-lg"
                          >
                            {user.status === 'active' ? (
                              <>
                                <Ban size={14} className="mr-1" />
                                Ban
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} className="mr-1" />
                                Unban
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.status === 'active' ? 'Ban User?' : 'Unban User?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {user.status === 'active'
                                ? `Are you sure you want to ban ${user.name}? They will no longer be able to access the platform.`
                                : `Are you sure you want to unban ${user.name}? They will be able to access the platform again.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-xl"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
