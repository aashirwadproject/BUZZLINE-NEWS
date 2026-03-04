export interface NewsData {
  headline: string;
  details: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  logoUrl?: string;
  logoText: string;
  date: string;
  detailsFontSize?: number;
  newsType: string;
  themeColor: string;
}

export const NewsSchema = {
  type: "object",
  properties: {
    headline: { type: "string", description: "A punchy, viral-style news headline" },
    details: { type: "string", description: "Detailed news content, summarized to fit one slide" },
  },
  required: ["headline", "details"],
};
