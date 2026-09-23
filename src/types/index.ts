import React from "react";

export interface SoftwareTool {
  name: string;
  icon: React.ReactNode;
}

export interface SoftwareToolItem {
  id: string;
  name: string;
  icon: string;
  category?: string;
  invert?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  about: string;
  tech: string[];
  deliverables: string[];
  gallery: string[];
}

export interface VehicleCategory {
  slug: string;
  title: string;
  image: string;
  description: string;
  about: string;
  software: string[];
  deliverables: string[];
  gallery: string[];
}

export interface HeroContent {
  name: string;
  role: string;
  subtitle: string;
  section2Headline: string;
  section2Sub: string;
  section3Headline: string;
  section3Sub: string;
  heroImage?: string;
}

export interface ProfileContent {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  socials: { name: string; url: string }[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  type: string;
  date: string;
  color?: string;
  description: string[];
}

export interface ProductionItem {
  id: string;
  title: string;
  type: string;
  year: string;
  role: string;
  company: string;
  image: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied" | "archived";
  ip?: string;
}


