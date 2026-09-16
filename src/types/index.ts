import React from "react";

export interface SoftwareTool {
  name: string;
  icon: React.ReactNode;
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

