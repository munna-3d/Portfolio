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

export const vehicleCategories: VehicleCategory[] = [
  {
    slug: "sports-cars",
    title: "Cars",
    image: "https://cdna.artstation.com/p/assets/images/images/079/123/596/large/moon-3d-1.jpg?1724060469",
    description: "High-performance aerodynamic machines designed for speed and precision.",
    about: "This project showcases my expertise in luxury and performance automotive visualization. I focused on carbon fiber texturing, complex aerodynamic curves, and realistic light interaction with automotive paint.",
    software: ["Blender", "Substance Painter", "Photoshop", "Marmoset Toolbag"],
    deliverables: ["High-Poly Sub-D Mesh", "4K PBR Texture Set", "Studio Lighting Scene", "Realistic Car Paint Shader"],
    gallery: [
      "https://cdna.artstation.com/p/assets/images/images/079/123/596/large/moon-3d-1.jpg?1724060469",
      "https://cdna.artstation.com/p/assets/images/images/085/589/892/large/moon-3d-11.jpg?1741166370",
      "https://cdnb.artstation.com/p/assets/images/images/085/762/227/large/munna-moon3d-8.jpg?1741602746",
      "https://cdna.artstation.com/p/assets/images/images/085/956/970/large/munna-moon3d-gigi.jpg?1742047439"
    ]
  },
  {
    slug: "off-road",
    title: "Off-Road Vehicles",
    image: "https://cdna.artstation.com/p/assets/images/images/079/513/986/large/moon-3d-untitled.jpg?1725111867",
    description: "Rugged all-terrain monsters built to conquer the toughest landscapes.",
    about: "A deep dive into rugged machinery. I emphasized structural suspension details, mud and dirt layering in Substance Painter, and optimized geometry for game engine performance.",
    software: ["Blender", "Substance Painter", "Unreal Engine", "Photoshop"],
    deliverables: ["Game-Ready Low Poly Asset", "Dirty/Clean Texture Variants", "Rigged Chassis & Suspension", "UE Texture Layout"],
    gallery: [
      "https://cdna.artstation.com/p/assets/images/images/092/564/976/large/munna-moon3d-3.webp?1760006779",
      "https://cdna.artstation.com/p/assets/images/images/093/974/986/large/munna-moon3d-mghs-camera.webp?1764088659",
      "https://cdna.artstation.com/p/assets/images/images/079/513/986/large/moon-3d-untitled.jpg?1725111867",
      "https://cdna.artstation.com/p/assets/images/images/078/202/444/large/moon-3d-das.jpg?1721467828",
      "https://cdna.artstation.com/p/assets/images/images/096/999/482/large/munna-moon3d-7.webp?1772899155",
      "https://cdna.artstation.com/p/assets/images/images/095/299/652/large/munna-moon3d-1.webp?1768212279"
    ]
  },
  {
    slug: "sci-fi",
    title: "Sci-Fi Vehicles",
    image: "https://cdnb.artstation.com/p/assets/images/images/053/479/787/large/moon-3d-0044.jpg?1662318231",
    description: "Futuristic concepts and hovering scout ships from the year 3000.",
    about: "Experimental designs focusing on unconventional propulsion systems and paneling. I used heavy kitbashing techniques and custom trim sheets to achieve a high level of technical detail.",
    software: ["Maya", "ZBrush", "Substance Painter", "Unreal Engine"],
    deliverables: ["Detailed Hero Asset", "Custom Trim Sheet Layout", "Animated Thruster Effects", "Decal Atlas Profile"],
    gallery: [
      "https://cdnb.artstation.com/p/assets/images/images/053/479/787/large/moon-3d-0044.jpg?1662318231",
      "https://cdnb.artstation.com/p/assets/images/images/053/479/767/large/moon-3d-4k.jpg?1662318142",
      "https://cdna.artstation.com/p/assets/images/images/072/115/982/large/moon3d-design-untitl-ed.jpg?1706684742"
    ]
  },
  {
    slug: "trucks",
    title: "Trucks",
    image: "https://cdna.artstation.com/p/assets/images/images/076/657/602/large/moon-3d-3.jpg?1717491831",
    description: "Heavy-duty industrial haulers and futuristic cargo transports.",
    about: "Industrial design focused on scale and functionality. This project highlights my ability to handle large-scale mechanical assets and manage complex texel density requirements.",
    software: ["Blender", "Substance Painter", "Marmoset Toolbag"],
    deliverables: ["Industrial Grade Model", "Modular Trailer System", "Heavy Equipment Shaders", "LOD Optimization"],
    gallery: [
      "https://cdna.artstation.com/p/assets/images/images/076/657/602/large/moon-3d-3.jpg?1717491831",
      "https://cdnb.artstation.com/p/assets/images/images/092/654/513/large/munna-moon3d-screenshot-2025-10-12-212237.webp?1760284386",
      "https://cdnb.artstation.com/p/assets/images/images/063/334/191/large/moon-3d-untitled.jpg?1685302452"
    ]
  },
  {
    slug: "bikes",
    title: "Bikes",
    image: "/categories/bikes.png",
    description: "Sleek two-wheeled electric superbikes with neon aesthetics.",
    about: "Compact design and intricate mechanical exposure. I focused on making every bolt and wire feel functional while maintaining a futuristic, high-end electric bike silhouette.",
    software: ["Blender", "Substance Painter", "Photoshop"],
    deliverables: ["High-Fidelity Superbike", "Neon Glow Material Set", "High Poly Scans", "Promotional Renders"],
    gallery: [
      "/categories/bikes.png",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1484176810451-05500d99c4aa?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    slug: "concept",
    title: "Concept Vehicles",
    image: "https://cdna.artstation.com/p/assets/images/images/078/513/008/large/moon-3d-1sd.jpg?1722326754",
    description: "Groundbreaking unconventional designs exploring the future of mobility.",
    about: "A playground for blue-sky thinking. In this category, I pushed the boundaries of automotive form and material, exploring how light passes through hull sections and energy cores.",
    software: ["Blender", "ZBrush", "Photoshop", "Unreal Engine"],
    deliverables: ["Experimental Prototypes", "Concept Design Docs", "Advanced VDB Volumes", "Interactive AR Preview"],
    gallery: [
      "https://cdna.artstation.com/p/assets/images/images/078/513/008/large/moon-3d-1sd.jpg?1722326754",
      "https://cdnb.artstation.com/p/assets/images/images/086/903/219/large/munna-moon3d-1x1.jpg?1744361374",
      "https://cdna.artstation.com/p/assets/images/images/085/340/522/large/moon-3d-7.jpg?1740564945"
    ]
  }
];
