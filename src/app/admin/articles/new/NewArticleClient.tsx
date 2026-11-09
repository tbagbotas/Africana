"use client";

import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticleClient() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ArticleForm />
      </div>
    </main>
  );
}