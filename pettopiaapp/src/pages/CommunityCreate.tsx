import React, { useMemo, useState } from "react";
import { Page, Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (window.APP_CONFIG?.apiBaseUrl as string) || (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api/v1";

type CreatePostInput = {
  user_id?: string;
  title: string;
  content: string;
  tags: string[];
  imageFiles: File[];
};

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
  async createPost(input: CreatePostInput) {
    const form = new FormData();
    form.append("title", input.title);
    form.append("content", input.content);
    input.tags.forEach((t) => form.append("tags[]", t));
    if (input.user_id) form.append("user_id", input.user_id);
    input.imageFiles.forEach((f) => form.append("images", f));
    const res = await fetch(`${this.baseUrl}/post`, {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
      body: form,
    });
    return this.handleResponse<any>(res);
  }
}

const communicationService = new CommunicationService();

function CommunityCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ category?: string; title?: string; content?: string }>({});

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const list = Array.from(files);
    const previews = list.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...list]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e: { category?: string; title?: string; content?: string } = {};
    if (!selectedCategory) e.category = "Vui lòng chọn một danh mục";
    const t = title.trim();
    if (!t) e.title = "Vui lòng nhập tiêu đề bài viết";
    else if (t.length < 10) e.title = "Tiêu đề phải có ít nhất 10 ký tự";
    else if (t.length > 200) e.title = "Tiêu đề không được vượt quá 200 ký tự";
    const c = content.trim();
    if (!c) e.content = "Vui lòng nhập nội dung bài viết";
    else if (c.length < 20) e.content = "Nội dung phải có ít nhất 20 ký tự";
    else if (c.length > 10000) e.content = "Nội dung không được vượt quá 10,000 ký tự";
    return e;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      setSubmitting(true);
      setErrors({});
      if (token) communicationService.setToken(token);
      await communicationService.createPost({
        user_id: currentUserId || undefined,
        title: title.trim(),
        content: content.trim(),
        tags: [selectedCategory],
        imageFiles,
      });
      alert("Đăng bài thành công");
      navigate("/community");
    } catch (e: any) {
      alert(e?.message || "Không thể tạo bài viết. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="bg-gray-50">
      <Box className="bg-gradient-to-r from-teal-50 to-white border-b border-teal-200 shadow-sm">
        <Box className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Box onClick={() => navigate(-1)} className="cursor-pointer">
            <Icon icon="zi-arrow-left" className="text-teal-600" />
          </Box>
          <Text.Title className="text-teal-800" size="large">Tạo bài viết mới</Text.Title>
        </Box>
      </Box>

      <Box className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {Object.keys(errors).length > 0 && (
          <Box className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <Text className="text-red-700">Vui lòng kiểm tra lại thông tin</Text>
          </Box>
        )}

        <Box className={`bg-white rounded-xl border p-5 ${errors.category ? "border-red-300 ring-2 ring-red-200" : "border-teal-100"}`}>
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Chọn danh mục *</Text>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(c.id);
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`p-3 rounded-lg ${selectedCategory === c.id ? "bg-teal-600 text-white" : c.color}`}
              >
                <span className="font-semibold text-sm">{c.name}</span>
              </button>
            ))}
          </Box>
        </Box>

        <Box className={`bg-white rounded-xl border p-5 ${errors.title ? "border-red-300 ring-2 ring-red-200" : "border-teal-100"}`}>
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Tiêu đề *</Text>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Nhập tiêu đề bài viết..."
            className={`w-full px-4 py-3 border rounded-lg outline-none ${errors.title ? "border-red-300" : "border-gray-200"}`}
          />
          <div className="mt-2 text-sm text-gray-500">{title.length}/200 ký tự</div>
        </Box>

        <Box className={`bg-white rounded-xl border p-5 ${errors.content ? "border-red-300 ring-2 ring-red-200" : "border-teal-100"}`}>
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Nội dung *</Text>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, content: undefined }));
            }}
            placeholder="Viết nội dung bài viết của bạn..."
            rows={10}
            className={`w-full px-4 py-3 border rounded-lg outline-none resize-none ${errors.content ? "border-red-300" : "border-gray-200"}`}
          />
          <div className="mt-2 text-sm text-gray-500">{content.length}/10,000 ký tự</div>
        </Box>

        <Box className="bg-white rounded-xl border border-teal-100 p-5">
          <Text className="block text-sm font-semibold text-gray-900 mb-3">Hình ảnh</Text>
          <Box className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Text className="text-gray-600">Click để tải lên hình ảnh</Text>
            </label>
          </Box>
          {imagePreviews.length > 0 && (
            <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((src, i) => (
                <Box key={i} className="relative group">
                  <img src={src} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className="flex gap-3 justify-end">
          <Button onClick={() => navigate(-1)} type="neutral">Hủy</Button>
          <Button disabled={submitting} onClick={handleSubmit} type="highlight">
            {submitting ? "Đang đăng..." : "Đăng bài"}
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default CommunityCreatePage;


