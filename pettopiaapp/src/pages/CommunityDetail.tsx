import React, { useEffect, useMemo, useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useParams, useNavigate } from "react-router-dom";

type Author = { user_id: string; fullname: string; avatar: string | null };
type CommentType = { comment_id: string; content: string; createdAt: string; author?: Author };
type Post = {
  post_id: string;
  author: Author;
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  likes?: any[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
};

const API_BASE_URL = (window.APP_CONFIG?.apiBaseUrl as string) || (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api/v1";

class CommunicationService {
  private baseUrl = `${API_BASE_URL}/communication`;
  private token: string | null = null;
  setToken(token: string) {
    this.token = token;
  }
  private headers(ct: string = "application/json"): HeadersInit {
    const h: HeadersInit = { "Content-Type": ct };
    if (this.token) h["Authorization"] = `Bearer ${this.token}`;
    return h;
  }
  private async ok<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP ${res.status}`);
    }
    return res.json();
  }
  async getPostDetail(id: string) {
    const res = await fetch(`${this.baseUrl}/post/${id}`, { headers: this.headers() });
    return this.ok<Post & { comments: CommentType[] }>(res);
  }
  async likePost(id: string) {
    const res = await fetch(`${this.baseUrl}/post/${id}/like`, { method: "POST", headers: this.headers() });
    return this.ok<any>(res);
  }
  async unlikePost(id: string) {
    const res = await fetch(`${this.baseUrl}/post/${id}/unlike`, { method: "POST", headers: this.headers() });
    return this.ok<any>(res);
  }
  async createComment(input: { post_id: string; user_id: string; content: string }) {
    const res = await fetch(`${this.baseUrl}/post/${input.post_id}/comment`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ user_id: input.user_id, content: input.content }),
    });
    return this.ok<any>(res);
  }
  parseTags(tags: string[]): string[] {
    try {
      return tags.map((t) => (typeof t === "string" && t.startsWith("[") ? JSON.parse(t) : t)).flat();
    } catch {
      return tags;
    }
  }
  formatTimeAgo(dateString: string) {
    const d = new Date(dateString);
    const now = new Date();
    const s = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (s < 60) return `${s} giây trước`;
    if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
    if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
    return d.toLocaleDateString("vi-VN");
  }
}

const communicationService = new CommunicationService();

function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<(Post & { comments: CommentType[] }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [liking, setLiking] = useState<boolean>(false);

  const token = useMemo(() => localStorage.getItem("authToken"), []);
  const currentUserId = useMemo(() => {
    try {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload?.id ?? null;
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (token) communicationService.setToken(token);
  }, [token]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Thiếu tham số bài viết (id)");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const detail = await communicationService.getPostDetail(id);
        setPost(detail);
      } catch (e: any) {
        setError(e?.message || "Không thể tải chi tiết bài viết.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isLikedByCurrentUser = useMemo(() => {
    if (!post || !currentUserId) return false;
    const anyLikes: any = post.likes as any;
    if (!Array.isArray(anyLikes)) return false;
    return anyLikes.some((l: any) => (typeof l === "string" ? l === currentUserId : l?.user_id === currentUserId));
  }, [post, currentUserId]);

  const toggleLike = async () => {
    if (!id) return;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để thích bài viết.");
      return;
    }
    try {
      setLiking(true);
      setPost((prev) => {
        if (!prev) return prev;
        const liked = isLikedByCurrentUser;
        const next = { ...prev } as any;
        next.likeCount = liked ? Math.max(0, prev.likeCount - 1) : prev.likeCount + 1;
        let likes: any[] = Array.isArray(prev.likes) ? [...prev.likes] : [];
        if (liked) likes = likes.filter((l: any) => (typeof l === "string" ? l !== currentUserId : l?.user_id !== currentUserId));
        else likes.push(currentUserId);
        next.likes = likes;
        return next;
      });
      if (isLikedByCurrentUser) await communicationService.unlikePost(id);
      else await communicationService.likePost(id);
    } catch (e: any) {
      try {
        if (id) setPost(await communicationService.getPostDetail(id));
      } catch {}
      alert(e?.message || "Không thể cập nhật lượt thích.");
    } finally {
      setLiking(false);
    }
  };

  const submitComment = async () => {
    if (!id) return;
    const content = commentInput.trim();
    if (!content) return;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }
    try {
      setSubmitting(true);
      await communicationService.createComment({ post_id: id, user_id: currentUserId, content });
      setCommentInput("");
      setPost(await communicationService.getPostDetail(id));
    } catch (e: any) {
      alert(e?.message || "Không thể gửi bình luận.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <Box className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Box className="container mx-auto px-4 py-10">
          <Box className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</Box>
        </Box>
      </Page>
    );
  }

  if (!post) return null;

  const parsedTags = communicationService.parseTags(post.tags || []);

  return (
    <Page className="bg-gray-50">
      <Box className="bg-white border-b border-gray-200">
        <Box className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div />
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            ← Quay lại
          </button>
        </Box>
      </Box>

      <Box className="container mx-auto px-4 py-6">
        <Box className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <Box className="flex gap-4">
            <Box className="flex-1 min-w-0">
              <Box className="flex items-center gap-3 mb-4">
                <img
                  src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`}
                  alt={post.author.fullname}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`;
                  }}
                />
                <div>
                  <h3 className="font-bold text-gray-900">{post.author.fullname}</h3>
                </div>
              </Box>
              <Box className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleString("vi-VN")}</span>
                <span className="text-sm text-gray-500">#{post.post_id}</span>
              </Box>
              <h2 className="text-2xl font-bold text-red-600 mb-4 break-words">{post.title}</h2>
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {parsedTags.map((t, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-gray-700 whitespace-pre-wrap leading-7 mb-4">{post.content}</div>
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {post.images.map((img, i) => (
                    <img key={i} src={img} className="w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
              {post.likeCount > 0 && (
                <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">{post.likeCount} người đã thích bài viết này</div>
              )}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={toggleLike}
                  disabled={liking}
                  className={`px-4 py-2 rounded-lg ${isLikedByCurrentUser ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700"}`}
                >
                  {isLikedByCurrentUser ? "Đã thích" : "Thích"}
                </button>
                <span className="text-sm text-gray-600">👁️ {post.viewCount}</span>
              </div>
            </Box>
          </Box>
        </Box>

        <Box className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bình luận ({post.commentCount})</h3>
          <div className="mb-6">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button disabled={submitting || !commentInput.trim()} onClick={submitComment} type="highlight">
                {submitting ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => (
                <div key={c.comment_id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex gap-3">
                    <img
                      src={c.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.user_id || "user"}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">{c.author?.fullname || "Người dùng"}</span>
                        <span className="text-xs text-gray-500">{communicationService.formatTimeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">Chưa có bình luận nào.</div>
            )}
          </div>
        </Box>
      </Box>
    </Page>
  );
}

export default CommunityDetailPage;


