import React from "react";

export interface SoftwareTool {
  name: string;
  icon: React.ReactNode;
}

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
        alt="Substance 3D Painter"
        className="w-10 h-10 object-contain"
      />
    ),
  },
  {
    name: "Substance Painter", // Alias for matching
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/substance-3d-painter-1.svg"
        alt="Substance Painter"
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
    name: "Premiere Pro",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg"
        alt="Premiere Pro"
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
    name: "Maya",
    icon: (
        <img 
            src="https://logosandtypes.com/wp-content/uploads/2025/03/maya.svg"
            alt="Maya"
            className="w-8 h-8 object-contain"
        />
    )
  },
  {
    name: "ZBrush",
    icon: (
        <img 
            src="https://www.svgrepo.com/show/508998/zbrush.svg" 
            alt="ZBrush"
            className="w-8 h-8 object-contain mix-blend-screen"
        />
    )
  }
];

export const getSoftwareByName = (name: string) => {
    return softwareTools.find(tool => tool.name.toLowerCase() === name.toLowerCase()) || {
        name: name,
        icon: <div className="w-5 h-5 bg-gray-600 rounded-full" />
    };
};
