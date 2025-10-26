import { GuardianChild, WhoAmI } from "@/types";
import Image from "next/image";
import UserProfileCards from "../UserProfileCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Plus } from "lucide-react";

interface GuardianProfileScreenProps {
  authUser: WhoAmI | null;
  guardianChildren: GuardianChild[] | undefined;
  isLoadingChildren: boolean;
}

// GUARDIAN PROFILE SCREEN COMPONENT
export default function GuardianProfileScreen({
  authUser,
  guardianChildren,
  isLoadingChildren,
}: GuardianProfileScreenProps) {
  return (
    <>
      <section className="relative block h-96">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <span className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
      </section>
      <section className="relative py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 wrap-break-word bg-white/90 backdrop-blur-sm w-full mb-6 shadow-xl -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-between items-start relative">
                {/* Left side - Avatar and Name */}
                <div className="w-full lg:w-6/12 px-4 flex items-start space-x-6">
                  <div className="relative shrink-0">
                    <Image
                      alt="Profile"
                      src="https://images.unsplash.com/photo-1727386245656-d6e2d264e6b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1057"
                      width={150}
                      height={150}
                      className="shadow-xl rounded-full border-4 border-white absolute -top-16 max-w-[150px]"
                    />
                  </div>
                  <div className="flex-1 pt-4 ml-40">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-semibold leading-normal text-gray-800">
                        {authUser ? authUser.fullName : "Loading..."}
                      </h3>
                      <button
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200"
                        type="button"
                        title="Edit Profile"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-sm leading-normal mt-0 mb-2 text-muted-foreground font-bold uppercase">
                      <i className="fas fa-user-shield mr-2 text-lg text-primary"></i>
                      Phụ huynh
                    </div>
                  </div>
                </div>

                {/* Right side - Stats */}
                <div className="w-full lg:w-6/12 px-4 mt-2">
                  <div className="flex justify-center lg:justify-end items-center divide-x divide-gray-300">
                    <UserProfileCards
                      birthday={authUser?.birthday}
                      ward={authUser?.ward}
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Stats */}
              <div className="py-10 border-t border-gray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4">
                    <div className="p-2 pt-3 pb-1.5 flex flex-col rounded-xl backdrop-blur-lg bg-primary/5 text-foreground w-full mx-auto mb-6">
                      <div className="flex divide-x divide-border">
                        <div className="flex-1 pr-6">
                          <p className="text-xs font-medium text-muted-foreground">
                            Con em tham gia
                          </p>
                          <p className="text-xl font-semibold text-foreground">
                            {guardianChildren?.length || 0}
                          </p>
                        </div>
                        <div className="flex-1 pl-6">
                          <p className="text-xs font-medium text-muted-foreground">
                            Bài dự thi
                          </p>
                          <p className="text-xl font-semibold text-foreground">
                            {guardianChildren?.reduce(
                              (total, child) =>
                                total + (child.status === 1 ? 1 : 0),
                              0
                            ) || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Tabs */}
              <Tabs defaultValue="children" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="children">Con em</TabsTrigger>
                  <TabsTrigger value="competitions">Cuộc thi</TabsTrigger>
                  <TabsTrigger value="progress">Tiến độ</TabsTrigger>
                  <TabsTrigger value="about">Thông tin</TabsTrigger>
                </TabsList>

                <TabsContent value="children" className="mb-8">
                  <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Quản lý con em
                          </h3>
                          <p className="text-muted-foreground">
                            Theo dõi và quản lý thông tin các con em tham gia
                            cuộc thi nghệ thuật.
                          </p>
                        </div>
                        <Link
                          href="/add-child"
                          className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors flex items-center space-x-2 font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Thêm con em</span>
                        </Link>
                      </div>
                      {isLoadingChildren ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2">
                            Đang tải danh sách con em...
                          </p>
                        </div>
                      ) : guardianChildren && guardianChildren.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {guardianChildren.map((child) => (
                            <div
                              key={child.userId}
                              className="bg-card p-4 border border-border"
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-primary-foreground font-semibold">
                                    {child.fullName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {child.fullName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {child.username}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {child.email}
                                </p>
                                <p>
                                  <span className="font-medium">Trường:</span>{" "}
                                  {child.schoolName || "Chưa cập nhật"}
                                </p>
                                <p>
                                  <span className="font-medium">Lớp:</span>{" "}
                                  {child.grade || "N/A"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted rounded-lg">
                          <p className="text-muted-foreground">
                            Chưa có con em nào được đăng ký
                          </p>
                          <p className="text-sm text-muted-foreground/70 mt-1">
                            Hãy thêm con em để bắt đầu tham gia cuộc thi
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="competitions">
                  <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Cuộc thi đang tham gia
                    </h3>
                    <p className="text-muted-foreground">
                      Theo dõi các cuộc thi mà con em đang tham gia.
                    </p>
                    {/* Add competitions content for guardian */}
                  </div>
                </TabsContent>

                <TabsContent value="progress">
                  <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Tiến độ học tập
                    </h3>
                    <p className="text-muted-foreground">
                      Theo dõi sự phát triển và thành tích của con em trong nghệ
                      thuật.
                    </p>
                    {/* Add progress tracking content */}
                  </div>
                </TabsContent>

                <TabsContent value="about">
                  <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Thông tin phụ huynh
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                          Họ và tên
                        </label>
                        <p className="text-foreground">{authUser?.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                          Email
                        </label>
                        <p className="text-foreground">{authUser?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                          Số điện thoại
                        </label>
                        <p className="text-foreground">
                          {authUser?.phone || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
