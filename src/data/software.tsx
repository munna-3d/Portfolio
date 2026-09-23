import React from "react";
import { SoftwareTool, SoftwareToolItem } from "@/types";

export const defaultSoftwareTools: SoftwareToolItem[] = [
  {
    id: "tool-1",
    name: "Blender",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
    category: "3D Modeling & Animation",
    invert: false,
  },
  {
    id: "tool-2",
    name: "Substance 3D Painter",
    icon: "https://cdn.worldvectorlogo.com/logos/substance-3d-painter-1.svg",
    category: "Texturing & Shading",
    invert: false,
  },
  {
    id: "tool-3",
    name: "Marmoset Toolbag",
    icon: "https://i.gyazo.com/83dced8f7fe0b22c1e3ff304f8bec747.png",
    category: "LookDev & Baking",
    invert: false,
  },
  {
    id: "tool-4",
    name: "Photoshop",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
    category: "Post-Processing & Textures",
    invert: false,
  },
  {
    id: "tool-5",
    name: "Unity",
    icon: "https://cdn.worldvectorlogo.com/logos/unity-69.svg",
    category: "Real-Time Engine",
    invert: true,
  },
  {
    id: "tool-6",
    name: "Unreal Engine",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/20/UE_Logo_Black_Centered.svg",
    category: "Real-Time Engine",
    invert: true,
  },
  {
    id: "tool-7",
    name: "Maya",
    icon: "https://logosandtypes.com/wp-content/uploads/2025/03/maya.svg",
    category: "3D Modeling & Rigging",
    invert: false,
  },
  {
    id: "tool-8",
    name: "ZBrush",
    icon: "https://www.svgrepo.com/show/508998/zbrush.svg",
    category: "Digital Sculpting",
    invert: true,
  },
  {
    id: "tool-9",
    name: "3ds Max",
    icon: "https://cdn.worldvectorlogo.com/logos/autodesk-3ds-max.svg",
    category: "Hard-Surface Modeling",
    invert: false,
  },
];

export const softwareTools: SoftwareTool[] = [
  {
    name: "Blender",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg"
        alt="Blender"
        className="w-5 h-5 object-contain"
      />
    ),
  },
  {
    name: "Substance 3D Painter",
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/substance-3d-painter-1.svg"
        alt="Substance Painter"
        className="w-10 h-10 object-contain"
      />
    ),
  },
  {
    name: "Marmoset Toolbag",
    icon: (
      <img
        src="https://i.gyazo.com/83dced8f7fe0b22c1e3ff304f8bec747.png"
        alt="Marmoset Toolbag"
        className="w-10 h-10 object-contain"
      />
    ),
  },
  {
    name: "Photoshop",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg"
        alt="Photoshop"
        className="w-10 h-10 object-contain"
      />
    ),
  },
  {
    name: "Unity",
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/unity-69.svg"
        alt="Unity"
        className="w-10 h-10 object-contain invert"
      />
    ),
  },
  {
    name: "Unreal Engine",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/20/UE_Logo_Black_Centered.svg"
        alt="Unreal Engine"
        className="w-10 h-10 object-contain invert"
      />
    ),
  },
  {
    name: "Maya",
    icon: (
      <img
        src="https://logosandtypes.com/wp-content/uploads/2025/03/maya.svg"
        alt="Maya"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    name: "ZBrush",
    icon: (
      <img
        src="https://www.svgrepo.com/show/508998/zbrush.svg"
        alt="ZBrush"
        className="w-7 h-7 object-contain mix-blend-screen invert"
      />
    ),
  },
  {
    name: "3ds Max",
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/autodesk-3ds-max.svg"
        alt="3ds Max"
        className="w-7 h-7 object-contain"
      />
    ),
  },
];

export const getSoftwareByName = (name: string, dynamicTools?: SoftwareToolItem[]) => {
  if (!name) return { name: "", icon: <div className="w-5 h-5 bg-gray-600 rounded-full" /> };
  
  const cleanName = name.trim().toLowerCase();

  // Check dynamic tools first if provided
  if (dynamicTools && dynamicTools.length > 0) {
    const dynamicMatch = dynamicTools.find((t) => t.name.toLowerCase() === cleanName);
    if (dynamicMatch) {
      return {
        name: dynamicMatch.name,
        icon: (
          <img
            src={dynamicMatch.icon}
            alt={dynamicMatch.name}
            className={`w-5 h-5 object-contain ${dynamicMatch.invert ? "invert" : ""}`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ),
      };
    }
  }
  
  // Exact or alias matching against built-in tools
  const found = softwareTools.find((tool) => {
    const toolName = tool.name.toLowerCase();
    if (toolName === cleanName) return true;
    if (cleanName.includes("substance") && toolName.includes("substance")) return true;
    if (cleanName.includes("unreal") && toolName.includes("unreal")) return true;
    if (cleanName.includes("unity") && toolName.includes("unity")) return true;
    if (cleanName.includes("max") && toolName.includes("max")) return true;
    if (cleanName.includes("maya") && toolName.includes("maya")) return true;
    if (cleanName.includes("blender") && toolName.includes("blender")) return true;
    if (cleanName.includes("marmoset") && toolName.includes("marmoset")) return true;
    if (cleanName.includes("photoshop") && toolName.includes("photoshop")) return true;
    if (cleanName.includes("zbrush") && toolName.includes("zbrush")) return true;
    return false;
  });

  return (
    found || {
      name: name,
      icon: (
        <div className="w-5 h-5 bg-pink-500/20 border border-pink-500/40 rounded-full flex items-center justify-center text-[10px] font-bold text-pink-400">
          {name.charAt(0).toUpperCase()}
        </div>
      ),
    }
  );
};
