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

// Zod schema for create user form validation
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  email: z.email("Please enter a valid email address"),
  role: z.enum(["STAFF", "ADMIN", "EXAMINER"]),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
}: CreateUserDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
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
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user account to the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="create-fullName"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Full Name
              </label>
              <input
                id="create-fullName"
                type="text"
                {...register("fullName")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Username
              </label>
              <input
                id="create-username"
                type="text"
                {...register("username")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Password
              </label>
              <input
                id="create-password"
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Email
              </label>
              <input
                id="create-email"
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Role
              </label>
              <select
                id="create-role"
                {...register("role")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
                <option value="EXAMINER">Examiner</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || registerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {registerMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
