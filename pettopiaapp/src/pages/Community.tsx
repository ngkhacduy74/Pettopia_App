import React, { useEffect, useMemo, useState } from "react";
import { Page, Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";

type Author = {
  user_id: string;
  fullname: string;
  avatar: string | null;
};

type Post = {
  post_id: string;
  author: Author;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  isHidden: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = (window.APP_CONFIG?.apiBaseUrl as string) || (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api/v1";

class CommunicationService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/communication`;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(contentType: string = "application/json"): HeadersInit {
    const headers: HeadersInit = { "Content-Type": contentType };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async getAllPosts(): Promise<Post[]> {
    const res = await fetch(`${this.baseUrl}/all`, { headers: this.getHeaders() });
    return this.handleResponse<Post[]>(res);
  }

  async getTrendingPosts(limit: number): Promise<Post[]> {
    const res = await fetch(`${this.baseUrl}/trending?limit=${limit}`, { headers: this.getHeaders() });
    return this.handleResponse<Post[]>(res);
  }

  parseTags(tags: string[]): string[] {
    if (!tags || tags.length === 0) return [];
    try {
      return tags
        .map((t) => (typeof t === "string" && t.startsWith("[") ? JSON.parse(t) : t))
        .reduce<string[]>((acc, cur) => acc.concat(cur), []);
    } catch {
      return tags as unknown as string[];
    }
  }

  formatDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" });
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  }
}

const communicationService = new CommunicationService();

function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const categories = useMemo(
    () => [
      { id: "thongbao", name: "Thông báo", color: "bg-blue-100 text-blue-600" },
      { id: "gopy", name: "Góp ý", color: "bg-orange-100 text-orange-600" },
      { id: "tintuc", name: "Tin tức", color: "bg-cyan-100 text-cyan-600" },
      { id: "review", name: "Review sản phẩm", color: "bg-purple-100 text-purple-600" },
      { id: "chiase", name: "Chia sẻ kiến thức", color: "bg-green-100 text-green-600" },
      { id: "tuvan", name: "Tư vấn", color: "bg-pink-100 text-pink-600" },
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) communicationService.setToken(token);
    loadPosts();
    loadTrendingPosts();
  }, []);

  useEffect(() => {
    if (allPosts.length === 0) return;
    setSearchQuery("");
    setCurrentPage(1);
    if (activeTab !== "all") {
      const filtered = allPosts.filter((p) => (p.tags || []).map((t) => String(t).toLowerCase()).includes(activeTab));
      setPosts(filtered);
    } else {
      setPosts(allPosts);
    }
  }, [activeTab, allPosts]);

  useEffect(() => {
    if (allPosts.length === 0 && !searchQuery) return;
    const timer = setTimeout(() => {
      handleSearch();
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, allPosts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await communicationService.getAllPosts();
      const normalized = (data || [])
        .filter((p) => !p.isHidden)
        .map((p) => ({ ...p, tags: communicationService.parseTags(p.tags) }));
      setAllPosts(normalized);
      setPosts(normalized);
    } catch (e) {
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      setAllPosts([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingPosts = async () => {
    try {
      const response = await communicationService.getTrendingPosts(5);
      const postsArray = (Array.isArray(response) ? response : []).map((p) => ({
        ...p,
        tags: communicationService.parseTags(p.tags),
      }));
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyTrending = postsArray
        .filter((p) => !p.isHidden)
        .filter((p) => new Date(p.createdAt) >= oneWeekAgo)
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 5);
      setTrendingPosts(weeklyTrending);
    } catch {
      setTrendingPosts([]);
    }
  };

  const handleSearch = () => {
    if (allPosts.length === 0 && !searchQuery.trim()) return;
    if (!searchQuery.trim()) {
      if (activeTab === "all") setPosts(allPosts);
      else
        setPosts(
          allPosts.filter((p) => (p.tags || []).map((t) => String(t).toLowerCase()).includes(activeTab))
        );
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    let filtered = allPosts.filter((p) =>
      p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.author.fullname.toLowerCase().includes(q)
    );
    if (activeTab !== "all") {
      filtered = filtered.filter((p) => (p.tags || []).map((t) => String(t).toLowerCase()).includes(activeTab));
    }
    setPosts(filtered);
  };

  const getBadge = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    const map: Record<string, { text: string; bg: string; color: string }> = {
      thongbao: { text: "thảo luận", bg: "bg-blue-100", color: "text-blue-700" },
      gopy: { text: "góp ý", bg: "bg-orange-100", color: "text-orange-700" },
      tintuc: { text: "tin tức", bg: "bg-cyan-100", color: "text-cyan-700" },
      review: { text: "review", bg: "bg-purple-100", color: "text-purple-700" },
      chiase: { text: "download", bg: "bg-green-600", color: "text-white" },
      tuvan: { text: "tư vấn", bg: "bg-pink-100", color: "text-pink-700" },
    };
    const tag = (tags[0] || "").toLowerCase();
    return map[tag] || { text: tag, bg: "bg-gray-100", color: "text-gray-700" };
  };

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);

  return (
    <Page className="bg-gray-50">
      <Box className="bg-gradient-to-r from-teal-50 to-white border-b border-teal-200 shadow-sm">
        <Box className="max-w-7xl mx-auto px-4 py-4">
          <Box className="flex items-center justify-between gap-3 mb-4">
            <Text.Title className="text-teal-800" size="large">Community</Text.Title>
            <Box className="flex items-center gap-2 flex-1 max-w-2xl">
              <Box className="bg-white rounded-full border border-teal-100 px-3 py-2 flex items-center gap-2 flex-1">
                <Icon icon="zi-search" className="text-teal-600" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                />
              </Box>
              <Button onClick={() => navigate("/community/create")} size="small" type="highlight">
                Tạo bài viết
              </Button>
            </Box>
          </Box>
          <Box className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2 rounded-lg font-semibold ${
                activeTab === "all" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Tất cả
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm ${
                  activeTab === c.id ? "bg-teal-600 text-white" : c.color
                }`}
              >
                {c.name}
              </button>
            ))}
          </Box>
        </Box>
      </Box>

      <Box className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Box className="lg:col-span-2">
          {error && (
            <Box className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</Box>
          )}
          {loading && (
            <Box className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </Box>
          )}

          {!loading && posts.length === 0 && (
            <Box className="bg-white rounded-xl border border-teal-100 p-10 text-center">
              <Text>Không có bài viết nào</Text>
            </Box>
          )}

          {!loading && posts.length > 0 && (
            <Box className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {posts
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((post, index) => {
                  const badge = getBadge(post.tags);
                  const isLast = index === Math.min(pageSize, posts.length - (currentPage - 1) * pageSize) - 1;
                  return (
                    <Box
                      key={post.post_id}
                      onClick={() => navigate(`/community/detail/${post.post_id}`)}
                      className={`flex items-start gap-4 p-4 hover:bg-gray-50 cursor-pointer ${!isLast ? "border-b border-gray-200" : ""}`}
                    >
                      <img
                        src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`}
                        alt={post.author.fullname}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`;
                        }}
                      />
                      <Box className="flex-1 min-w-0">
                        <Box className="flex items-start gap-2 mb-1">
                          {badge && (
                            <span className={`${badge.bg} ${badge.color} text-xs px-2 py-0.5 rounded font-medium`}>{badge.text}</span>
                          )}
                          <h3 className="text-base font-semibold text-orange-600 hover:text-orange-700 break-words">
                            {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                          </h3>
                        </Box>
                        <Box className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{post.author.fullname}</span>
                          <span className="text-gray-400">·</span>
                          <span>{communicationService.formatDate(post.createdAt)}</span>
                        </Box>
                      </Box>
                      <Box className="flex flex-col items-end gap-2 text-sm text-gray-600 flex-shrink-0">
                        <Box className="flex items-center gap-4">
                          <Box className="text-right">
                            <div className="font-semibold text-gray-900">{formatCount(post.likeCount)}</div>
                            <div className="text-xs text-gray-500">Replies:</div>
                          </Box>
                          <Box className="text-right">
                            <div className="font-semibold text-gray-900">{formatCount(post.viewCount)}</div>
                            <div className="text-xs text-gray-500">Views:</div>
                          </Box>
                        </Box>
                        <div className="text-xs text-gray-500">{communicationService.formatTimeAgo(post.updatedAt)}</div>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          )}

          {!loading && posts.length > 0 && (
            <Box className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "text-gray-400 border-gray-200" : "text-teal-700 border-teal-200"}`}
              >
                Trước
              </button>
              {Array.from({ length: Math.max(1, Math.ceil(posts.length / pageSize)) }).map((_, i) => {
                const page = i + 1;
                const total = Math.ceil(posts.length / pageSize);
                if (page === 1 || page === total || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold border ${
                        page === currentPage ? "bg-teal-600 text-white border-teal-600" : "border-teal-200 text-teal-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(posts.length / pageSize), p + 1))}
                disabled={currentPage >= Math.ceil(posts.length / pageSize)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage >= Math.ceil(posts.length / pageSize)
                    ? "text-gray-400 border-gray-200"
                    : "text-teal-700 border-teal-200"
                }`}
              >
                Sau
              </button>
            </Box>
          )}
        </Box>

        <Box>
          <Box className="bg-white rounded-xl border border-teal-100 p-4 sticky top-4">
            <Text.Title size="small" className="text-gray-900 mb-3">Trending content</Text.Title>
            <Box className="space-y-3">
              {trendingPosts.length === 0 ? (
                <Text size="small" className="text-gray-500">Chưa có bài viết trending</Text>
              ) : (
                trendingPosts.map((post, idx) => (
                  <Box
                    key={post.post_id}
                    onClick={() => navigate(`/community/detail/${post.post_id}`)}
                    className="pb-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
                  >
                    <Box className="flex gap-2">
                      <span className="text-teal-600 font-bold text-lg">#{idx + 1}</span>
                      <Box className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                        </h4>
                        <Box className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            ❤️ {post.likeCount}
                          </span>
                          <span className="flex items-center gap-1">👁️ {post.viewCount}</span>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default CommunityPage;


