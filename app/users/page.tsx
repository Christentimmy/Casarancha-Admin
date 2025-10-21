

'use client';

import { useEffect, useState } from 'react';
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
import { getAllUsers, searchUsers, toggleBan } from '@/data/users';
import { getToken, removeToken } from '@/config/storage';
import { useRouter } from 'next/navigation';
import { validateToken } from '@/data/auth';
import { Search, Ban, CheckCircle } from 'lucide-react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasNext, setSearchHasNext] = useState(false);

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
        return;
      }
      fetchPage(1, true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPage = (targetPage: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    getAllUsers({ page: targetPage })
      .then((resp) => {
        const mapped = resp.data.map((u) => ({
          id: u.id,
          name: (u as any).displayName ?? (u as any).name ?? '',
          username: u.username,
          email: u.email,
          status: u.isBanned ? 'banned' : 'active',
          joinedDate: u.createdAt,
          avatar: (u as any).avatarUrl ?? null,
          postsCount: 0,
        })) as unknown as User[];
        setUsers((prev) => (replace ? mapped : [...prev, ...mapped]));
        setHasNext(resp.pagination?.hasNextPage ?? false);
        setPage(resp.pagination?.page ?? targetPage);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to load users';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  // Debounced server-side search (resets to page 1)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearching(false);
      setSearchResults([]);
      setSearchPage(1);
      setSearchHasNext(false);
      return;
    }
    setSearching(true);
    setError(null);
    const t = setTimeout(() => {
      searchUsers({ query: q, page: 1 })
        .then((resp) => {
          const list = resp.data;
          const mapped = list.map((u) => ({
            id: u.id,
            name: (u as any).displayName ?? (u as any).name ?? '',
            username: u.username,
            email: u.email,
            status: u.isBanned ? 'banned' : 'active',
            joinedDate: u.createdAt,
            avatar: (u as any).avatarUrl ?? null,
            postsCount: 0,
          })) as unknown as User[];
          setSearchResults(mapped);
          setSearchPage(resp.pagination?.page ?? 1);
          setSearchHasNext(resp.pagination?.hasNextPage ?? false);
        })
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : 'Search failed';
          setError(msg);
        })
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const displayUsers = searchQuery.trim() ? searchResults : users;

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
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}
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
          <Button className="rounded-xl" disabled>Export Users</Button>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar ?? undefined} />
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
                  <TableCell>{new Date(user.joinedDate as unknown as string).toLocaleDateString()}</TableCell>
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
                              onClick={async () => {
                                const prevUsers = users;
                                const nextUsers = users.map(u =>
                                  u.id === user.id
                                    ? { ...u, status: (u.status === 'active' ? 'banned' : 'active') as 'active' | 'banned' }
                                    : u
                                );
                                setUsers(nextUsers);
                                if (selectedUser && selectedUser.id === user.id) {
                                  setSelectedUser({
                                    ...selectedUser,
                                    status: (selectedUser.status === 'active' ? 'banned' : 'active') as 'active' | 'banned',
                                  });
                                }
                                try {
                                  await toggleBan(user.id);
                                } catch (e) {
                                  setUsers(prevUsers);
                                  if (selectedUser && selectedUser.id === user.id) {
                                    setSelectedUser({
                                      ...selectedUser,
                                      status: (selectedUser.status === 'active' ? 'banned' : 'active') as 'active' | 'banned',
                                    });
                                  }
                                  const msg = e instanceof Error ? e.message : 'Failed to update user status';
                                  setError(msg);
                                }
                              }}
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

        <div className="flex justify-center">
          {searchQuery.trim()
            ? (
              searchHasNext ? (
                <Button
                  className="rounded-xl"
                  onClick={async () => {
                    if (searching) return;
                    setSearching(true);
                    try {
                      const resp = await searchUsers({ query: searchQuery.trim(), page: searchPage + 1 });
                      const mapped = resp.data.map((u) => ({
                        id: u.id,
                        name: (u as any).displayName ?? (u as any).name ?? '',
                        username: u.username,
                        email: u.email,
                        status: u.isBanned ? 'banned' : 'active',
                        joinedDate: u.createdAt,
                        avatar: (u as any).avatarUrl ?? null,
                        postsCount: 0,
                      })) as unknown as User[];
                      setSearchResults((prev) => [...prev, ...mapped]);
                      setSearchPage((prev) => prev + 1);
                      setSearchHasNext(resp.pagination?.hasNextPage ?? false);
                    } catch (e) {
                      const msg = e instanceof Error ? e.message : 'Search failed';
                      setError(msg);
                    } finally {
                      setSearching(false);
                    }
                  }}
                  disabled={searching}
                >
                  {searching ? 'Loading...' : 'Load more'}
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">{searching ? 'Searching...' : 'No more results'}</div>
              )
            )
            : (
              hasNext ? (
                <Button
                  className="rounded-xl"
                  onClick={() => fetchPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more'}
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">No more users</div>
              )
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
