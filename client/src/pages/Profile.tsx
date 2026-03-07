import React from "react";
import TimelineSection from "@/components/TimelineSection";
import VisionSection from "@/components/VisionSection";
import PersonalDetailsSection from "@/components/PersonalDetailsSection";
import ContactSection from "@/components/ContactSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

export default function Profile() {
    return (
        <div className="min-h-screen pb-20">
            <PersonalDetailsSection />
            <div id="timeline">
                <TimelineSection />
            </div>
            <div id="vision">
                <VisionSection />
            </div>
            <div id="news">
                <NewsSection />
            </div>
            <div id="contact">
                <ContactSection />
            </div>
            <Footer />
        </div>
    );
}
