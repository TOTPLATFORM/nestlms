import AboutUsSection from "@/section/user/AboutUsSection";
import AchievementSection from "@/section/user/AchievementSection";
import BlogSection from "@/section/user/BlogSection";
import CategorySection from "@/section/user/CategorySection";
import FaqSection from "@/section/user/FaqSection";
import HeroSection from "@/section/user/HeroSection";
import HowItWork from "@/section/user/HowItWork";
import InstructorSection from "@/section/user/InstructorSection";
import MostPopularCourse from "@/section/user/MostPopularCourse";
import NewCategorySection from "@/section/user/NewCategorySection";
import TestimonialSection from "@/section/user/TestimonialSection";
import WhyChooseUs from "@/section/user/WhyChooseUs";
import { landingPageData } from "@/service/common";

const HomePage = async () => {
  const response: any = await landingPageData();
  const landing_data = response?.landing_data;
  const instructor_list = response?.instructor_list;
  const faq_list = response?.faq_list;
  return (
    <main>
      <HeroSection landing_data={landing_data} />
      <AchievementSection landing_data={landing_data} />
      <NewCategorySection />
      <AboutUsSection landing_data={landing_data} />

      {response?.course_list?.length > 0 && (
        <MostPopularCourse courses={response?.course_list || []} />
      )}

      <WhyChooseUs landing_data={landing_data} />
      <InstructorSection instructor_list={instructor_list} />
      <HowItWork landing_data={landing_data} />
      {response?.blogList.length && <BlogSection blogs={response?.blogList} />}
      <FaqSection faq_list={faq_list} />
    </main>
  );
};
export default HomePage;
