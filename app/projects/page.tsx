import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";

export const revalidate = 60;

export default async function ProjectsPage() {
  // 1. Öne çıkarmak istediğin projenin tam slug'ını buraya yaz (Dosya adın neyse o olmalı)
  // Dosya adın 'zikir-plus.mdx' olduğu için burası 'zikir-plus' olmalı.
  const featuredSlug = "zikir-plus"; 

  // 2. Tüm yayınlanmış projeleri al ve tarihe göre sırala (En yeni en üstte)
  const sortedProjects = allProjects
    // .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  // 3. Featured projeyi bulmaya çalış, bulamazsan listenin ilkini al (Hata vermesin diye)
  const featured = sortedProjects.find((project) => project.slug === featuredSlug) || sortedProjects[0];

  // 4. Geri kalan projeleri listele (Featured olanı listeden çıkar ki iki kere görünmesin)
  const otherProjects = sortedProjects.filter(
    (project) => project.slug !== featured?.slug
  );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projelerim
          </h2>
          <p className="mt-4 text-zinc-400">
            Geliştirmiş olduğum ve geliştirmekte olduğum bazı projelerimi burada görebilirsiniz.
          </p>
        </div>
        
        <div className="w-full h-px bg-zinc-800" />

        {/* 1. ÖNE ÇIKAN (FEATURED) PROJE ALANI */}
        {featured && (
           <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 lg:gap-16">
             <Card>
               {/* Views değerini şimdilik 0 geçiyoruz, Redis olmadığı için */}
               <Article project={featured} />
             </Card>
           </div>
        )}

        {/* Ara Çizgi (Eğer başka projeler varsa göster) */}
        {otherProjects.length > 0 && <div className="w-full h-px bg-zinc-800" />}

        {/* 2. DİĞER PROJELER LİSTESİ */}
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project) => (
            <Card key={project.slug}>
              <Article project={project} />
            </Card>
          ))}
        </div>
        
        {/* Hiç proje yoksa mesaj göster */}
        {sortedProjects.length === 0 && (
           <div className="text-center text-zinc-500 py-10">
             Henüz eklenmiş proje yok.
           </div>
        )}
      </div>
    </div>
  );
}