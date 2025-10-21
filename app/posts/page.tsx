'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Post } from '@/data/mockData';
import { getAllPosts, PostItem, deletePost as deletePostApi } from '@/data/posts';
import { getToken, removeToken } from '@/config/storage';
import { validateToken } from '@/data/auth';
import { Heart, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rawPosts, setRawPosts] = useState<PostItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'reported' | 'deleted'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedRaw, setSelectedRaw] = useState<PostItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogImgError, setDialogImgError] = useState(false);
  const [repostImgError, setRepostImgError] = useState(false);

  const toPlainText = (content: any): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.map(toPlainText).join(' ');
    if (typeof content === 'object') {
      if ('text' in content && typeof (content as any).text === 'string') return (content as any).text;
      if ('content' in content) return toPlainText((content as any).content);
    }
    return '';
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    validateToken(token).then((ok) => {
      if (!ok) {
        removeToken();
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
    getAllPosts({ page: targetPage })
      .then((resp) => {
        setRawPosts((prev) => (replace ? resp.data : [...prev, ...resp.data]));
        const mapped: Post[] = resp.data.map((p) => ({
          id: p.id,
          userId: p.authorId.id,
          username: p.authorId.username,
          userAvatar: p.authorId.avatarUrl ?? '',
          caption: toPlainText(p.content),
          image: (p.media && Array.isArray(p.media) && (p.media[0] as any)?.url) ? String((p.media[0] as any).url) : '',
          status: 'active',
          likes: 0,
          createdAt: p.createdAt,
        }));
        setPosts((prev) => (replace ? mapped : [...prev, ...mapped]));
        setHasNext(resp.pagination?.hasNextPage ?? false);
        setPage(resp.pagination?.page ?? targetPage);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to load posts';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  const filteredPosts = filterStatus === 'all'
    ? posts
    : posts.filter(post => post.status === filterStatus);

  const deletePost = async (postId: string) => {
    try {
      await deletePostApi(postId);
      // Update local state to reflect the deletion
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: 'deleted' as const } : post
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      setError(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'reported':
        return 'destructive';
      case 'deleted':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout title="Posts Management">
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-xl" disabled>Export Posts</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const raw = rawPosts.find(r => r.id === post.id);
            const isRepost = !!raw?.originalPostId;
            const hasPoll = !!raw?.poll;
            return (
            <Card key={post.id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {post.image ? (
                <div className="relative h-48 bg-muted">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>{post.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRepost && (
                      <Badge variant="secondary" className="rounded-lg">Repost</Badge>
                    )}
                    {hasPoll && (
                      <Badge variant="outline" className="rounded-lg">Poll</Badge>
                    )}
                    <Badge variant={getStatusColor(post.status)} className="rounded-lg">
                      {post.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{post.likes}</span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg"
                        onClick={() => {
                          setSelectedPost(post);
                          const raw = rawPosts.find(r => r.id === post.id) || null;
                          setSelectedRaw(raw);
                          setDialogImgError(false);
                          setRepostImgError(false);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Post Details</DialogTitle>
                        <DialogDescription>View post information</DialogDescription>
                      </DialogHeader>
                      {selectedPost && (
                        <div className="space-y-4">
                          {selectedPost.image && !dialogImgError ? (
                            <div className="relative h-96 bg-muted rounded-xl overflow-hidden">
                              <Image
                                src={selectedPost.image}
                                alt={selectedPost.caption}
                                fill
                                className="object-cover"
                                onError={() => setDialogImgError(true)}
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-muted flex items-center justify-center text-sm text-muted-foreground rounded-xl">
                              No image
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={selectedPost.userAvatar} />
                              <AvatarFallback>{selectedPost.username.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedPost.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedPost.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">{selectedPost.caption}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart size={16} />
                              <span>{selectedPost.likes} likes</span>
                            </div>
                            <Badge variant={getStatusColor(selectedPost.status)}>
                              {selectedPost.status}
                            </Badge>
                          </div>

                          {selectedRaw?.poll && (
                            <div className="rounded-xl border p-3 space-y-2">
                              <div className="text-sm font-medium">Poll</div>
                              <div className="text-sm">{selectedRaw.poll.question}</div>
                              <div className="space-y-1">
                                {selectedRaw.poll.options.map(opt => (
                                  <div key={opt.id} className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{opt.text}</span>
                                    <span>{opt.voteCount}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Total votes: {selectedRaw.poll.totalVotes}</span>
                                <span>{selectedRaw.poll.isActive ? 'Active' : 'Closed'}</span>
                              </div>
                            </div>
                          )}

                          {selectedRaw?.originalPostId && (
                            <div className="rounded-xl border p-3 space-y-2">
                              <div className="text-sm font-medium">Repost</div>
                              <div className="flex items-center gap-2 text-sm">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={selectedRaw.originalPostId.authorId.avatarUrl ?? ''} />
                                  <AvatarFallback>
                                    {selectedRaw.originalPostId.authorId.username?.substring(0,2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-muted-foreground">{selectedRaw.originalPostId.authorId.username}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {toPlainText(selectedRaw.originalPostId.content)}
                              </div>
                              {selectedRaw.originalPostId.media && Array.isArray(selectedRaw.originalPostId.media) && (selectedRaw.originalPostId.media[0] as any)?.url && !repostImgError && (
                                <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={String((selectedRaw.originalPostId.media[0] as any).url)}
                                    alt="Repost media"
                                    fill
                                    className="object-cover"
                                    onError={() => setRepostImgError(true)}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {post.status !== 'deleted' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="rounded-lg">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="rounded-xl"
                            onClick={() => {
                              setPosts((prev) => prev.map(p => p.id === post.id ? { ...p, status: 'deleted' as const } : p));
                            }}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          )})}
        </div>

        <div className="flex justify-center">
          {hasNext ? (
            <Button
              className="rounded-xl"
              onClick={() => fetchPage(page + 1)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load more'}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">No more posts</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
