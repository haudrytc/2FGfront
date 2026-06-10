export interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  location: string;
  year: number | null;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  funFact: string;
  photo: string | null;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type Settings = Record<string, string>;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
