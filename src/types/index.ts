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
