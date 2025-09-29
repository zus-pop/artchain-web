"use client";
import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockArtPosts } from "@/store/mock/posts";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

const UserProfilePage = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  
  return (
    <>
      <section className="relative block h-96">
        <div 
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}
        >
          <span className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
      </section>
      <section className="relative py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white/90 backdrop-blur-sm w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-between items-start relative">
                {/* Left side - Avatar and Name */}
                <div className="w-full lg:w-6/12 px-4 flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <Image
                      alt="Profile"
                      src="https://images.unsplash.com/photo-1600791575280-1f7ca48b9a57?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      width={150}
                      height={150}
                      className="shadow-xl rounded-full border-4 border-white absolute -top-16 max-w-[150px]"
                    />
                  </div>
                  <div className="flex-1 pt-4 ml-40">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-semibold leading-normal text-gray-800">
                        Jenna Stones
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
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-400"></i>
                      Los Angeles, California
                    </div>
                  </div>
                </div>
                
                {/* Right side - Stats */}
                <div className="w-full lg:w-4/12 px-4 lg:text-right mt-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex justify-center lg:justify-end items-center divide-x divide-gray-300">
                      <div className="text-center px-6">
                        <span className="text-2xl font-bold block uppercase tracking-wide text-gray-600">
                          22
                        </span>
                        <span className="text-sm text-gray-400">{t.friends}</span>
                      </div>
                      <div className="text-center px-6">
                        <span className="text-2xl font-bold block uppercase tracking-wide text-gray-600">
                          10
                        </span>
                        <span className="text-sm text-gray-400">{t.photos}</span>
                      </div>
                      <div className="text-center px-6">
                        <span className="text-2xl font-bold block uppercase tracking-wide text-gray-600">
                          89
                        </span>
                        <span className="text-sm text-gray-400">{t.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-10 border-t border-gray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-gray-700">
                      An artist of considerable range, Jenna the name taken by
                      Melbourne-raised, Brooklyn-based Nick Murphy writes,
                      performs and records all of his own music, giving it a
                      warm, intimate feel with a solid groove structure. An
                      artist of considerable range.
                    </p>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="gallery">{t.galleryTab}</TabsTrigger>
                  <TabsTrigger value="collections">{t.collections}</TabsTrigger>
                  <TabsTrigger value="competitions">{t.competitions}</TabsTrigger>
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

                <TabsContent value="collections">
                  <p>{t.collectionsPlaceholder}</p>
                </TabsContent>

                <TabsContent value="competitions">
                  <p>{t.competitionsPlaceholder}</p>
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
};

export default UserProfilePage;
