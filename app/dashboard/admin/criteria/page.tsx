"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCriteria,
  createCriteria,
  updateCriteria,
  deleteCriteria,
  Criteria,
  CreateCriteriaDto,
  UpdateCriteriaDto,
} from "@/apis/criteria";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CriteriaFormValues {
  name: string;
  description: string;
  maxScore: number;
  isActive: boolean;
}

const baseSchema = z.object({
  name: z.string().min(1, "Tên tiêu chí không được để trống"),
  description: z.string(),
  maxScore: z.number().min(1, "Điểm tối đa phải lớn hơn 0"),
  isActive: z.boolean(),
});

export default function CriteriaPage() {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const queryClient = useQueryClient();

  const { data: criteriaList = [], isLoading } = useQuery({
    queryKey: ["criteria"],
    queryFn: getCriteria,
  });

  const activeCriteria = criteriaList.filter(c => c.isActive);
  const currentTotalScore = activeCriteria.reduce((sum, c) => sum + c.maxScore, 0);
  const activeCount = activeCriteria.length;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);

  const form = useForm<CriteriaFormValues>({
    resolver: zodResolver(
      baseSchema.superRefine((data, ctx) => {
        if (data.isActive) {
          const otherTotal = isEditDialogOpen
            ? currentTotalScore - (selectedCriteria?.isActive ? selectedCriteria.maxScore : 0)
            : currentTotalScore;

          if (otherTotal + data.maxScore > 100) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Tổng điểm các tiêu chí hoạt động không được vượt quá 100. Điểm tối đa có thể thiết lập: ${100 - otherTotal}`,
              path: ["maxScore"],
            });
          }

          if (data.isActive && !(isEditDialogOpen && selectedCriteria?.isActive) && activeCount >= 5) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Đã đạt tối đa 5 tiêu chí hoạt động",
              path: ["isActive"],
            });
          }
        }
      })
    ),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      maxScore: 10,
      isActive: true,
    },
  });

  const breadcrumbItems = [
    { label: t.dashboard || "Dashboard", href: "/dashboard/admin" },
    { label: "Quản Lý Tiêu Chí", href: "/dashboard/admin/criteria" },
  ];

  const createMutation = useMutation({
    mutationFn: (data: CreateCriteriaDto) => createCriteria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast.success("Tạo tiêu chí thành công");
    },
    onError: () => {
      toast.error("Tạo tiêu chí thất bại");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCriteriaDto }) =>
      updateCriteria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setIsEditDialogOpen(false);
      setSelectedCriteria(null);
      form.reset();
      toast.success("Cập nhật tiêu chí thành công");
    },
    onError: () => {
      toast.error("Cập nhật tiêu chí thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCriteria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setIsDeleteDialogOpen(false);
      setSelectedCriteria(null);
      toast.success("Xóa tiêu chí thành công");
    },
    onError: () => {
      toast.error("Xóa tiêu chí thất bại");
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      name: "",
      description: "",
      maxScore: 10,
      isActive: true,
    });
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (criteria: Criteria) => {
    setSelectedCriteria(criteria);
    form.reset({
      name: criteria.name,
      description: criteria.description || "",
      maxScore: criteria.maxScore,
      isActive: criteria.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const onSubmitCreate = (data: CriteriaFormValues) => {
    createMutation.mutate(data);
  };

  const onSubmitEdit = (data: CriteriaFormValues) => {
    if (selectedCriteria) {
      updateMutation.mutate({ id: selectedCriteria.id, data });
    }
  };

  const handleOpenDelete = (criteria: Criteria) => {
    setSelectedCriteria(criteria);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCriteria) {
      deleteMutation.mutate(selectedCriteria.id);
    }
  };

  const handleToggleStatus = (criteria: Criteria, pressed: boolean) => {
    if (pressed) {
      if (activeCount >= 5) {
        toast.error("Đã đạt tối đa 5 tiêu chí hoạt động.");
        return;
      }
      if (currentTotalScore + criteria.maxScore > 100) {
        toast.error(`Tổng điểm sẽ vượt quá 100. Hãy giảm điểm của tiêu chí khác trước khi kích hoạt.`);
        return;
      }
    }
    updateMutation.mutate({ id: criteria.id, data: { isActive: pressed } });
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-[#fdfbf7] min-h-screen">
          <div className="flex items-center justify-between">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#423137]">
                Tiêu Chí Chấm Điểm
              </h2>
              <p className="text-muted-foreground staff-text-secondary mt-1">
                Quản lý các tiêu chí đánh giá trong hệ thống
              </p>
            </div>
            <Button
              onClick={handleOpenCreate}
              disabled={activeCount >= 5 || currentTotalScore >= 100}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Thêm Tiêu Chí
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#e6e2da] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfaf8] border-b border-[#e6e2da] text-sm text-[#8c7e82] uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Tên tiêu chí</th>
                    <th className="px-6 py-4 font-semibold">Điểm tối đa</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e2da]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : criteriaList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Chưa có tiêu chí nào được tạo
                      </td>
                    </tr>
                  ) : (
                    criteriaList.map((criteria) => (
                      <tr
                        key={criteria.id}
                        className="hover:bg-[#fdfbf7] transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-[#423137]">
                          {criteria.name}
                        </td>
                        <td className="px-6 py-4 text-[#5c4a51]">
                          {criteria.maxScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={criteria.isActive}
                              onChange={(e) => handleToggleStatus(criteria, e.target.checked)}
                              disabled={updateMutation.isPending}
                              className="sr-only peer"
                            />
                            <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-16 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
                              <svg
                                className="absolute top-1 left-8 stroke-gray-900 w-6 h-6"
                                height={100}
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 100 100"
                                width={100}
                                x={0}
                                xmlns="http://www.w3.org/2000/svg"
                                y={0}
                              >
                                <path
                                  d="M30,46V38a20,20,0,0,1,40,0v8a8,8,0,0,1,8,8V74a8,8,0,0,1-8,8H30a8,8,0,0,1-8-8V54A8,8,0,0,1,30,46Zm32-8v8H38V38a12,12,0,0,1,24,0Z"
                                  fillRule="evenodd"
                                ></path>
                              </svg>
                              <svg
                                className="absolute top-1 left-1 stroke-gray-900 w-6 h-6"
                                height={100}
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 100 100"
                                width={100}
                                x={0}
                                xmlns="http://www.w3.org/2000/svg"
                                y={0}
                              >
                                <path
                                  className="svg-fill-primary"
                                  d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z"
                                ></path>
                              </svg>
                            </div>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(criteria)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Chỉnh sửa"
                            >
                              <IconEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(criteria)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Xóa"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm Tiêu Chí Mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên tiêu chí</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Nhập tên tiêu chí"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Mô tả chi tiết"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxScore">Điểm tối đa</Label>
              <Input
                id="maxScore"
                type="number"
                {...form.register("maxScore", { valueAsNumber: true })}
              />
              {form.formState.errors.maxScore && (
                <p className="text-xs text-red-500">{form.formState.errors.maxScore.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                {...form.register("isActive")}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Kích hoạt</Label>
              {form.formState.errors.isActive && (
                <p className="text-xs text-red-500 ml-2">{form.formState.errors.isActive.message}</p>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Đang tạo..." : "Tạo tiêu chí"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Tiêu Chí</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên tiêu chí</Label>
              <Input
                id="edit-name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                {...form.register("description")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxScore">Điểm tối đa</Label>
              <Input
                id="edit-maxScore"
                type="number"
                {...form.register("maxScore", { valueAsNumber: true })}
              />
              {form.formState.errors.maxScore && (
                <p className="text-xs text-red-500">{form.formState.errors.maxScore.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="edit-isActive"
                {...form.register("isActive")}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">Kích hoạt</Label>
              {form.formState.errors.isActive && (
                <p className="text-xs text-red-500 ml-2">{form.formState.errors.isActive.message}</p>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa tiêu chí"
        description={`Bạn có chắc chắn muốn xóa tiêu chí "${selectedCriteria?.name}"? Hành động này không thể hoàn tác.`}
        confirmText={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        variant="destructive"
      />
    </SidebarProvider>
  );
}
