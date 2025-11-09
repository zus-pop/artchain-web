"use client";

import { useGetExhibitionById, useUpdateExhibition } from "@/apis/exhibition";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExhibitionStatus } from "@/types/exhibition";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCalendar,
  IconDeviceFloppy,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
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
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "CANCEL"]),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type ExhibitionFormData = z.infer<typeof exhibitionSchema>;

export default function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const router = useRouter();

  // Form setup with React Hook Form and Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ExhibitionFormData>({
    resolver: zodResolver(exhibitionSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "DRAFT",
    },
  });

  const watchedStartDate = watch("startDate");

  // Fetch exhibition details
  const { data: exhibitionResponse, isLoading } = useGetExhibitionById(id);
  const exhibition = exhibitionResponse?.data;

  // Mutations
  const updateExhibitionMutation = useUpdateExhibition();

  // Populate form when exhibition data is loaded
  useEffect(() => {
    if (exhibition) {
      reset({
        name: exhibition.name,
        description: exhibition.description,
        startDate: new Date(exhibition.startDate).toISOString().split("T")[0],
        endDate: new Date(exhibition.endDate).toISOString().split("T")[0],
        status: exhibition.status,
      });
    }
  }, [exhibition, reset]);

  const onSubmit = async (data: ExhibitionFormData) => {
    try {
      await updateExhibitionMutation.mutateAsync({
        exhibitionId: id,
        ...data,
      });

      router.push(`/dashboard/staff/exhibitions/${id}`);
    } catch (error) {
      console.error("Failed to update exhibition:", error);
    }
  };

  const statusOptions: ExhibitionStatus[] = [
    "DRAFT",
    "ACTIVE",
    "COMPLETED",
    "CANCEL",
  ];

  if (isLoading) {
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
          <SiteHeader title={t.editExhibitionTitle} />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 staff-text-secondary">
                {t.loadingExhibitionEdit}
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!exhibition) {
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
          <SiteHeader title={t.editExhibitionTitle} />
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="staff-text-secondary">{t.exhibitionNotFoundEdit}</p>
              <Link
                href="/dashboard/staff/exhibitions"
                className="staff-btn-primary mt-4 inline-block"
              >
                {t.backToExhibitionsEdit}
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader title={t.editExhibitionTitle} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-4 lg:px-6 py-2 border-b border-[#e6e2da] bg-[#fffdf9]">
            <Breadcrumb
              items={[
                {
                  label: t.exhibitionManagementBreadcrumb,
                  href: "/dashboard/staff/exhibitions",
                },
                {
                  label: exhibition.name,
                  href: `/dashboard/staff/exhibitions/${id}`,
                },
                { label: t.editBreadcrumb },
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
                      href={`/dashboard/staff/exhibitions/${id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t.backToExhibitionDetails}
                    >
                      <IconArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                      <h1 className="text-3xl font-bold staff-text-primary">
                        {t.editExhibitionDetails}
                      </h1>
                      <p className="text-sm staff-text-secondary mt-1">
                        {t.updateExhibitionInfo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/staff/exhibitions/${id}/paintings`}
                      className="staff-btn-secondary flex items-center gap-2"
                    >
                      <IconPhoto className="h-4 w-4" />
                      {t.managePaintingsBtn}
                    </Link>
                    <Link
                      href={`/dashboard/staff/exhibitions/${id}`}
                      className="staff-btn-secondary flex items-center gap-2"
                    >
                      <IconX className="h-4 w-4" />
                      {t.cancel}
                    </Link>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="staff-btn-primary flex items-center gap-2"
                    >
                      <IconDeviceFloppy className="h-4 w-4" />
                      {isSubmitting ? t.saving : t.saveChanges}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Form Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Exhibition Details */}
                    <div className="staff-card p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconCalendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold staff-text-primary">
                            {t.exhibitionDetails}
                          </h2>
                          <p className="text-sm staff-text-secondary">
                            {t.basicExhibitionInfo}
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium staff-text-primary mb-2">
                              {t.exhibitionNameLabel}
                            </label>
                            <input
                              type="text"
                              {...register("name")}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.name
                                  ? "border-red-300"
                                  : "border-[#e6e2da]"
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
                            <label className="block text-sm font-medium staff-text-primary mb-2">
                              {t.descriptionLabel}
                            </label>
                            <textarea
                              {...register("description")}
                              rows={4}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                errors.description
                                  ? "border-red-300"
                                  : "border-[#e6e2da]"
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
                            <label className="block text-sm font-medium staff-text-primary mb-2">
                              {t.startDateLabel}
                            </label>
                            <input
                              type="date"
                              {...register("startDate")}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.startDate
                                  ? "border-red-300"
                                  : "border-[#e6e2da]"
                              }`}
                            />
                            {errors.startDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.startDate.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium staff-text-primary mb-2">
                              {t.endDateLabel}
                            </label>
                            <input
                              type="date"
                              {...register("endDate")}
                              min={watchedStartDate}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.endDate
                                  ? "border-red-300"
                                  : "border-[#e6e2da]"
                              }`}
                            />
                            {errors.endDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.endDate.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium staff-text-primary mb-2">
                              {t.statusLabel}
                            </label>
                            <select
                              {...register("status")}
                              className="w-full px-3 py-2 border border-[#e6e2da] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Sidebar Column */}
                  <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Quick Stats */}
                    <div className="staff-card p-6">
                      <h3 className="text-lg font-semibold staff-text-primary mb-4">
                        {t.exhibitionStats}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm staff-text-secondary">
                            {t.totalPaintings}
                          </span>
                          <span className="font-semibold staff-text-primary text-lg">
                            {exhibition.exhibitionPaintings?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm staff-text-secondary">
                            {t.statusLabel}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              exhibition.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : exhibition.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : exhibition.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exhibition.status}
                          </span>
                        </div>
                        <div className="flex flex-col py-2">
                          <span className="text-sm staff-text-secondary mb-1">
                            {t.duration}
                          </span>
                          <span className="text-sm font-medium staff-text-primary">
                            {new Date(
                              exhibition.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(exhibition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
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
