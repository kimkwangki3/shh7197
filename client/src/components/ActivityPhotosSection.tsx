import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Users, GraduationCap, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import meetingImage from "@assets/generated_images/Community_committee_meeting_scene_7d45e13c.png";
import cleanupImage from "@assets/generated_images/Environmental_cleanup_volunteer_activity_a7e14e5b.png";
import townHallImage from "@assets/generated_images/Town_hall_community_meeting_aabe5967.png";
import planningImage from "@assets/generated_images/Urban_development_planning_meeting_c6a47456.png";
import bloodDonationImage from "@assets/generated_images/Community_blood_donation_campaign_ebe5b689.png";
import jobFairImage from "@assets/generated_images/Youth_job_fair_event_b71e244b.png";
import dialogueImage from "@assets/generated_images/Citizen_dialogue_meeting_outdoors_401bd340.png";
import mealServiceImage from "@assets/generated_images/Community_volunteer_meal_service_722d98aa.png";

// 실제 교육발전위원회 활동 사진들
import edu1 from "@assets/KakaoTalk_20250916_144048832_1758007992528.jpg";
import edu2 from "@assets/KakaoTalk_20250916_144048832_01_1758007992528.jpg";
import edu3 from "@assets/KakaoTalk_20250916_144048832_02_1758007992528.jpg";
import edu4 from "@assets/KakaoTalk_20250916_144048832_03_1758007992528.jpg";
import edu5 from "@assets/KakaoTalk_20250916_144048832_04_1758007992529.jpg";
import edu6 from "@assets/KakaoTalk_20250916_144048832_05_1758007992529.jpg";
import edu7 from "@assets/KakaoTalk_20250916_144048832_06_1758007992529.jpg";
import edu8 from "@assets/KakaoTalk_20250916_144048832_07_1758007992530.jpg";
import edu9 from "@assets/KakaoTalk_20250916_144318052_04_1758007992530.jpg";
import edu10 from "@assets/KakaoTalk_20250916_144318052_05_1758007992530.jpg";
import edu11 from "@assets/KakaoTalk_20250916_144318052_06_1758007992531.jpg";
import edu12 from "@assets/KakaoTalk_20250916_144318052_07_1758007992531.jpg";
import edu13 from "@assets/KakaoTalk_20250916_144318052_12_1758007992531.jpg";
import edu14 from "@assets/KakaoTalk_20250916_143517321_1758007992526.jpg";
import edu15 from "@assets/KakaoTalk_20250916_143714405_1758007992527.jpg";

// 실제 신대지구 발전위원회 활동 사진들
import dev1 from "@assets/20210615_1_bodyimg_720448_1758008363453.jpg";
import dev2 from "@assets/20210712153125_514069_1_1758008363453.jpg";
import dev3 from "@assets/KakaoTalk_20250916_143651294_1758008363453.jpg";
import dev4 from "@assets/KakaoTalk_20250916_143651294_01_1758008363453.jpg";
import dev5 from "@assets/KakaoTalk_20250916_143651294_02_1758008363453.jpg";

// 실제 사회공헌활동 사진들
import rep1 from "@assets/KakaoTalk_20250916_144318052_1758008531602.jpg";
import rep2 from "@assets/KakaoTalk_20250916_144318052_01_1758008531602.jpg";
import rep3 from "@assets/KakaoTalk_20250916_144318052_02_1758008531603.jpg";
import rep4 from "@assets/KakaoTalk_20250916_144318052_03_1758008531603.jpg";
import rep5 from "@assets/KakaoTalk_20250916_144318052_08_1758008531603.jpg";
import rep6 from "@assets/KakaoTalk_20250916_144318052_09_1758008531604.jpg";
import rep7 from "@assets/KakaoTalk_20250916_144318052_10_1758008531604.jpg";
import rep8 from "@assets/KakaoTalk_20250916_144318052_11_1758008531604.jpg";

interface RegularPhoto {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}

interface SimplePhoto {
  id: number;
  image: string;
}

export default function ActivityPhotosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<"development" | "education" | "representative">("education");

  const activityPhotos = {
    development: [
      { id: 1, image: dev1 },
      { id: 2, image: dev2 },
      { id: 3, image: dev3 },
      { id: 4, image: dev4 },
      { id: 5, image: dev5 }
    ] as SimplePhoto[],
    education: [
      { id: 5, image: edu1 },
      { id: 6, image: edu2 },
      { id: 7, image: edu3 },
      { id: 8, image: edu4 },
      { id: 9, image: edu5 },
      { id: 10, image: edu6 },
      { id: 11, image: edu7 },
      { id: 12, image: edu8 },
      { id: 13, image: edu9 },
      { id: 14, image: edu10 },
      { id: 15, image: edu11 },
      { id: 16, image: edu12 },
      { id: 17, image: edu13 },
      { id: 18, image: edu14 },
      { id: 19, image: edu15 }
    ] as SimplePhoto[],
    representative: [
      { id: 9, image: rep1 },
      { id: 10, image: rep2 },
      { id: 11, image: rep3 },
      { id: 12, image: rep4 },
      { id: 13, image: rep5 },
      { id: 14, image: rep6 },
      { id: 15, image: rep7 },
      { id: 16, image: rep8 }
    ] as SimplePhoto[]
  };

  const tabConfig = [
    {
      value: "education", 
      label: "교육발전 위원회",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      value: "development",
      label: "신대지구 발전위원회",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      value: "representative",
      label: "사회공헌활동",
      icon: Heart,
      color: "text-purple-600", 
      bgColor: "bg-purple-50 dark:bg-purple-950"
    }
  ];

  const getCurrentImages = () => activityPhotos[currentTab];

  const openImageModal = (index: number, tab: "development" | "education" | "representative") => {
    setCurrentTab(tab);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      closeImageModal();
    }
  };

  return (
    <>
      {/* Image Gallery Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-7xl w-full max-h-screen h-full p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">활동 사진 갤러리</DialogTitle>
          <DialogDescription className="sr-only">
            활동 사진을 확대해서 볼 수 있습니다. 좌우 화살표로 이전/다음 사진으로 이동할 수 있고, ESC 키로 닫을 수 있습니다.
          </DialogDescription>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeImageModal}
              data-testid="close-modal-button"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
              onClick={goToPrevious}
              data-testid="previous-image-button"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
              onClick={goToNext}
              data-testid="next-image-button"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Current Image */}
            {isModalOpen && (
              <motion.img
                src={getCurrentImages()[currentImageIndex]?.image}
                alt="활동 사진"
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                data-testid="modal-image"
              />
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
              <span className="text-sm">
                {currentImageIndex + 1} / {getCurrentImages().length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-20 bg-muted/30" data-testid="activity-photos-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Camera className="w-8 h-8 text-primary" />
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">활동 사진</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            지역사회 발전을 위한 다양한 활동과 참여 모습을 담았습니다
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="education" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 h-auto p-2 bg-background/50 backdrop-blur-sm">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  data-testid={`tab-${tab.value}`}
                >
                  <tab.icon className={`w-5 h-5 ${tab.color}`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 신대지구 발전위원 탭 - 사진만 표시 */}
            <TabsContent value="development" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {activityPhotos.development.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div 
                      className="aspect-[4/3] relative overflow-hidden rounded-lg hover-elevate group cursor-pointer" 
                      data-testid={`photo-card-${photo.id}`}
                      onClick={() => openImageModal(index, "development")}
                    >
                      <img
                        src={photo.image}
                        alt="신대지구 발전위원회 활동 사진"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* 교육발전 위원회 탭 - 사진만 표시 */}
            <TabsContent value="education" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {activityPhotos.education.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div 
                      className="aspect-[4/3] relative overflow-hidden rounded-lg hover-elevate group cursor-pointer" 
                      data-testid={`photo-card-${photo.id}`}
                      onClick={() => openImageModal(index, "education")}
                    >
                      <img
                        src={photo.image}
                        alt="교육발전위원회 활동 사진"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* 사회공헌활동 탭 - 사진만 표시 */}
            <TabsContent value="representative" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {activityPhotos.representative.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div 
                      className="aspect-[4/3] relative overflow-hidden rounded-lg hover-elevate group cursor-pointer" 
                      data-testid={`photo-card-${photo.id}`}
                      onClick={() => openImageModal(index, "representative")}
                    >
                      <img
                        src={photo.image}
                        alt="사회공헌활동 사진"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
    </>
  );
}