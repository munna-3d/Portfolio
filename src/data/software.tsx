import React from "react";
import { SoftwareTool } from "@/types";

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
  /*{
    name: "Premiere Pro",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg"
        alt="Premiere Pro"
        className="w-10 h-10 object-contain"
      />
    ),
  },*/
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

export const getSoftwareByName = (name: string) => {
  if (!name) return { name: "", icon: <div className="w-5 h-5 bg-gray-600 rounded-full" /> };
  
  const cleanName = name.trim().toLowerCase();
  
  // Exact or alias matching
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
      icon: <div className="w-5 h-5 bg-pink-500/20 border border-pink-500/40 rounded-full flex items-center justify-center text-[10px] font-bold text-pink-400">{name.charAt(0).toUpperCase()}</div>,
    }
  );
};
