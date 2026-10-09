"use client";

import { use } from "react";
import { Footer } from "@/components/layout/Footer";

export default function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <>
      <main className="w-full bg-[#ffffff] pt-32 md:pt-48 pb-24 min-h-screen px-[4vw]">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-[clamp(48px,7vw,90px)] font-light leading-[1.1] text-[#1c1d20] mb-12 capitalize">
            {resolvedParams.slug}
          </h1>
          <div className="w-full h-[60vh] bg-[#e1e4e7] flex items-center justify-center text-[#999] rounded-md">
            TODO: /public/work/{resolvedParams.slug}.jpg
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
