"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FloatingInput } from "@/components/ui/floating-input";
import { DatePicker } from "@/components/ui/date-picker";
import { FloatingSelect } from "@/components/ui/floating-select";
import { useWards } from "@/hooks/useWards";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Simple schema for Child registration form
const childFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được quá 20 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      ),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    fullName: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được quá 50 ký tự")
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
      ),
    email: z.string().email("Địa chỉ email không hợp lệ"),
    birthday: z.string().min(1, "Vui lòng chọn ngày sinh"),
    schoolName: z.string().min(1, "Vui lòng nhập tên trường"),
    ward: z.string().min(1, "Vui lòng chọn phường/xã"),
    grade: z.string().min(1, "Vui lòng nhập lớp"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChildFormData = z.infer<typeof childFormSchema>;

interface ChildFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ChildFormData & { id?: string };
  onSubmit: (data: ChildFormData & { id?: string }) => void;
  isEditing?: boolean;
}

export function ChildForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isEditing = false,
}: ChildFormProps) {
  const { wards } = useWards();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ChildFormData>({
    mode: "all",
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      birthday: "",
      schoolName: "",
      ward: "",
      grade: "",
    },
  });

  // Reset form when initialData changes or drawer opens/closes
  useEffect(() => {
    if (open && initialData) {
      reset({
        username: initialData.username || "",
        password: initialData.password || "",
        confirmPassword: initialData.password || "", // Use password as confirmPassword for editing
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        birthday: initialData.birthday || "",
        schoolName: initialData.schoolName || "",
        ward: initialData.ward || "",
        grade: initialData.grade || "",
      });
    } else if (!open) {
      reset({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
        birthday: "",
        schoolName: "",
        ward: "",
        grade: "",
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: ChildFormData) => {
    onSubmit({
      ...data,
      id: initialData?.id,
    });
    onOpenChange(false);
  };

  const wardOptions = wards.map((ward) => ({
    value: ward.name,
    label: ward.name,
  }));

  const gradeOptions = [
    { value: "1", label: "Lớp 1" },
    { value: "2", label: "Lớp 2" },
    { value: "3", label: "Lớp 3" },
    { value: "4", label: "Lớp 4" },
    { value: "5", label: "Lớp 5" },
    { value: "6", label: "Lớp 6" },
    { value: "7", label: "Lớp 7" },
    { value: "8", label: "Lớp 8" },
    { value: "9", label: "Lớp 9" },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[98vh] sm:h-[95vh] lg:h-[90vh] max-h-[98vh] sm:max-h-[95vh] lg:max-h-[90vh] bg-background">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-bold">
            {isEditing ? "Sửa thông tin con em" : "Thêm con em"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Cập nhật thông tin của con em"
              : "Điền thông tin để thêm con em mới"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-3 sm:space-y-4 lg:space-y-6"
            >
              {/* Personal Information Section */}
              <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 lg:gap-3">
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                      <FloatingInput
                        label="Họ và tên *"
                        error={errors.fullName?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FloatingInput
                        type="email"
                        label="Email *"
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
                  <Controller
                    control={control}
                    name="username"
                    render={({ field }) => (
                      <FloatingInput
                        label="Tên đăng nhập *"
                        error={errors.username?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FloatingInput
                        type="password"
                        label="Mật khẩu *"
                        error={errors.password?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FloatingInput
                        type="password"
                        label="Xác nhận *"
                        error={errors.confirmPassword?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                  Thông tin học tập
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 lg:gap-3">
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field }) => (
                      <DatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) => {
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : ""
                          );
                        }}
                        placeholder="Chọn ngày sinh *"
                        error={errors.birthday?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="schoolName"
                    render={({ field }) => (
                      <FloatingInput
                        label="Tên trường *"
                        error={errors.schoolName?.message}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 lg:gap-3">
                  <Controller
                    control={control}
                    name="ward"
                    render={({ field }) => (
                      <FloatingSelect
                        label="Phường/Xã *"
                        error={errors.ward?.message}
                        options={wardOptions}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="grade"
                    render={({ field }) => (
                      <FloatingSelect
                        label="Lớp *"
                        error={errors.grade?.message}
                        options={gradeOptions}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <DrawerFooter className="border-t border-border bg-card">
          <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto w-full px-4 sm:px-6">
            <div className="flex gap-3">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Hủy
                </Button>
              </DrawerClose>
              <Button
                onClick={handleSubmit(handleFormSubmit)}
                disabled={!isValid}
                className="flex-1 bg-[#FF6E1A]"
              >
                {isEditing ? "Cập nhật" : "Thêm con em"}
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
