import MySubmission from "@/components/tab/profile/MySubmission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockArtPosts } from "@/store/mock/posts";
import { WhoAmI } from "@/types";
import Image from "next/image";
import UserProfileCards from "../UserProfileCards";

interface CompetitorProfileScreenProps {
  authUser: WhoAmI | null;
  t: {
    galleryTab: string;
    competitions: string;
    mySubmissions: string;
    aboutTab: string;
    competitionsPlaceholder: string;
    aboutPlaceholder: string;
  };
}
export default function CompetitorProfileScreen({
  authUser,
  t,
}: CompetitorProfileScreenProps) {
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
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
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
                    <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                      <i className="fas fa-university mr-2 text-lg text-blue-500"></i>
                      {authUser ? authUser.schoolName : "School Name"}
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

              {/* Competitor Stats */}
              <div className="py-10 border-t border-gray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4">
                    <div className="p-2 pt-3 pb-1.5 flex flex-col rounded-xl backdrop-blur-lg bg-gray-50/10 text-gray-200 w-full mx-auto mb-6">
                      <div className="flex divide-x divide-neutral-800">
                        <div className="flex-1 pr-6">
                          <p className="text-xs font-medium text-neutral-500">
                            Bài dự thi
                          </p>
                          <p className="text-xl font-semibold text-gray-800">
                            50
                          </p>
                        </div>
                        <div className="flex-1 pl-6">
                          <p className="text-xs font-medium text-neutral-500">
                            Giải thưởng
                          </p>
                          <p className="text-xl font-semibold text-gray-800">
                            20
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor Tabs */}
              <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="gallery">{t.galleryTab}</TabsTrigger>
                  <TabsTrigger value="competitions">
                    {t.competitions}
                  </TabsTrigger>
                  <TabsTrigger value="mySubmissions">
                    {t.mySubmissions}
                  </TabsTrigger>
                  <TabsTrigger value="about">{t.aboutTab}</TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockArtPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded overflow-hidden shadow-lg bg-white"
                      >
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={300}
                          height={192}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h2 className="text-lg font-semibold">
                            {post.title}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {post.category}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="competitions">
                  <p>{t.competitionsPlaceholder}</p>
                </TabsContent>
                <TabsContent value="mySubmissions">
                  <MySubmission />
                </TabsContent>

                <TabsContent value="about">
                  <p>{t.aboutPlaceholder}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
