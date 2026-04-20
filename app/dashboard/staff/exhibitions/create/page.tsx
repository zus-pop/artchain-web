"use client";

import { useCreateExhibition } from "@/apis/exhibition";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExhibitionStatus } from "@/types/exhibition";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema
const exhibitionSchema = z
  .object({
    name: z
      .string()
      .min(1, "Exhibition name is required")
      .max(100, "Name must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be less than 500 characters"),
    status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "CANCEL"]),
  });

type ExhibitionFormData = z.infer<typeof exhibitionSchema>;

export default function CreateExhibitionPage() {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Form setup with React Hook Form and Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ExhibitionFormData>({
    resolver: zodResolver(exhibitionSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "DRAFT",
    },
  });



  // Mutations
  const createExhibitionMutation = useCreateExhibition();

  const onSubmit = async (data: ExhibitionFormData) => {
    try {
      await createExhibitionMutation.mutateAsync(data);
      router.push("/dashboard/staff/exhibitions");
    } catch (error) {
      console.error("Failed to create exhibition:", error);
    }
  };

  const statusOptions: ExhibitionStatus[] = [
    "DRAFT",
    "ACTIVE",
    "COMPLETED",
    "CANCEL",
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <StaffSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={t.createExhibitionTitle} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="staff-page-header">
            <Breadcrumb
              items={[
                {
                  label: t.exhibitionsManagement,
                  href: "/dashboard/staff/exhibitions",
                },
                { label: t.create },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="@container/main">
              <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard/staff/exhibitions"
                      className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                      title={t.backToExhibitions}
                    >
                      <IconArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold staff-text-primary">
                        {t.createNewExhibition}
                      </h1>
                      {/* <p className="text-sm staff-text-secondary mt-1">
                        {t.setupNewExhibition}
                      </p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Buttons moved to form bottom */}
                  </div>
                </div>

                <div className="grid grid-cols-1  gap-6">
                  {/* Main Form Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Exhibition Details */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-sm">
                          <IconCalendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold staff-text-primary">
                            {t.exhibitionDetails}
                          </h2>
                          {/* <p className="text-sm staff-text-secondary">
                            {t.basicExhibitionInfo}
                          </p> */}
                        </div>
                      </div>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="staff-type-label staff-text-primary mb-2 block">
                              {t.exhibitionNameLabel}
                            </label>
                            <input
                              type="text"
                              {...register("name")}
                              className={`w-full px-3 py-2 border rounded-sm focus:outline-none staff-field transition-colors ${
                                errors.name
                                  ? "border-red-300"
                                  : "border-[var(--staff-border)]"
                              }`}
                              placeholder={t.enterExhibitionName}
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="staff-type-label staff-text-primary mb-2 block">
                              {t.descriptionLabel}
                            </label>
                            <textarea
                              {...register("description")}
                              rows={4}
                              className={`w-full px-3 py-2 border rounded-sm focus:outline-none staff-field transition-colors resize-none ${
                                errors.description
                                  ? "border-red-300"
                                  : "border-[var(--staff-border)]"
                              }`}
                              placeholder={t.describeExhibition}
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                              </p>
                            )}
                          </div>



                          <div>
                            <label className="staff-type-label staff-text-primary mb-2 block">
                              {t.statusLabel}
                            </label>
                            <select
                              {...register("status")}
                              className="w-full px-3 py-2 border border-[var(--staff-border)] rounded-sm focus:outline-none staff-field transition-colors"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--staff-border)]">
                          <Link
                            href="/dashboard/staff/exhibitions"
                            className="staff-btn-secondary flex items-center gap-2"
                          >
                            <IconX className="h-4 w-4" />
                            {t.cancel}
                          </Link>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="staff-btn-primary flex items-center gap-2"
                          >
                            <IconDeviceFloppy className="h-4 w-4" />
                            {isSubmitting ? t.creating : t.createExhibition}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
