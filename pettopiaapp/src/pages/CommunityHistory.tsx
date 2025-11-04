import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";

type Post = {
  id: number;
  category: string;
  title: string;
  author: string;
  avatar: string;
  time: string;
  threads: string | number;
  messages: string | number;
  badge?: { text: string; color: string } | null;
  viewedAt?: string;
  favoritedAt?: string;
};

function CommunityHistoryPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>("favorites");
  const [favoritePosts] = useState<Post[]>([]);
  const [recentlyViewedPosts] = useState<Post[]>([]);

  const displayed = activeTab === 'favorites' ? favoritePosts : recentlyViewedPosts;

  return (
    <Page className="bg-gray-50">
      <Box className="bg-gradient-to-r from-teal-50 to-white border-b border-teal-200 shadow-sm">
        <Box className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-extrabold text-teal-800 mb-2">Lịch sử bài viết</h1>
          <p className="text-lg text-gray-600">Quản lý các bài viết yêu thích và đã xem gần đây</p>
        </Box>
      </Box>

      <Box className="max-w-7xl mx-auto px-4 py-6">
        <Box className="bg-white rounded-xl border border-teal-100 p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'favorites' ? 'bg-teal-600 text-white' : 'text-gray-600'}`}
          >
            Yêu thích ({favoritePosts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'history' ? 'bg-teal-600 text-white' : 'text-gray-600'}`}
          >
            Đã xem ({recentlyViewedPosts.length})
          </button>
        </Box>

        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayed.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-600">{activeTab === 'favorites' ? 'Bạn chưa có bài viết yêu thích nào' : 'Bạn chưa xem bài viết nào gần đây'}</p>
            </div>
          ) : (
            displayed.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-teal-100 p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex gap-4">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        {post.badge && (
                          <span className={`${post.badge.color} text-white text-xs px-2 py-1 rounded-full font-semibold mr-2 inline-block mb-1`}>
                            {post.badge.text}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                      <span>{post.author}</span>
                      <span>{post.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6 text-sm">
                        <div className="text-gray-600"><span className="font-semibold text-gray-900">{post.threads}</span> Threads</div>
                        <div className="text-gray-600"><span className="font-semibold text-gray-900">{post.messages}</span> Messages</div>
                      </div>
                      {activeTab === 'favorites' && post.favoritedAt && (
                        <div className="text-xs text-teal-600 font-medium">Lưu: {post.favoritedAt}</div>
                      )}
                      {activeTab === 'history' && post.viewedAt && (
                        <div className="text-xs text-teal-600 font-medium">Xem: {post.viewedAt}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </Box>
      </Box>
    </Page>
  );
}

export default CommunityHistoryPage;


