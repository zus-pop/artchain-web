"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CardSwap, { Card } from "../../../components/CardSwap";
import { useGetExhibitions } from "@/apis/exhibition";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const page = () => {
  const router = useRouter();
  const { data: exhibitions } = useGetExhibitions();
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden overflow-y-hidden bg-[#EAE6E0] min-h-screen flex">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Triển lãm</h1>
        {/* <p className="text-lg text-gray-600 mb-4">
          Khám phá bộ sưu tập nghệ thuật độc đáo của chúng tôi, nơi hội tụ những tác phẩm xuất sắc từ các họa sĩ tài năng.
        </p> */}
        <p className="text-lg text-gray-600 mb-4">
          Mỗi bức tranh kể một câu chuyện riêng, thể hiện sự sáng tạo vô hạn và
          cảm xúc sâu sắc của con người.
        </p>
        {/* <p className="text-lg text-gray-600 mb-4">
          Hãy để trí tưởng tượng của bạn bay bổng cùng những nét vẽ tinh tế và màu sắc sống động.
        </p> */}
        <p className="text-lg text-gray-600">
          Tham quan triển lãm để trải nghiệm nghệ thuật đích thực và tìm cảm
          hứng cho chính mình.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="overflow-hidden relative mt-4 w-50 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group">
              Xem triển lãm
              <span className="absolute w-56 h-32 -top-8 -left-2 bg-orange-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"></span>
              <span className="absolute w-56 h-32 -top-8 -left-2 bg-orange-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"></span>
              <span className="absolute w-56 h-32 -top-8 -left-2 bg-orange-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-15 z-10">
                Bắt đầu
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-[#EAE6E0]">
            <DialogHeader>
              <DialogTitle>Chọn triển lãm</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {exhibitions?.data?.slice(0, 5).map((exhibition) => (
                <button
                  key={exhibition.exhibitionId}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/exhibition/${exhibition.exhibitionId}`);
                  }}
                  className="w-full text-left bg-black p-3 rounded-lg hover:bg-[#FF6E1A] cursor-pointer transition-colors text-white"
                >
                  <div className="font-medium">{exhibition.name}</div>
                </button>
              )) || <p>Không có triển lãm nào.</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-1/2" style={{ height: "600px", position: "relative" }}>
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={3000}
          pauseOnHover={false}
        >
          <Card className="text-white">
            <div className="ml-4">Duong Cong Son</div>
            <img
              src="https://images.unsplash.com/photo-1694158746751-08001e0f9926?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Card 1"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
          <Card className="text-white">
            <div className="ml-4">Hoang Ha Phuong Mai</div>
            <img
              src="https://images.unsplash.com/photo-1578301977886-43be7b983104?q=80&w=2123&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Card 2"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
          <Card className="text-white">
            <div className="ml-4">Le Thi My Hanh</div>
            <img
              src="https://images.unsplash.com/photo-1685391723465-7a4434823b2f?q=80&w=2849&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Card 3"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
        </CardSwap>
      </div>
    </div>
  );
};

export default page;
