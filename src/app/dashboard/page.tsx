import Banner from "@/components/home/Banner";
import Categories from "@/components/home/Categories";
import Faq from "@/components/home/Faq";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import HowItWorks from "@/components/home/HowItWorks";
import OwnerCta from "@/components/home/OwnerCta";
import Reviews from "@/components/home/Reviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { getFeaturedEquipment, getReviews } from "@/lib/data";

export default async function Home() {
  const [featured, reviews] = await Promise.all([
    getFeaturedEquipment(),
    getReviews(),
  ]);

  return (
    <>
      <Banner />
      <FeaturedEquipment items={featured} />
      <Categories />
      <WhyChooseUs />
      <HowItWorks />
      <Reviews reviews={reviews} />
      <Faq />
      <OwnerCta />
    </>
  );
}