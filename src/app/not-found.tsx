"use client";

import Link from "next/link";
import { Heart, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Heart className="h-24 w-24 text-pink-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Страница не найдена
          </h2>
          <p className="text-gray-500 mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center w-full"
          >
            <Home className="h-5 w-5 mr-2" />
            На главную
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center w-full"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>Если проблема повторяется, обратитесь в поддержку</p>
        </div>
      </div>
    </div>
  );
}
