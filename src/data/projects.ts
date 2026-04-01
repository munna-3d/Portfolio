import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "vehicle-art",
    title: "Vehicle Art",
    category: "Automotive Visualization",
    image: "/projects/vehicle_art_hero.png",
    description: "A high-fidelity automotive visualization featuring studio lighting, realistic materials, and dynamic environments.",
    about: "This project showcases advanced techniques in hard-surface modeling and PBR texturing to achieve photorealism. I focused on studio lighting, realistic materials, and creating a cohesive dynamic environment that highlights the vehicle's form.",
    tech: ["Blender", "Substance 3D Painter", "Photoshop"],
    deliverables: ["High-Poly Sub-D Mesh", "Studio Lighting Scene", "4K PBR Texture Set", "Realistic Paint Shaders"],
    gallery: [
      "/projects/vehicle_art_hero.png",
      "/projects/vehicle_art_detail_1.png",
      "/projects/vehicle_art_detail_2.png"
    ]
  },
  {
    slug: "hard-surface-asset",
    title: "Hard-Surface Asset",
    category: "Hard-Surface Modeling",
    image: "/projects/hard_surface_hero.png",
    description: "A game-ready prop asset created with a focus on functional realism and optimized geometry.",
    about: "This project showcases functional realism for game engines. I focused on optimized geometry, efficient UV packing, and high-fidelity PBR materials that provide a realistic look while maintaining performance. The focus was on mechanical complexity and material wear.",
    tech: ["Blender", "Maya", "Marmoset Toolbag", "Substance 3D Painter", "Photoshop"],
    deliverables: ["Game-Ready Low Poly Asset", "4K PBR Texture Set", "High-to-Low Poly Baking", "UE / Unity Package"],
    gallery: [
      "/projects/hard_surface_hero.png",
      "/projects/hard_surface_detail_1.png",
      "/projects/hard_surface_detail_2.png"
    ]
  },
  {
    slug: "environment-design",
    title: "Environment Design",
    category: "Game Asset Creation",
    image: "/projects/environment_design_hero.png",
    description: "Immersive futuristic environment design utilizing modular workflows and trim sheets.",
    about: "A study in modularity and atmospheric lighting. I utilized trim sheets and modular architecture kits to create a cohesive environment. The lighting was carefully crafted to enhance the sci-fi mood while showcasing the material qualities.",
    tech: ["Unreal Engine", "unity", "Blender", "Photoshop"],
    deliverables: ["Modular Environment Kit", "Custom Trim Sheets", "Atmospheric Lighting Setup", "Optimized Game Scene"],
    gallery: [
      "/projects/environment_design_hero.png",
      "/projects/environment_design_detail_1.png",
      "/projects/environment_design_detail_2.png"
    ]
  }
];
