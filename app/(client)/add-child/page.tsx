"use client";

import {
  ChildForm,
  type ChildFormData,
} from "@/components/add-child/ChildForm";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Edit, Plus, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RegisterRequest } from "@/types";
import { useAssignCompetitors } from "@/apis/guardian";
import { useAuth } from "@/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChildData extends ChildFormData {
  id: string;
}

export default function AddChildPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildData | null>(null);
  const { mutate, isPending } = useAssignCompetitors(() => router.back());
  const handleAddChild = () => {
    setEditingChild(null);
    setShowForm(true);
  };

  const handleEditChild = (child: ChildData) => {
    setEditingChild(child);
    setShowForm(true);
  };

  const handleDeleteChild = (childId: string) => {
    setChildren((prev) => prev.filter((child) => child.id !== childId));
  };

  const handleFormSubmit = (childData: ChildFormData & { id?: string }) => {
    if (editingChild) {
      // Update existing child
      setChildren((prev) =>
        prev.map((child) =>
          child.id === editingChild.id
            ? { ...childData, id: editingChild.id }
            : child
        )
      );
    } else {
      // Add new child
      setChildren((prev) => [
        ...prev,
        { ...childData, id: Date.now().toString() },
      ]);
    }
  };

  const handleSubmitAll = async () => {
    if (user?.role !== "GUARDIAN") {
      toast.error("Only guardians can assign competitors.");
      return;
    }
    // TODO: Submit all children to server
    const studentData: RegisterRequest[] = children.map((c) => ({
      email: c.email,
      fullName: c.fullName,
      birthday: c.birthday,
      grade: c.grade,
      schoolName: c.schoolName,
      username: c.username,
      password: c.password,
      role: "COMPETITOR",
    }));
    mutate({
      studentData,
      guardianId: user?.userId,
    });
  };

  return (
    <div className="min-h-screen bg-background pt-25 px-8 text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card p-8 border border-border shadow-md mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Thêm con em
            </h1>
            <p className="text-muted-foreground">
              Thêm thông tin các con em để tham gia cuộc thi nghệ thuật
            </p>
          </div>
          <Link
            href="/me"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center space-x-2 px-4 py-2 rounded-full transition-all border border-border"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Quay lại</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-muted p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-[#FF6E1A]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Số con em đã thêm
                </p>
                <p className="text-xl font-bold text-foreground">
                  {children.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleAddChild}
              className="bg-[#FF6E1A] text-white px-4 py-2 hover:bg-[#FF6E1A]/90 transition-colors flex items-center space-x-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm con em</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Children List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card p-8 border border-border shadow-sm"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Danh sách con em
        </h2>

        {children.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {child.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {child.fullName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        @{child.username}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{child.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Trường:</span>
                      <span>{child.schoolName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Lớp:</span>
                      <span>{child.grade}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditChild(child)}
                      className="flex-1 bg-muted text-muted-foreground px-3 py-2 hover:bg-muted/80 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDeleteChild(child.id)}
                      className="flex-1 bg-destructive/10 text-destructive px-3 py-2 hover:bg-destructive/20 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit All Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmitAll}
                disabled={isPending}
                className="bg-green-600 text-white px-8 py-3 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Xác nhận thêm tất cả ({children.length} con em)</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Chưa có con em nào
            </h3>
            <p className="text-muted-foreground mb-6">
              Hãy thêm thông tin con em để bắt đầu tham gia cuộc thi
            </p>
          </div>
        )}
      </motion.div>

      {/* Child Form Drawer */}
      <ChildForm
        open={showForm}
        onOpenChange={setShowForm}
        initialData={editingChild || undefined}
        onSubmit={handleFormSubmit}
        isEditing={!!editingChild}
      />
    </div>
  );
}
