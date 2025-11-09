"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { RegisterRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

// Zod schema for create user form validation
const createUserSchema = (t: any) =>
  z.object({
    username: z
      .string()
      .min(3, t.usernameMinLength)
      .max(20, t.usernameMaxLength)
      .regex(/^[a-zA-Z0-9_]+$/, t.usernamePattern),
    password: z.string().min(6, t.passwordMinLength),
    fullName: z
      .string()
      .min(2, t.fullNameMinLength)
      .max(50, t.fullNameMaxLength),
    email: z.email(t.emailInvalid),
    role: z.enum(["STAFF", "ADMIN", "EXAMINER"]),
  });

type CreateUserFormValues = z.infer<ReturnType<typeof createUserSchema>>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
}: CreateUserDialogProps) {
  // Translation
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema(t)),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      role: "STAFF",
    },
    mode: "all",
  });
  const queryClient = useQueryClient();

  const registerMutation = useRegisterMutation(() => {
    reset(); // Reset form on success
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    onOpenChange(false); // Close dialog immediately
  });

  const onSubmitForm = (data: CreateUserFormValues) => {
    const registerData: RegisterRequest = {
      username: data.username,
      password: data.password,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    registerMutation.mutate(registerData);
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset(); // Reset form on cancel
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.addNewUser}</DialogTitle>
          <DialogDescription>{t.manageAllUserAccounts}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="create-fullName"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t.fullName}
              </label>
              <input
                id="create-fullName"
                type="text"
                {...register("fullName")}
                className="staff-input w-full"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="create-username"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t.username}
              </label>
              <input
                id="create-username"
                type="text"
                {...register("username")}
                className="staff-input w-full"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="create-password"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t.password}
              </label>
              <input
                id="create-password"
                type="password"
                {...register("password")}
                className="staff-input w-full"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="create-email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t.email}
              </label>
              <input
                id="create-email"
                type="email"
                {...register("email")}
                className="staff-input w-full"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="create-role"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                {t.roleTable}
              </label>
              <select
                id="create-role"
                {...register("role")}
                className="staff-input w-full"
              >
                <option value="STAFF">{t.staffFilter}</option>
                <option value="ADMIN">{t.adminsFilter}</option>
                <option value="EXAMINER">{t.examinersFilter}</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-none"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={!isValid || registerMutation.isPending}
              className="staff-btn-primary disabled:opacity-50 rounded-none"
            >
              {registerMutation.isPending ? t.processing : t.addNewUser}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
