import { columnArticles, getColumn } from "@/content/columns";
import { columnOgImage } from "@/components/column/ColumnOgImage";
export const size={width:1200,height:630};
export const contentType="image/png";
export const alt="ホームページ制作・運用のお役立ちコラム｜まちのWeb";
export function generateStaticParams(){return columnArticles.map(({slug})=>({slug}));}
export default async function Image({params}:{params:Promise<{slug:string}>}) {
  const article=getColumn((await params).slug);
  if(!article)return new Response(null,{status:404});
  return columnOgImage(article.title,article.category);
}
