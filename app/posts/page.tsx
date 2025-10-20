'use client';

import { useState } from 'react';
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
import { mockPosts, Post } from '@/data/mockData';
import { Heart, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

export default function PostsPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'reported' | 'deleted'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = filterStatus === 'all'
    ? posts
    : posts.filter(post => post.status === filterStatus);

  const deletePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, status: 'deleted' as const } : post
    ));
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
          <Button className="rounded-xl">Export Posts</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-48 bg-muted">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback>{post.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.username}</span>
                  </div>
                  <Badge variant={getStatusColor(post.status)} className="rounded-lg">
                    {post.status}
                  </Badge>
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
                        onClick={() => setSelectedPost(post)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Post Details</DialogTitle>
                        <DialogDescription>View post information</DialogDescription>
                      </DialogHeader>
                      {selectedPost && (
                        <div className="space-y-4">
                          <div className="relative h-96 bg-muted rounded-xl overflow-hidden">
                            <Image
                              src={selectedPost.image}
                              alt={selectedPost.caption}
                              fill
                              className="object-cover"
                            />
                          </div>
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
                            onClick={() => deletePost(post.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
