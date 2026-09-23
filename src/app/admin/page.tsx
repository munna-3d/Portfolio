"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  fetchContent,
  updateHero,
  updateProfile,
  saveProject,
  deleteProject,
  saveVehicleCategory,
  deleteVehicleCategory,
  uploadImage,
  formatImageUrl,
  BACKEND_URL,
  PortfolioData,
  MediaItem,
  AdminUser,
  loginAdmin,
  verifyAuth,
  changeAdminPassword,
  clearStoredToken,
  fetchMediaList,
  deleteMediaFile,
  saveProduction,
  deleteProduction,
  reorderVehicleCategories,
  saveExperience,
  deleteExperience,
  saveSoftwareTool,
  deleteSoftwareTool,
  reorderSoftwareTools,
  fetchEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "@/lib/api";
import {
  Project,
  VehicleCategory,
  ProductionItem,
  ExperienceItem,
  SoftwareToolItem,
  EnquiryItem,
} from "@/types";
import {
  Upload,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  Car,
  Briefcase,
  Clapperboard,
  ArrowLeft,
  Check,
  Lock,
  LogOut,
  Image as ImageIcon,
  Copy,
  Search,
  X,
  KeyRound,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  GripVertical,
  ArrowUpDown,
  Cpu,
  Mail,
  MessageSquare,
  Inbox,
  Eye,
  Archive,
  Phone,
  User,
  Clock,
  CheckCheck,
} from "lucide-react";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
};

const formatBytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const COMMON_3D_TOOLS = [
  "Blender",
  "Substance 3D Painter",
  "ZBrush",
  "Autodesk Maya",
  "3ds Max",
  "Unreal Engine 5",
  "Unity",
  "Marmoset Toolbag",
  "Adobe Photoshop",
  "Marvelous Designer",
];

export default function AdminDashboard() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Change Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: "idle" | "success" | "error";
    msg: string;
  }>({ type: "idle", msg: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // CMS Content State
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "hero" | "projects" | "vehicles" | "productions" | "experiences" | "software" | "media" | "enquiries" | "profile"
  >("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  // Client Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isEnquiriesLoading, setIsEnquiriesLoading] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState<"all" | "unread" | "read" | "replied" | "archived">("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Selected items for editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(
    null
  );
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [editingProduction, setEditingProduction] =
    useState<ProductionItem | null>(null);
  const [isNewProduction, setIsNewProduction] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceItem | null>(null);
  const [isNewExperience, setIsNewExperience] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<SoftwareToolItem | null>(null);
  const [isNewSoftware, setIsNewSoftware] = useState(false);

  // Input states for project/category list management
  const [newTechInput, setNewTechInput] = useState("");
  const [newDeliverableInput, setNewDeliverableInput] = useState("");
  const [newCategorySoftwareInput, setNewCategorySoftwareInput] = useState("");
  const [newCategoryDeliverableInput, setNewCategoryDeliverableInput] = useState("");
  const [newExpDescInput, setNewExpDescInput] = useState("");

  // Media Library State
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Media Picker Modal State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    ((url: string) => void) | null
  >(null);
  const [mediaPickerSearch, setMediaPickerSearch] = useState("");

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<((url: string) => void) | null>(
    null
  );

  // Check auth on mount
  useEffect(() => {
    let isMounted = true;
    verifyAuth().then((user) => {
      if (isMounted) {
        setCurrentUser(user);
        setAuthChecking(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Content & Media
  const loadMedia = useCallback(async () => {
    setIsMediaLoading(true);
    try {
      const list = await fetchMediaList();
      setMediaList(list);
    } catch {
      // ignore
    } finally {
      setIsMediaLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const healthRes = await fetch(`${BACKEND_URL}/api/health`).catch(() => null);
      if (healthRes && healthRes.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }

      const res = await fetchContent();
      setData(res);
      if (res.projects?.length > 0 && !editingProject) {
        setEditingProject(res.projects[0]);
      }
      if (res.vehicleCategories?.length > 0 && !editingCategory) {
        setEditingCategory(res.vehicleCategories[0]);
      }
      if (res.productions?.length > 0 && !editingProduction) {
        setEditingProduction(res.productions[0]);
      }
      if (res.softwareTools?.length > 0 && !editingSoftware) {
        setEditingSoftware(res.softwareTools[0]);
      }
    } catch {
      setBackendStatus("offline");
    }
  }, [editingProject, editingCategory, editingProduction, editingSoftware]);

  const loadEnquiries = useCallback(async () => {
    setIsEnquiriesLoading(true);
    try {
      const list = await fetchEnquiries();
      setEnquiries(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setIsEnquiriesLoading(false);
    }
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "unread" | "read" | "replied" | "archived"
  ) => {
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to update enquiry status");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleDeleteEnquiryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete enquiry");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
      loadMedia();
      loadEnquiries();
    }
  }, [currentUser, loadData, loadMedia, loadEnquiries]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await loginAdmin(loginUsername.trim(), loginPassword.trim());
      setCurrentUser(res.user);
      setLoginPassword("");
    } catch (err) {
      setLoginError(getErrorMessage(err) || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPasswordChangeStatus({
        type: "error",
        msg: "New password must be at least 6 characters long",
      });
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordChangeStatus({
        type: "error",
        msg: "New passwords do not match",
      });
      return;
    }

    setIsChangingPassword(true);
    setPasswordChangeStatus({ type: "idle", msg: "" });
    try {
      await changeAdminPassword(currentPass, newPass);
      setPasswordChangeStatus({
        type: "success",
        msg: "Password changed successfully!",
      });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordChangeStatus({ type: "idle", msg: "" });
      }, 1500);
    } catch (err) {
      setPasswordChangeStatus({
        type: "error",
        msg: getErrorMessage(err) || "Failed to update password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Upload Trigger Helper
  const triggerUpload = (targetSetter: (url: string) => void) => {
    setUploadTarget(() => targetSetter);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Media Picker Open Helper
  const openMediaPicker = (targetSetter: (url: string) => void) => {
    setMediaPickerTarget(() => targetSetter);
    setIsMediaPickerOpen(true);
    setMediaPickerSearch("");
    loadMedia();
  };

  const handleSelectFromMediaPicker = (url: string) => {
    if (mediaPickerTarget) {
      mediaPickerTarget(url);
    }
    setIsMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  // Direct File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const url = await uploadImage(file);
      if (uploadTarget) {
        uploadTarget(url);
      }
      await loadMedia();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Upload failed");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Media File
  const handleDeleteMedia = async (filename: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}"?`)) {
      return;
    }
    try {
      await deleteMediaFile(filename);
      await loadMedia();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete file");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Save Hero Data
  const handleSaveHero = async () => {
    if (!data?.hero) return;
    setIsSaving(true);
    try {
      await updateHero(data.hero);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save Hero section");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Profile Data
  const handleSaveProfile = async () => {
    if (!data?.profile) return;
    setIsSaving(true);
    try {
      await updateProfile(data.profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save Profile");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Current Project
  const handleSaveCurrentProject = async () => {
    if (!editingProject) return;
    setIsSaving(true);
    try {
      await saveProject(editingProject, isNewProject);
      setIsNewProject(false);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save project");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;
    setIsSaving(true);
    try {
      await deleteProject(slug);
      setEditingProject(null);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete project");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Vehicle Category
  const handleSaveCurrentCategory = async () => {
    if (!editingCategory) return;
    setIsSaving(true);
    try {
      await saveVehicleCategory(editingCategory, isNewCategory);
      setIsNewCategory(false);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save vehicle category");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Vehicle Category
  const handleDeleteCategory = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete category "${slug}"?`)) return;
    setIsSaving(true);
    try {
      await deleteVehicleCategory(slug);
      setEditingCategory(null);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete category");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder Vehicle Categories
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);

  const handleReorderVehicleCategories = async (newCategories: VehicleCategory[]) => {
    if (!data) return;
    setData({ ...data, vehicleCategories: newCategories });
    setIsSaving(true);
    try {
      await reorderVehicleCategories(newCategories);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save category order");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveCategory = (index: number, direction: "up" | "down" | "top" | "bottom") => {
    if (!data?.vehicleCategories) return;
    const list = [...data.vehicleCategories];
    const item = list[index];
    if (!item) return;

    if (direction === "up" && index > 0) {
      list.splice(index, 1);
      list.splice(index - 1, 0, item);
    } else if (direction === "down" && index < list.length - 1) {
      list.splice(index, 1);
      list.splice(index + 1, 0, item);
    } else if (direction === "top" && index > 0) {
      list.splice(index, 1);
      list.unshift(item);
    } else if (direction === "bottom" && index < list.length - 1) {
      list.splice(index, 1);
      list.push(item);
    } else {
      return;
    }

    handleReorderVehicleCategories(list);
  };

  const handleDragStart = (index: number) => {
    setDraggedCategoryIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (
      draggedCategoryIndex === null ||
      draggedCategoryIndex === targetIndex ||
      !data?.vehicleCategories
    ) {
      setDraggedCategoryIndex(null);
      return;
    }
    const list = [...data.vehicleCategories];
    const [dragged] = list.splice(draggedCategoryIndex, 1);
    list.splice(targetIndex, 0, dragged);
    setDraggedCategoryIndex(null);
    handleReorderVehicleCategories(list);
  };

  // Save Production Credit
  const handleSaveProduction = async () => {
    if (!editingProduction) return;
    setIsSaving(true);
    try {
      await saveProduction(editingProduction, isNewProduction);
      setIsNewProduction(false);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save production credit");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Production Credit
  const handleDeleteProduction = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this production credit?")) return;
    setIsSaving(true);
    try {
      await deleteProduction(id);
      setEditingProduction(null);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete production credit");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Experience Item
  const handleSaveCurrentExperience = async () => {
    if (!editingExperience) return;
    setIsSaving(true);
    try {
      await saveExperience(editingExperience, isNewExperience);
      setIsNewExperience(false);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save experience");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Experience Item
  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this experience entry?")) return;
    setIsSaving(true);
    try {
      await deleteExperience(id);
      setEditingExperience(null);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete experience");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Software Tool
  const handleSaveCurrentSoftware = async () => {
    if (!editingSoftware) return;
    if (!editingSoftware.name.trim()) {
      setErrorMessage("Software tool name is required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setIsSaving(true);
    try {
      await saveSoftwareTool(editingSoftware, isNewSoftware);
      setIsNewSoftware(false);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to save software tool");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Software Tool
  const handleDeleteSoftware = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this software tool?")) return;
    setIsSaving(true);
    try {
      await deleteSoftwareTool(id);
      setEditingSoftware(null);
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to delete software tool");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder Software Tools
  const handleMoveSoftware = async (index: number, direction: "up" | "down") => {
    if (!data?.softwareTools) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.softwareTools.length) return;

    const list = [...data.softwareTools];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    setData({ ...data, softwareTools: list });

    try {
      await reorderSoftwareTools(list);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err) || "Failed to reorder tools");
      setTimeout(() => setErrorMessage(""), 3000);
      await loadData();
    }
  };

  // Create new Software Tool
  const handleCreateNewSoftware = () => {
    const newTool: SoftwareToolItem = {
      id: `tool-${Date.now()}`,
      name: "",
      icon: "",
      category: "3D Modeling",
      invert: false,
    };
    setEditingSoftware(newTool);
    setIsNewSoftware(true);
  };

  // Filtered Media
  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const filteredPickerMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(mediaPickerSearch.toLowerCase())
  );

  // ---------------- RENDER 1: LOADING SPINNER ----------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
            Authenticating Admin Portal...
          </p>
        </div>
      </div>
    );
  }

  // ---------------- RENDER 2: LOGIN SCREEN ----------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Background glow ornaments */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#141414]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 mb-4 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Admin Access
            </h1>
            <p className="text-gray-400 text-xs mt-2">
              Sign in to manage Munna Ahmed&apos;s 3D Portfolio
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin or email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(236,72,153,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authenticate & Enter"
              )}
            </button>
          </form>

          {/* Default Credentials Hint */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Default access: <code className="text-pink-400">admin</code> /{" "}
              <code className="text-pink-400">admin123</code>
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Portfolio Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- RENDER 3: AUTHENTICATED DASHBOARD ----------------
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans flex flex-col">
      {/* Hidden File Input for Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Portfolio</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Portfolio Backend CMS
          </h1>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === "online"
                  ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-gray-300">
              {backendStatus === "online"
                ? "Backend Connected"
                : "Offline Fallback"}
            </span>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="font-semibold">{currentUser.username}</span>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
            title="Change Admin Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Password</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/20 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Global Alerts Banner */}
      <div className="px-6 pt-4 max-w-7xl w-full mx-auto">
        {saveSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl animate-fade-in mb-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Action completed successfully! Saved to backend database.</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-2xl mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("hero")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "hero"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Hero & Bio Content
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "projects"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Portfolio Products
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "vehicles"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Car className="w-4 h-4" />
            Vehicle Art Categories
          </button>

          <button
            onClick={() => setActiveTab("productions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "productions"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            Production Credits
            {data?.productions && data.productions.length > 0 && (
              <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {data.productions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("experiences")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "experiences"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Experience Timeline
            {data?.experiences && data.experiences.length > 0 && (
              <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {data.experiences.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("software")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "software"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Software Arsenal
            {data?.softwareTools && data.softwareTools.length > 0 && (
              <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {data.softwareTools.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("media");
              loadMedia();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "media"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Media Library
            {mediaList.length > 0 && (
              <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {mediaList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("enquiries");
              loadEnquiries();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "enquiries"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mail className="w-4 h-4" />
            Client Inbox
            {enquiries.filter((e) => e.status === "unread").length > 0 ? (
              <span className="ml-auto text-[10px] font-bold bg-pink-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.6)]">
                {enquiries.filter((e) => e.status === "unread").length} NEW
              </span>
            ) : enquiries.length > 0 ? (
              <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                {enquiries.length}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
              activeTab === "profile"
                ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Contact & Social Info
          </button>

          <div className="pt-6 border-t border-white/10 mt-6">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              💡 Changes saved here sync directly with live project pages.
              Assets uploaded are served from{" "}
              <code className="text-pink-400 font-mono">backend/uploads/</code>.
            </p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl min-w-0">
          {/* TAB 1: HERO & BIO */}
          {activeTab === "hero" && data && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Hero Page & Headline Settings</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Customize titles, rotating headlines, and hero assets shown on the homepage.
                  </p>
                </div>
                <button
                  onClick={handleSaveHero}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Hero Name
                  </label>
                  <input
                    type="text"
                    value={data.hero?.name || ""}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, name: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={data.hero?.role || ""}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, role: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Subtitle Tagline
                  </label>
                  <input
                    type="text"
                    value={data.hero?.subtitle || ""}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Section 2 Headline
                  </label>
                  <input
                    type="text"
                    value={data.hero?.section2Headline || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: { ...data.hero, section2Headline: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Section 2 Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero?.section2Sub || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: { ...data.hero, section2Sub: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Section 3 Headline
                  </label>
                  <input
                    type="text"
                    value={data.hero?.section3Headline || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: { ...data.hero, section3Headline: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Section 3 Subtext
                  </label>
                  <input
                    type="text"
                    value={data.hero?.section3Sub || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: { ...data.hero, section3Sub: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 text-sm"
                  />
                </div>

                {/* Hero Background Image Upload & Media Picker */}
                <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                    Hero Preview / Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      placeholder="Image URL or upload file..."
                      value={data.hero?.heroImage || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, heroImage: e.target.value },
                        })
                      }
                      className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        triggerUpload((url) =>
                          setData((prev) =>
                            prev ? { ...prev, hero: { ...prev.hero, heroImage: url } } : null
                          )
                        )
                      }
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) =>
                          setData((prev) =>
                            prev ? { ...prev, hero: { ...prev.hero, heroImage: url } } : null
                          )
                        )
                      }
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Media Library
                    </button>
                  </div>
                  {data.hero?.heroImage && (
                    <div className="mt-4 w-36 h-24 rounded-lg overflow-hidden border border-white/10 bg-black">
                      <img
                        src={formatImageUrl(data.hero.heroImage)}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO PRODUCTS */}
          {activeTab === "projects" && data && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Portfolio Products & Projects</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage 3D assets, descriptions, tech stacks, deliverables, and gallery visuals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const freshProject: Project = {
                      slug: `project-${Date.now()}`,
                      title: "New 3D Project",
                      category: "Game Asset Creation",
                      image: "/projects/hard_surface_hero.png",
                      description: "New project description.",
                      about: "Detailed background about the production process.",
                      tech: ["Blender", "Substance 3D Painter"],
                      deliverables: ["High-Poly Sub-D Mesh", "4K PBR Texture Set"],
                      gallery: [],
                    };
                    setEditingProject(freshProject);
                    setIsNewProject(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              {/* Project Selector List */}
              <div className="flex flex-wrap gap-2">
                {data.projects.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => {
                      setEditingProject(p);
                      setIsNewProject(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      editingProject?.slug === p.slug
                        ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              {/* Editing Project Form */}
              {editingProject && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editingProject.slug}
                        disabled={!isNewProject}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, slug: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Cover Image
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingProject.image}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, image: e.target.value })
                          }
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                        />
                        <button
                          type="button"
                          title="Upload image"
                          onClick={() =>
                            triggerUpload((url) =>
                              setEditingProject((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Choose from Media Library"
                          onClick={() =>
                            openMediaPicker((url) =>
                              setEditingProject((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="px-3 py-2 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white rounded-xl text-xs font-bold"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                      </div>
                      {editingProject.image && (
                        <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-black">
                          <img
                            src={formatImageUrl(editingProject.image)}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.description}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, description: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        About Project (Detailed Breakdown)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.about}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, about: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    {/* Software / Tech Stack Editor */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                        Software & Tools Used
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editingProject.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingProject.tech.filter((_, i) => i !== idx);
                                setEditingProject({ ...editingProject, tech: updated });
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add new tech input */}
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add tool (e.g. Unreal Engine 5)..."
                          value={newTechInput}
                          onChange={(e) => setNewTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newTechInput.trim()) {
                                setEditingProject({
                                  ...editingProject,
                                  tech: [...editingProject.tech, newTechInput.trim()],
                                });
                                setNewTechInput("");
                              }
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newTechInput.trim()) {
                              setEditingProject({
                                ...editingProject,
                                tech: [...editingProject.tech, newTechInput.trim()],
                              });
                              setNewTechInput("");
                            }
                          }}
                          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {/* Quick suggestions */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                        <span>Quick add:</span>
                        {COMMON_3D_TOOLS.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => {
                              if (!editingProject.tech.includes(tool)) {
                                setEditingProject({
                                  ...editingProject,
                                  tech: [...editingProject.tech, tool],
                                });
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-gray-400 transition-colors"
                          >
                            + {tool}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Production Deliverables Editor */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                        Production Deliverables
                      </label>
                      <div className="space-y-2 mb-4">
                        {editingProject.deliverables.map((deliv, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                              <span>{deliv}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingProject.deliverables.filter(
                                  (_, i) => i !== idx
                                );
                                setEditingProject({ ...editingProject, deliverables: updated });
                              }}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new deliverable input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add deliverable (e.g. 4K PBR Texture Set, LOD 0-3 Meshes)..."
                          value={newDeliverableInput}
                          onChange={(e) => setNewDeliverableInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newDeliverableInput.trim()) {
                                setEditingProject({
                                  ...editingProject,
                                  deliverables: [
                                    ...editingProject.deliverables,
                                    newDeliverableInput.trim(),
                                  ],
                                });
                                setNewDeliverableInput("");
                              }
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDeliverableInput.trim()) {
                              setEditingProject({
                                ...editingProject,
                                deliverables: [
                                  ...editingProject.deliverables,
                                  newDeliverableInput.trim(),
                                ],
                              });
                              setNewDeliverableInput("");
                            }
                          }}
                          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Gallery Images List with Upload and Media Library Picker */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Gallery Visuals ({editingProject.gallery.length})
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              triggerUpload((url) =>
                                setEditingProject((prev) =>
                                  prev
                                    ? { ...prev, gallery: [...prev.gallery, url] }
                                    : null
                                )
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload New
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openMediaPicker((url) =>
                                setEditingProject((prev) =>
                                  prev
                                    ? { ...prev, gallery: [...prev.gallery, url] }
                                    : null
                                )
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Select from Media Library
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {editingProject.gallery.map((img, i) => (
                          <div
                            key={i}
                            className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-black"
                          >
                            <img
                              src={formatImageUrl(img)}
                              alt="Gallery preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = editingProject.gallery.filter(
                                  (_, idx) => idx !== i
                                );
                                setEditingProject({ ...editingProject, gallery: newGallery });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    {!isNewProject && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(editingProject.slug)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Project
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleSaveCurrentProject}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : isNewProject ? "Create Project" : "Save Project"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VEHICLE ART CATEGORIES */}
          {activeTab === "vehicles" && data && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Vehicle Art Categories</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage vehicle gallery categories (Sports Cars, Off-Road, Sci-Fi, Concept, etc.)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const freshCategory: VehicleCategory = {
                      slug: `category-${Date.now()}`,
                      title: "New Category",
                      image: "/projects/vehicle_art_hero.png",
                      description: "Category description",
                      about: "Detailed breakdown of the vehicle designs in this category.",
                      software: ["Blender", "Substance Painter"],
                      deliverables: ["High-Poly Sub-D Mesh", "4K PBR Texture Set"],
                      gallery: [],
                    };
                    setEditingCategory(freshCategory);
                    setIsNewCategory(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Catalog Sequence & Order Manager (Swipe / Move / Reorder) */}
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Catalog Sequence & Ordering
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Live Auto-Sync
                        </span>
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Arrange display order on the Vehicle Art gallery. Drag cards or use Top, Bottom, Up, and Down buttons.
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                    💡 Example: Click <strong className="text-pink-300 font-mono">Top (⏫)</strong> to put Off-Road on top, or <strong className="text-pink-300 font-mono">Bottom (⏬)</strong> for Sports Cars
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.vehicleCategories.map((cat, idx) => {
                    const isSelected = editingCategory?.slug === cat.slug;
                    const isFirst = idx === 0;
                    const isLast = idx === data.vehicleCategories.length - 1;

                    return (
                      <div
                        key={cat.slug}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all select-none cursor-move ${
                          isSelected
                            ? "bg-pink-500/15 border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                            : "bg-black/40 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsNewCategory(false);
                          }}
                        >
                          <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-gray-300">
                            <GripVertical className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
                            <span className="text-xs font-mono font-bold text-pink-400 w-6">#{idx + 1}</span>
                          </div>
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                            <img
                              src={formatImageUrl(cat.image)}
                              alt={cat.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate group-hover:text-pink-300 transition-colors">
                              {cat.title}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {cat.gallery?.length || 0} visual assets
                            </p>
                          </div>
                        </div>

                        {/* Quick Reorder Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveCategory(idx, "top");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-300 disabled:opacity-20 transition-colors"
                            title="Put on Top (Rank #1)"
                          >
                            <ChevronsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveCategory(idx, "up");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveCategory(idx, "down");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveCategory(idx, "bottom");
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-300 disabled:opacity-20 transition-colors"
                            title="Put on Bottom (Last Rank)"
                          >
                            <ChevronsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Selector List */}
              <div className="flex flex-wrap gap-2">
                {data.vehicleCategories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setEditingCategory(c);
                      setIsNewCategory(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      editingCategory?.slug === c.slug
                        ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              {/* Editing Category Form */}
              {editingCategory && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={editingCategory.title}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, title: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editingCategory.slug}
                        disabled={!isNewCategory}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, slug: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm disabled:opacity-50"
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Cover Image
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCategory.image}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, image: e.target.value })
                          }
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                        />
                        <button
                          type="button"
                          title="Upload new image"
                          onClick={() =>
                            triggerUpload((url) =>
                              setEditingCategory((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Choose from Media Library"
                          onClick={() =>
                            openMediaPicker((url) =>
                              setEditingCategory((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="px-3 py-2 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white rounded-xl text-xs font-bold"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                      </div>
                      {editingCategory.image && (
                        <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-black">
                          <img
                            src={formatImageUrl(editingCategory.image)}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingCategory.description}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, description: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        About Category (Detailed Breakdown)
                      </label>
                      <textarea
                        rows={3}
                        value={editingCategory.about}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, about: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    {/* Software Tools for Category */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                        Software & Tools
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editingCategory.software.map((tool, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white"
                          >
                            <span>{tool}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCategory.software.filter(
                                  (_, i) => i !== idx
                                );
                                setEditingCategory({ ...editingCategory, software: updated });
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add tool..."
                          value={newCategorySoftwareInput}
                          onChange={(e) => setNewCategorySoftwareInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newCategorySoftwareInput.trim()) {
                                setEditingCategory({
                                  ...editingCategory,
                                  software: [
                                    ...editingCategory.software,
                                    newCategorySoftwareInput.trim(),
                                  ],
                                });
                                setNewCategorySoftwareInput("");
                              }
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newCategorySoftwareInput.trim()) {
                              setEditingCategory({
                                ...editingCategory,
                                software: [
                                  ...editingCategory.software,
                                  newCategorySoftwareInput.trim(),
                                ],
                              });
                              setNewCategorySoftwareInput("");
                            }
                          }}
                          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                        <span>Quick add:</span>
                        {COMMON_3D_TOOLS.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => {
                              if (!editingCategory.software.includes(tool)) {
                                setEditingCategory({
                                  ...editingCategory,
                                  software: [...editingCategory.software, tool],
                                });
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-gray-400 transition-colors"
                          >
                            + {tool}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Production Deliverables for Category */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                        Production Deliverables
                      </label>
                      <div className="space-y-2 mb-4">
                        {editingCategory.deliverables.map((deliv, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                              <span>{deliv}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCategory.deliverables.filter(
                                  (_, i) => i !== idx
                                );
                                setEditingCategory({
                                  ...editingCategory,
                                  deliverables: updated,
                                });
                              }}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add deliverable..."
                          value={newCategoryDeliverableInput}
                          onChange={(e) => setNewCategoryDeliverableInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newCategoryDeliverableInput.trim()) {
                                setEditingCategory({
                                  ...editingCategory,
                                  deliverables: [
                                    ...editingCategory.deliverables,
                                    newCategoryDeliverableInput.trim(),
                                  ],
                                });
                                setNewCategoryDeliverableInput("");
                              }
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-pink-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newCategoryDeliverableInput.trim()) {
                              setEditingCategory({
                                ...editingCategory,
                                deliverables: [
                                  ...editingCategory.deliverables,
                                  newCategoryDeliverableInput.trim(),
                                ],
                              });
                              setNewCategoryDeliverableInput("");
                            }
                          }}
                          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Gallery Images with Upload and Media Library Picker */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Category Gallery Visuals ({editingCategory.gallery.length})
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              triggerUpload((url) =>
                                setEditingCategory((prev) =>
                                  prev
                                    ? { ...prev, gallery: [...prev.gallery, url] }
                                    : null
                                )
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload New
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openMediaPicker((url) =>
                                setEditingCategory((prev) =>
                                  prev
                                    ? { ...prev, gallery: [...prev.gallery, url] }
                                    : null
                                )
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Select from Media Library
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {editingCategory.gallery.map((img, i) => (
                          <div
                            key={i}
                            className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-black"
                          >
                            <img
                              src={formatImageUrl(img)}
                              alt="Gallery preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = editingCategory.gallery.filter(
                                  (_, idx) => idx !== i
                                );
                                setEditingCategory({ ...editingCategory, gallery: newGallery });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    {!isNewCategory && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(editingCategory.slug)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Category
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleSaveCurrentCategory}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : isNewCategory ? "Create Category" : "Save Category"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: PRODUCTION CREDITS */}
          {activeTab === "productions" && data && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-pink-500" />
                    Production Credits & Shipped Titles
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage game releases, client studios, and roles displayed in the homepage Productions section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const freshProd: ProductionItem = {
                      id: `prod-${Date.now()}`,
                      title: "New Game / Project",
                      type: "Video Game",
                      year: new Date().getFullYear().toString(),
                      role: "3D Vehicle & Prop Artist",
                      company: "Client / Studio Name",
                      image: "https://cdnb.artstation.com/p/productions/covers/000/210/699/thumb/icon.png?1748287448",
                    };
                    setEditingProduction(freshProd);
                    setIsNewProduction(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  Add Production
                </button>
              </div>

              {/* Grid of Productions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.productions || []).map((prod) => (
                  <div
                    key={prod.id}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pink-500/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                        <img
                          src={formatImageUrl(prod.image)}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {prod.type} • {prod.year}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate">{prod.title}</h3>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{prod.role}</p>
                        <p className="text-[11px] text-gray-500 truncate">{prod.company}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduction(prod);
                          setIsNewProduction(false);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-pink-500 hover:text-white rounded-xl text-xs font-semibold text-gray-300 transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Production Modal/Drawer */}
              {editingProduction && (
                <div className="p-6 md:p-8 bg-[#161616] border border-white/10 rounded-3xl space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {isNewProduction ? "Add New Production Credit" : `Editing "${editingProduction.title}"`}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Configure shipped title details, role, and capsule cover
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduction(null)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Game / Title Name
                      </label>
                      <input
                        type="text"
                        value={editingProduction.title}
                        onChange={(e) =>
                          setEditingProduction({ ...editingProduction, title: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Release Type / Platform
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AAA Mobile Game, Video Game, Steam Title"
                        value={editingProduction.type}
                        onChange={(e) =>
                          setEditingProduction({ ...editingProduction, type: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Release Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2025"
                        value={editingProduction.year}
                        onChange={(e) =>
                          setEditingProduction({ ...editingProduction, year: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Role / Contribution
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lead 3D Vehicle Artist, Hard-Surface Modeler"
                        value={editingProduction.role}
                        onChange={(e) =>
                          setEditingProduction({ ...editingProduction, role: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Company / Client Studio
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Real Games SRLS, Fabwelt Studios, Bas Hamer studio"
                        value={editingProduction.company}
                        onChange={(e) =>
                          setEditingProduction({ ...editingProduction, company: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    {/* Image / Capsule Banner */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                        Thumbnail / Capsule Cover Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          placeholder="Image URL or upload file..."
                          value={editingProduction.image}
                          onChange={(e) =>
                            setEditingProduction({ ...editingProduction, image: e.target.value })
                          }
                          className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                        />
                        <button
                          type="button"
                          title="Upload new image"
                          onClick={() =>
                            triggerUpload((url) =>
                              setEditingProduction((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button
                          type="button"
                          title="Choose from Media Library"
                          onClick={() =>
                            openMediaPicker((url) =>
                              setEditingProduction((prev) =>
                                prev ? { ...prev, image: url } : null
                              )
                            )
                          }
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                        >
                          <FolderOpen className="w-4 h-4" />
                          Media Library
                        </button>
                      </div>

                      {editingProduction.image && (
                        <div className="mt-4 w-36 h-36 rounded-2xl overflow-hidden border border-white/10 bg-black">
                          <img
                            src={formatImageUrl(editingProduction.image)}
                            alt="Production preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    {!isNewProduction && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProduction(editingProduction.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Production
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleSaveProduction}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : isNewProduction ? "Create Production" : "Save Production"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EXPERIENCE TIMELINE */}
          {activeTab === "experiences" && data && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-pink-500" />
                    Professional Experience Timeline
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage work history, studios, roles, and bullet achievements shown on the homepage timeline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const freshExp: ExperienceItem = {
                      id: `exp-${Date.now()}`,
                      title: "Senior 3D Artist",
                      company: "Studio / Company Name",
                      type: "Remote",
                      date: `${new Date().getFullYear()} – Present`,
                      color: "text-pink-400",
                      description: [
                        "Delivered high-poly and game-ready 3D vehicle assets.",
                        "Collaborated with creative director on real-time optimization.",
                      ],
                    };
                    setEditingExperience(freshExp);
                    setIsNewExperience(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>

              {/* Grid of Experiences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data.experiences || []).map((exp) => (
                  <div
                    key={exp.id}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                            <span className={exp.color || "text-pink-400"}>{exp.company}</span>
                            <span className="text-white/30">•</span>
                            <span className="text-gray-400">{exp.type}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 shrink-0">
                          {exp.date}
                        </span>
                      </div>

                      <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                        {(exp.description || []).slice(0, 2).map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-pink-500 shrink-0" />
                            <span className="line-clamp-1">{bullet}</span>
                          </li>
                        ))}
                        {(exp.description || []).length > 2 && (
                          <li className="text-[11px] text-gray-500 italic pl-3">
                            + {(exp.description || []).length - 2} more bullet points
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExperience(exp);
                          setIsNewExperience(false);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-pink-500 hover:text-white rounded-xl text-xs font-semibold text-gray-300 transition-colors"
                      >
                        Edit Experience
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Experience Modal/Drawer */}
              {editingExperience && (
                <div className="p-6 md:p-8 bg-[#161616] border border-white/10 rounded-3xl space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {isNewExperience
                          ? "Add New Experience Entry"
                          : `Editing "${editingExperience.title}"`}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Configure job title, studio, date range, accent color, and bullet points
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingExperience(null)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={editingExperience.title}
                        onChange={(e) =>
                          setEditingExperience({
                            ...editingExperience,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g. 3D Modeler / Vehicle Artist"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Company / Studio
                      </label>
                      <input
                        type="text"
                        value={editingExperience.company}
                        onChange={(e) =>
                          setEditingExperience({
                            ...editingExperience,
                            company: e.target.value,
                          })
                        }
                        placeholder="e.g. Real Games SRLS"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Work Type
                      </label>
                      <input
                        type="text"
                        value={editingExperience.type}
                        onChange={(e) =>
                          setEditingExperience({
                            ...editingExperience,
                            type: e.target.value,
                          })
                        }
                        placeholder="e.g. Remote, On-site, Contract"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Date Range / Period
                      </label>
                      <input
                        type="text"
                        value={editingExperience.date}
                        onChange={(e) =>
                          setEditingExperience({
                            ...editingExperience,
                            date: e.target.value,
                          })
                        }
                        placeholder="e.g. Apr 2025 – Present"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Accent Color Theme
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { label: "Pink", val: "text-pink-400", bg: "bg-pink-400" },
                          { label: "Green", val: "text-green-400", bg: "bg-green-400" },
                          { label: "Orange", val: "text-orange-400", bg: "bg-orange-400" },
                          { label: "Blue", val: "text-blue-400", bg: "bg-blue-400" },
                          { label: "Purple", val: "text-purple-400", bg: "bg-purple-400" },
                          { label: "Cyan", val: "text-cyan-400", bg: "bg-cyan-400" },
                          { label: "Yellow", val: "text-yellow-400", bg: "bg-yellow-400" },
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() =>
                              setEditingExperience({
                                ...editingExperience,
                                color: c.val,
                              })
                            }
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              editingExperience.color === c.val
                                ? "bg-white/15 border-white text-white shadow-md"
                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                            <span>{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bullet Points / Responsibilities Manager */}
                    <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold">
                          Key Responsibilities & Highlights
                        </label>
                        <span className="text-[11px] text-gray-500">
                          {(editingExperience.description || []).length} items
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type achievement or responsibility and click Add..."
                          value={newExpDescInput}
                          onChange={(e) => setNewExpDescInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newExpDescInput.trim()) {
                              e.preventDefault();
                              const updated = [
                                ...(editingExperience.description || []),
                                newExpDescInput.trim(),
                              ];
                              setEditingExperience({
                                ...editingExperience,
                                description: updated,
                              });
                              setNewExpDescInput("");
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pink-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newExpDescInput.trim()) return;
                            const updated = [
                              ...(editingExperience.description || []),
                              newExpDescInput.trim(),
                            ];
                            setEditingExperience({
                              ...editingExperience,
                              description: updated,
                            });
                            setNewExpDescInput("");
                          }}
                          className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingExperience.description || []).map((desc, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group"
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                              <span className="text-xs text-gray-300 leading-relaxed break-words">
                                {desc}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (
                                  editingExperience.description || []
                                ).filter((_, idx) => idx !== i);
                                setEditingExperience({
                                  ...editingExperience,
                                  description: updated,
                                });
                              }}
                              className="p-1 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    {!isNewExperience && (
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(editingExperience.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Experience
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleSaveCurrentExperience}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving
                        ? "Saving..."
                        : isNewExperience
                        ? "Create Experience"
                        : "Save Experience"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SOFTWARE ARSENAL */}
          {activeTab === "software" && data && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-pink-500" />
                    Software Arsenal & Tools
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage the 3D software, texturing tools, and real-time engines featured on your homepage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateNewSoftware}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Software Tool
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Reorderable List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      Tools Order ({data.softwareTools?.length || 0})
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Use arrows to reorder
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                    {(data.softwareTools || []).map((tool, index) => {
                      const isSelected = editingSoftware?.id === tool.id;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => {
                            setEditingSoftware(tool);
                            setIsNewSoftware(false);
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "bg-white/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/30"
                              : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Icon thumbnail */}
                            <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                              {tool.icon ? (
                                <img
                                  src={formatImageUrl(tool.icon)}
                                  alt={tool.name}
                                  className={`w-6 h-6 object-contain ${tool.invert ? "invert" : ""}`}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="text-xs font-bold text-pink-400">
                                  {tool.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate group-hover:text-pink-300 transition-colors">
                                {tool.name}
                              </h4>
                              {tool.category && (
                                <p className="text-[11px] text-gray-400 truncate">
                                  {tool.category}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order actions */}
                          <div
                            className="flex items-center gap-1 shrink-0 ml-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveSoftware(index, "up")}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === (data.softwareTools?.length || 0) - 1}
                              onClick={() => handleMoveSoftware(index, "down")}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {(!data.softwareTools || data.softwareTools.length === 0) && (
                      <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl text-gray-500 text-xs">
                        No software tools added yet. Click &ldquo;Add Software Tool&rdquo; to start.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Edit / Create Form */}
                <div className="lg:col-span-7">
                  {editingSoftware ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
                            {isNewSoftware ? "New Entry" : "Editing Entry"}
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {editingSoftware.name || "Untitled Software"}
                          </h3>
                        </div>

                        {/* Live Homepage Pill Preview */}
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            Live Preview
                          </span>
                          <div className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-sm opacity-70" />
                            <div className="absolute inset-[1px] rounded-full bg-[#1a1a1a]/95 border border-white/10" />
                            <div className="relative z-10 flex items-center gap-2">
                              {editingSoftware.icon ? (
                                <img
                                  src={formatImageUrl(editingSoftware.icon)}
                                  alt={editingSoftware.name}
                                  className={`w-4 h-4 object-contain ${
                                    editingSoftware.invert ? "invert" : ""
                                  }`}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-pink-500/30 text-pink-400 font-bold text-[9px] flex items-center justify-center">
                                  {editingSoftware.name
                                    ? editingSoftware.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                              )}
                              <span className="text-xs font-semibold text-gray-200 tracking-wide">
                                {editingSoftware.name || "Software Name"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Inputs */}
                      <div className="space-y-5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                            Software / Tool Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Blender, Unreal Engine 5, Substance 3D Painter..."
                            value={editingSoftware.name}
                            onChange={(e) =>
                              setEditingSoftware({
                                ...editingSoftware,
                                name: e.target.value,
                              })
                            }
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                            Discipline / Category
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 3D Modeling & Animation, Texturing, Real-Time Engine..."
                            value={editingSoftware.category || ""}
                            onChange={(e) =>
                              setEditingSoftware({
                                ...editingSoftware,
                                category: e.target.value,
                              })
                            }
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                          />

                          {/* Quick Category Suggestions */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {[
                              "3D Modeling & Animation",
                              "Texturing & Shading",
                              "LookDev & Baking",
                              "Real-Time Engine",
                              "Digital Sculpting",
                              "Post-Processing & Textures",
                              "Hard-Surface Modeling",
                            ].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() =>
                                  setEditingSoftware({
                                    ...editingSoftware,
                                    category: tag,
                                  })
                                }
                                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                                  editingSoftware.category === tag
                                    ? "bg-pink-500/20 border-pink-500 text-pink-300 font-bold"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Icon Image Section */}
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold">
                              Tool Logo / Icon Image
                            </label>
                            {editingSoftware.icon && (
                              <span className="text-[10px] text-emerald-400 font-mono">
                                ✓ Icon Configured
                              </span>
                            )}
                          </div>

                          <div className="flex items-start gap-4">
                            {/* Icon preview box */}
                            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/15 flex items-center justify-center p-2 shrink-0">
                              {editingSoftware.icon ? (
                                <img
                                  src={formatImageUrl(editingSoftware.icon)}
                                  alt="Icon preview"
                                  className={`max-w-full max-h-full object-contain ${
                                    editingSoftware.invert ? "invert" : ""
                                  }`}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-600" />
                              )}
                            </div>

                            <div className="flex-1 space-y-2.5">
                              {/* Upload / Pick Actions */}
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerUpload((url) =>
                                      setEditingSoftware({
                                        ...editingSoftware,
                                        icon: url,
                                      })
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5 text-pink-400" />
                                  Upload Icon File
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openMediaPicker((url) =>
                                      setEditingSoftware({
                                        ...editingSoftware,
                                        icon: url,
                                      })
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                                >
                                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                                  Select From Media
                                </button>
                              </div>

                              {/* Direct URL input */}
                              <input
                                type="text"
                                placeholder="Or paste image or SVG URL (e.g. https://...)"
                                value={editingSoftware.icon}
                                onChange={(e) =>
                                  setEditingSoftware({
                                    ...editingSoftware,
                                    icon: e.target.value,
                                  })
                                }
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-pink-500 outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Invert Dark/Light Toggle */}
                          <label className="flex items-center gap-3 pt-2 border-t border-white/5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(editingSoftware.invert)}
                              onChange={(e) =>
                                setEditingSoftware({
                                  ...editingSoftware,
                                  invert: e.target.checked,
                                })
                              }
                              className="w-4 h-4 rounded text-pink-500 focus:ring-0 focus:ring-offset-0 bg-black/40 border-white/20"
                            />
                            <div className="text-xs">
                              <span className="text-white font-medium">
                                Invert icon colors for dark theme
                              </span>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Enable for black logos (like Unreal Engine or Unity) so they turn white and shine against dark backgrounds.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        {!isNewSoftware && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSoftware(editingSoftware.id)}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Tool
                          </button>
                        )}
                        <div className="flex-1" />
                        <button
                          type="button"
                          onClick={handleSaveCurrentSoftware}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving
                            ? "Saving..."
                            : isNewSoftware
                            ? "Create Software Tool"
                            : "Save Software Tool"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                      <Cpu className="w-12 h-12 text-gray-600 mb-3" />
                      <h4 className="text-base font-bold text-gray-300">
                        No Tool Selected
                      </h4>
                      <p className="text-xs text-gray-500 max-w-xs mt-1">
                        Select an existing software tool from the list on the left to edit it, or click &ldquo;Add Software Tool&rdquo; to create a new one.
                      </p>
                      <button
                        type="button"
                        onClick={handleCreateNewSoftware}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Software Tool
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-pink-500" />
                    Visual Media Library
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage uploaded 3D renders, hero banners, and project visuals.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadMedia()}
                    disabled={isMediaLoading}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-colors"
                    title="Refresh media"
                  >
                    <RefreshCw className={`w-4 h-4 ${isMediaLoading ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpload(() => loadMedia())}
                    className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                </div>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter media files by filename..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>

              {/* Media Grid */}
              {isMediaLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                  <p className="text-xs">Loading media assets...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No media files found</p>
                  <p className="text-xs mt-1">Upload an image to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((media) => {
                    const fullUrl = formatImageUrl(media.url);
                    const isCopied = copiedUrl === fullUrl;

                    return (
                      <div
                        key={media.filename}
                        className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all duration-300"
                      >
                        {/* Image Box */}
                        <div className="relative aspect-video w-full bg-black overflow-hidden">
                          <img
                            src={fullUrl}
                            alt={media.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(fullUrl)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                              title="Copy Image URL"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(media.filename)}
                              className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white transition-colors"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="p-3">
                          <p
                            className="text-xs font-semibold text-gray-200 truncate"
                            title={media.filename}
                          >
                            {media.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                            <span>{formatBytes(media.size)}</span>
                            <span>
                              {new Date(media.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {isCopied && (
                            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                              ✓ URL Copied!
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & CONTACT */}
          {activeTab === "profile" && data && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Profile & Contact Details</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage artist contact info, bio, and social links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, name: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={data.profile.title}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, title: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, email: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={data.profile.phone}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, phone: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, location: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Bio / Status Line
                  </label>
                  <textarea
                    rows={3}
                    value={data.profile.bio}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, bio: e.target.value } })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLIENT INBOX / ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold">Client Inquiries & Leads</h2>
                    {enquiries.filter((e) => e.status === "unread").length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white animate-pulse">
                        {enquiries.filter((e) => e.status === "unread").length} Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage enquiries received through the portfolio contact form.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadEnquiries}
                    disabled={isEnquiriesLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isEnquiriesLoading ? "animate-spin text-pink-400" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: "all", label: "All", count: enquiries.length },
                  {
                    key: "unread",
                    label: "Unread",
                    count: enquiries.filter((e) => e.status === "unread").length,
                  },
                  {
                    key: "read",
                    label: "Read",
                    count: enquiries.filter((e) => e.status === "read").length,
                  },
                  {
                    key: "replied",
                    label: "Replied",
                    count: enquiries.filter((e) => e.status === "replied").length,
                  },
                  {
                    key: "archived",
                    label: "Archived",
                    count: enquiries.filter((e) => e.status === "archived").length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      setEnquiryFilter(
                        tab.key as "all" | "unread" | "read" | "replied" | "archived"
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      enquiryFilter === tab.key
                        ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1.5 opacity-70 text-[10px]">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* Enquiry Cards List */}
              {isEnquiriesLoading && enquiries.length === 0 ? (
                <div className="py-20 text-center text-gray-400 space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-pink-500" />
                  <p className="text-xs">Loading client enquiries...</p>
                </div>
              ) : enquiries.filter((e) =>
                  enquiryFilter === "all" ? true : e.status === enquiryFilter
                ).length === 0 ? (
                <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl space-y-2">
                  <Inbox className="w-10 h-10 mx-auto opacity-30 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-300">No enquiries found</p>
                  <p className="text-xs max-w-sm mx-auto text-gray-500">
                    When visitors submit the contact form on your portfolio, their details and messages will be stored here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries
                    .filter((e) =>
                      enquiryFilter === "all" ? true : e.status === enquiryFilter
                    )
                    .map((item) => {
                      const isUnread = item.status === "unread";
                      const isReplied = item.status === "replied";
                      const isArchived = item.status === "archived";

                      return (
                        <div
                          key={item.id}
                          className={`p-5 rounded-2xl border transition-all duration-200 ${
                            isUnread
                              ? "bg-pink-500/[0.03] border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.1)]"
                              : "bg-white/[0.02] border-white/10 hover:border-white/20"
                          }`}
                        >
                          {/* Top Row: Meta info */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Status Badge */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isUnread
                                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                                    : isReplied
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : isArchived
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-white/10 text-gray-300 border border-white/10"
                                }`}
                              >
                                {isUnread && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                                )}
                                {item.status}
                              </span>

                              {/* Category Badge */}
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {item.category}
                              </span>

                              {/* Timestamp */}
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>

                            {/* Status Quick Actions */}
                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                              {item.status !== "read" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, "read")}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white transition-colors"
                                  title="Mark as Read"
                                >
                                  Mark Read
                                </button>
                              )}
                              {item.status !== "unread" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, "unread")}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white transition-colors"
                                  title="Mark as Unread"
                                >
                                  Mark Unread
                                </button>
                              )}
                              {item.status !== "replied" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, "replied")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-medium transition-colors"
                                  title="Mark as Replied"
                                >
                                  Mark Replied
                                </button>
                              )}
                              {item.status !== "archived" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, "archived")}
                                  className="p-1 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                                  title="Archive enquiry"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteEnquiryItem(item.id)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete enquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Contact Info Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 rounded-xl bg-black/30 border border-white/5 mb-3 text-xs">
                            <div className="flex items-center gap-2 text-white font-semibold">
                              <User className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <a
                                href={`mailto:${item.email}?subject=${encodeURIComponent(
                                  `Re: ${item.category} - Moon 3D Studio`
                                )}`}
                                className="text-gray-300 hover:text-cyan-400 hover:underline truncate"
                              >
                                {item.email}
                              </a>
                            </div>

                            {item.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <a
                                  href={`tel:${item.phone}`}
                                  className="text-gray-300 hover:text-emerald-400 hover:underline truncate"
                                >
                                  {item.phone}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Message Body */}
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap select-text">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ---------------- MODAL 1: CHANGE PASSWORD ---------------- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Change Admin Password</h3>
                <p className="text-xs text-gray-400">Update your dashboard security credentials</p>
              </div>
            </div>

            {passwordChangeStatus.msg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordChangeStatus.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {passwordChangeStatus.type === "success" ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordChangeStatus.msg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: INTERACTIVE MEDIA PICKER ---------------- */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#141414] border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Select from Media Library</h3>
                  <p className="text-xs text-gray-400">
                    Click any asset to assign it immediately
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMediaPickerOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Quick Upload bar */}
            <div className="py-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={mediaPickerSearch}
                  onChange={(e) => setMediaPickerSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerUpload((url) => {
                    handleSelectFromMediaPicker(url);
                  })
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New
              </button>
            </div>

            {/* Scrollable Images Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {filteredPickerMedia.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">No assets found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredPickerMedia.map((media) => {
                    const fullUrl = formatImageUrl(media.url);

                    return (
                      <button
                        key={media.filename}
                        type="button"
                        onClick={() => handleSelectFromMediaPicker(fullUrl)}
                        className="group relative flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-pink-500 transition-all text-left focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <div className="relative aspect-video w-full bg-black overflow-hidden">
                          <img
                            src={fullUrl}
                            alt={media.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-1 bg-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                              Select
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-medium text-gray-300 truncate">
                            {media.filename}
                          </p>
                          <span className="text-[9px] text-gray-500">
                            {formatBytes(media.size)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span>{filteredPickerMedia.length} assets available</span>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
