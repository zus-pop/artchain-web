"use client";

import {
  useCreateBatchAward,
  useDeleteAward,
  useGetAwardsByContestId,
  useUpdateAward,
} from "@/apis/award";
import { getStaffContestById } from "@/apis/staff";
import { Breadcrumb } from "@/components/breadcrumb";
import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { Award, UpdateAwardRequest } from "@/types/award";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconTrash,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Contest } from "../../../../../../types";

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN");
};

export default function AwardManageSuspense() {
  return (
    <Suspense>
      <AwardManagementPage />
    </Suspense>
  );
}

function AwardManagementPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const contestId = searchParams.get("id") as string;

  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateAwardRequest | null>(
    null,
  );
  const [newAwards, setNewAwards] = useState<
    Array<{
      name: string;
      description: string;
      rank: number;
      quantity: number;
      prize: number;
    }>
  >([{ name: "", description: "", rank: 4, quantity: 1, prize: 0 }]);
  const [newAwardsErrors, setNewAwardsErrors] = useState<string[]>([]);
  const [editAwardError, setEditAwardError] = useState<string | null>(null);

  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const { data: contestData } = useQuery({
    queryKey: ["staff-contest", contestId],
    queryFn: () => getStaffContestById(Number(contestId)),
    enabled: !!contestId,
    staleTime: 2 * 60 * 1000,
  });

  const { data: awardsData } = useGetAwardsByContestId(contestId);
  const rawAwards = (awardsData?.data as Award[]) || [];
  const awards = [...rawAwards].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return parseFloat(b.prize) - parseFloat(a.prize);
  });
  const contest: Contest = contestData?.data;

  const createBatchMutation = useCreateBatchAward();
  const updateMutation = useUpdateAward(editingAward?.awardId || "");
  const deleteMutation = useDeleteAward();

  const validateAwardPrize = (rank: number, prize: number, name: string, skipAwardId?: string) => {
    if (prize < 1000) return { valid: false, message: "Giá trị giải thưởng phải lớn hơn 1000" };

    const higherRankingAwards = awards.filter(
      (a) => a.awardId !== skipAwardId && a.rank < rank && parseFloat(a.prize) > 0
    );
    const lowerRankingAwards = awards.filter(
      (a) => a.awardId !== skipAwardId && a.rank > rank && parseFloat(a.prize) > 0
    );

    for (const a of higherRankingAwards) {
      if (prize >= parseFloat(a.prize)) {
        return { 
          valid: false, 
          message: `${name} phải nhỏ hơn ${a.name}` 
        };
      }
    }

    for (const a of lowerRankingAwards) {
      if (prize <= parseFloat(a.prize)) {
        return { 
          valid: false, 
          message: `${name} phải lớn hơn ${a.name}` 
        };
      }
    }

    return { valid: true };
  };

  const validatePrizeHierarchy = (
    awardsToCheck: { rank: number; prize: number }[],
  ) => {
    // Sort awards by rank (lower number = higher rank), then by prize descending
    const sorted = [...awardsToCheck].sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.prize - a.prize;
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        if (
          sorted[i].rank < sorted[j].rank &&
          sorted[j].prize >= sorted[i].prize
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCreateAwards = async () => {
    const validAwards = newAwards.filter(
      (award) => award.name.trim() && award.prize > 0,
    );
    if (validAwards.length === 0) {
      toast.error(t.addAtLeastOneValidAward);
      return;
    }

    const newAwardsForValidation = validAwards.map((a) => ({
      rank: a.rank,
      prize: a.prize,
    }));

    if (!validatePrizeHierarchy(newAwardsForValidation)) {
      toast.error(
        "Giải thưởng thấp hơn không được có giá trị giải thưởng lớn hơn giải thưởng cao hơn trong danh sách tạo mới.",
      );
      return;
    }

    // Check each new award against existing awards
    const errors = [...newAwardsErrors];
    let hasError = false;

    for (let i = 0; i < validAwards.length; i++) {
      const award = validAwards[i];
      const validation = validateAwardPrize(award.rank, award.prize, award.name);
      if (!validation.valid) {
        errors[i] = validation.message || "";
        hasError = true;
      } else {
        errors[i] = "";
      }
    }

    setNewAwardsErrors(errors);
    if (hasError) return;

    await createBatchMutation.mutateAsync(
      {
        awards: validAwards.map((award) => ({
          contestId,
          ...award,
        })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["contest-detail"] });
        },
      },
    );

    setNewAwards([
      { name: "", description: "", rank: 4, quantity: 1, prize: 0 },
    ]);
  };

  const handleUpdateAward = async (
    awardId: string,
    updateData: UpdateAwardRequest,
  ) => {
    const validation = validateAwardPrize(updateData.rank as number, updateData.prize as number, updateData.name as string, awardId);
    if (!validation.valid) {
      setEditAwardError(validation.message || "");
      return;
    }
    setEditAwardError(null);

    await updateMutation.mutateAsync(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contest-detail"] });
      },
    });
    setEditingAward(null);
  };

  const handleDeleteAward = async (awardId: string) => {
    if (confirm(t.confirmDeleteAward)) {
      deleteMutation.mutate(awardId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["contest-detail"] });
        },
      });
    }
  };

  const addNewAwardField = () => {
    setNewAwards([
      ...newAwards,
      {
        name: "",
        description: "",
        rank: 4,
        quantity: 1,
        prize: 0,
      },
    ]);
  };

  const updateNewAward = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...newAwards];
    const award = { ...updated[index], [field]: value };
    updated[index] = award;
    setNewAwards(updated);

    // Real-time validation
    if (field === "prize" || field === "rank" || field === "name") {
      const updatedErrors = [...newAwardsErrors];
      const validation = validateAwardPrize(award.rank, award.prize, award.name);
      if (!validation.valid) {
        updatedErrors[index] = validation.message || "";
      } else {
        updatedErrors[index] = "";
      }
      setNewAwardsErrors(updatedErrors);
    }
  };

  const removeNewAward = (index: number) => {
    if (newAwards.length > 1) {
      setNewAwards(newAwards.filter((_, i) => i !== index));
    }
  };

  const startEditingAward = (award: Award) => {
    setEditingAward(award);
    setEditAwardError(null);
    setEditFormData({
      contestId,
      name: award.name,
      description: award.description,
      rank: award.rank,
      quantity: award.quantity,
      prize: parseFloat(award.prize),
    });
  };

  const cancelEditing = () => {
    setEditingAward(null);
    setEditFormData(null);
  };

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
        <SiteHeader title={`${contest?.title || "Contest"}`} />
        <div className="flex flex-1 flex-col">
          <div className="staff-page-header">
            <Breadcrumb
              items={[
                {
                  label: t.contestManagement,
                  href: "/dashboard/staff/contests",
                },
                {
                  label: contest?.title || "Contest Detail",
                  href: `/dashboard/staff/contests/detail?id=${contestId}`,
                },
                {
                  label: t.awardsBreadcrumb,
                  href: `/dashboard/staff/contests/awards?id=${contestId}`,
                },
                { label: t.manageBreadcrumb },
              ]}
              homeHref="/dashboard/staff"
            />
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="staff-type-page-title staff-text-primary">
                    {t.awardManagement} - {contest?.title || "Contest"}
                  </h2>
                  <p className="text-sm staff-text-secondary mt-1">
                    {t.createEditDeleteAwards}
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/staff/contests/awards?id=${contestId}`,
                    )
                  }
                  className="staff-btn-outline flex items-center gap-2"
                >
                  <IconArrowLeft className="h-4 w-4" />
                  {t.backToAwards}
                </button>
              </div>

              <div className="staff-card p-6">
                {/* Create New Awards */}
                <div className="mb-8">
                  <h4 className="staff-type-section-title staff-text-primary mb-4">
                    {t.createNewAwards}
                  </h4>
                  <div className="space-y-4">
                    {newAwards.map((award, index) => (
                      <div
                        key={index}
                        className="border border-[var(--staff-border)] rounded-sm p-4 bg-white"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium staff-text-primary mb-1">
                              {t.nameRequired}
                            </label>
                            <input
                              type="text"
                              value={award.name}
                              onChange={(e) =>
                                updateNewAward(index, "name", e.target.value)
                              }
                              className="staff-input w-full"
                              placeholder="Gold Award"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium staff-text-primary mb-1">
                              {t.prizeVNDRequired}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={award.prize === 0 ? "" : award.prize}
                                step={100_000}
                                min={0}
                                onKeyDown={(e) => {
                                  if (["-", "e", "E"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                onChange={(e) => {
                                  const val = e.target.value === ""
                                    ? 0
                                    : Math.max(0, Number(e.target.value));
                                  updateNewAward(index, "prize", val);
                                }}
                                className="staff-input w-full pr-20"
                                placeholder="0"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                                {formatCurrency(award.prize)} ₫
                              </div>
                            </div>
                            {newAwardsErrors[index] && (
                              <p className="mt-1 text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
                                {newAwardsErrors[index]}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          {newAwards.length > 1 && (
                            <button
                              onClick={() => removeNewAward(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 hover:border-red-400 rounded-sm transition-colors"
                            >
                              <IconX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium staff-text-primary mb-1">
                            {t.description}
                          </label>
                          <textarea
                            value={award.description}
                            onChange={(e) =>
                              updateNewAward(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="staff-input w-full"
                            rows={2}
                            placeholder="Description of the award"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-4">
                      <button
                        onClick={addNewAwardField}
                        className="staff-btn-outline flex items-center gap-2"
                      >
                        <IconPlus className="h-4 w-4" />
                        {t.addAnotherAward}
                      </button>
                      <button
                        onClick={handleCreateAwards}
                        disabled={createBatchMutation.isPending}
                        className="staff-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createBatchMutation.isPending
                          ? t.creatingAwards
                          : t.createAwards}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Awards List */}
                <div>
                  <h4 className="staff-type-section-title staff-text-primary mb-4">
                    {t.existingAwards} ({awards.length})
                  </h4>
                  <div className="space-y-4">
                    {awards.map((award) => (
                      <div
                        key={award.awardId}
                        className="border border-[var(--staff-border)] rounded-sm p-4 bg-white"
                      >
                        {editingAward?.awardId === award.awardId ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium staff-text-primary mb-1">
                                  {t.nameRequired}
                                </label>
                                <input
                                  type="text"
                                  value={editFormData?.name || ""}
                                  disabled={award.rank <= 3}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData!,
                                      name: e.target.value,
                                    })
                                  }
                                  className="staff-input w-full disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium staff-text-primary mb-1">
                                  {t.prizeVNDRequired}
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={
                                      editFormData?.prize === 0
                                        ? ""
                                        : editFormData?.prize
                                    }
                                    placeholder="0"
                                    onKeyDown={(e) => {
                                      if (["-", "e", "E"].includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value === ""
                                        ? 0
                                        : Math.max(0, Number(e.target.value));
                                      
                                      const newFormData = {
                                        ...editFormData!,
                                        prize: val,
                                      };
                                      setEditFormData(newFormData);

                                      // Real-time validation for edit mode
                                      const validation = validateAwardPrize(
                                        newFormData.rank as number, 
                                        newFormData.prize as number, 
                                        newFormData.name as string,
                                        editingAward?.awardId
                                      );
                                      if (!validation.valid) {
                                        setEditAwardError(validation.message || "");
                                      } else {
                                        setEditAwardError(null);
                                      }
                                    }}
                                    step={100_000}
                                    min={0}
                                    className="staff-input w-full pr-20"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                                    {formatCurrency(editFormData?.prize || 0)} ₫
                                  </div>
                                </div>
                                {editAwardError && (
                                  <p className="mt-1 text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
                                    {editAwardError}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium staff-text-primary mb-1">
                                {t.description}
                              </label>
                              <textarea
                                value={editFormData?.description || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData!,
                                    description: e.target.value,
                                  })
                                }
                                className="staff-input w-full"
                                rows={2}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  editFormData &&
                                  handleUpdateAward(award.awardId, editFormData)
                                }
                                disabled={updateMutation.isPending}
                                className="staff-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updateMutation.isPending
                                  ? t.updatingAward
                                  : t.updateAward}
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="staff-btn-outline"
                              >
                                {t.cancelAwardEdit}
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <IconTrophy className="h-5 w-5 text-yellow-600" />
                                <h5 className="staff-type-section-title staff-text-primary">
                                  {award.name}
                                </h5>
                              </div>
                              <p className="text-sm staff-text-secondary mb-2">
                                {award.description}
                              </p>
                              <div className="flex gap-4 text-sm">
                                <span className="font-medium text-green-600">
                                  {formatCurrency(parseFloat(award.prize))} ₫
                                </span>
                                <span className="staff-text-secondary">
                                  {award.paintings.length}/{award.quantity}{" "}
                                  {t.assigned}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditingAward(award)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-sm transition-colors"
                                title="Edit Award"
                              >
                                <IconEdit className="h-4 w-4" />
                              </button>
                              {award.rank > 3 && (
                                <button
                                  onClick={() =>
                                    handleDeleteAward(award.awardId)
                                  }
                                  disabled={deleteMutation.isPending}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                                  title="Delete Award"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {awards.length === 0 && (
                      <div className="text-center py-8 text-sm staff-text-secondary">
                        {t.noAwardsCreatedYet}
                      </div>
                    )}
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
